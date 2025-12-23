/**
 * Ninots Framework - Service Container (IoC)
 * Inspired by Laravel's Service Container
 * Zero dependencies implementation
 */

import type { ServiceFactory, ServiceBinding } from '../types';

export class Container {
  private static instance: Container | null = null;
  private bindings: Map<string | symbol, ServiceBinding<unknown>> = new Map();
  private aliases: Map<string, string | symbol> = new Map();
  private resolved: Set<string | symbol> = new Set();
  private contextualBindings: Map<string, Map<string | symbol, ServiceFactory<unknown>>> = new Map();

  /**
   * Get the singleton instance of the container
   */
  static getInstance(): Container {
    if (!Container.instance) {
      Container.instance = new Container();
    }
    return Container.instance;
  }

  /**
   * Reset the container instance (useful for testing)
   */
  static resetInstance(): void {
    Container.instance = null;
  }

  /**
   * Bind a service to the container
   */
  bind<T>(abstract: string | symbol, factory: ServiceFactory<T>, singleton: boolean = false): this {
    this.bindings.set(abstract, {
      factory,
      singleton,
    });
    return this;
  }

  /**
   * Bind a singleton service to the container
   */
  singleton<T>(abstract: string | symbol, factory: ServiceFactory<T>): this {
    return this.bind(abstract, factory, true);
  }

  /**
   * Bind an existing instance to the container
   */
  instance<T>(abstract: string | symbol, instance: T): this {
    this.bindings.set(abstract, {
      factory: () => instance,
      singleton: true,
      instance,
    });
    this.resolved.add(abstract);
    return this;
  }

  /**
   * Create an alias for a binding
   */
  alias(alias: string, abstract: string | symbol): this {
    this.aliases.set(alias, abstract);
    return this;
  }

  /**
   * Define a contextual binding
   */
  when(concrete: string): ContextualBindingBuilder {
    return new ContextualBindingBuilder(this, concrete);
  }

  /**
   * Add a contextual binding
   */
  addContextualBinding<T>(
    concrete: string,
    abstract: string | symbol,
    factory: ServiceFactory<T>
  ): this {
    if (!this.contextualBindings.has(concrete)) {
      this.contextualBindings.set(concrete, new Map());
    }
    const bindings = this.contextualBindings.get(concrete);
    if (bindings) {
      bindings.set(abstract, factory);
    }
    return this;
  }

  /**
   * Resolve a service from the container
   */
  make<T>(abstract: string | symbol, context?: string): T {
    // Check for alias
    const resolved = this.getAlias(abstract);

    // Check for contextual binding
    if (context && this.contextualBindings.has(context)) {
      const contextualFactory = this.contextualBindings.get(context)?.get(resolved);
      if (contextualFactory) {
        return contextualFactory() as T;
      }
    }

    // Check if binding exists
    const binding = this.bindings.get(resolved);
    if (!binding) {
      throw new Error(`Service [${String(resolved)}] not found in container`);
    }

    // Return existing singleton instance
    if (binding.singleton && binding.instance !== undefined) {
      return binding.instance as T;
    }

    // Create new instance
    const instance = binding.factory() as T;

    // Store singleton instance
    if (binding.singleton) {
      binding.instance = instance;
      this.resolved.add(resolved);
    }

    return instance;
  }

  /**
   * Try to resolve a service, returning null if not found
   */
  makeOrNull<T>(abstract: string | symbol, context?: string): T | null {
    try {
      return this.make<T>(abstract, context);
    } catch {
      return null;
    }
  }

  /**
   * Check if a binding exists
   */
  has(abstract: string | symbol): boolean {
    const resolved = this.getAlias(abstract);
    return this.bindings.has(resolved);
  }

  /**
   * Check if a service has been resolved
   */
  isResolved(abstract: string | symbol): boolean {
    const resolved = this.getAlias(abstract);
    return this.resolved.has(resolved);
  }

  /**
   * Remove a binding from the container
   */
  forget(abstract: string | symbol): this {
    const resolved = this.getAlias(abstract);
    this.bindings.delete(resolved);
    this.resolved.delete(resolved);
    return this;
  }

  /**
   * Clear all bindings
   */
  flush(): this {
    this.bindings.clear();
    this.aliases.clear();
    this.resolved.clear();
    this.contextualBindings.clear();
    return this;
  }

  /**
   * Get all binding keys
   */
  getBindings(): (string | symbol)[] {
    return Array.from(this.bindings.keys());
  }

  /**
   * Get the alias for an abstract
   */
  private getAlias(abstract: string | symbol): string | symbol {
    if (typeof abstract === 'string' && this.aliases.has(abstract)) {
      return this.aliases.get(abstract) ?? abstract;
    }
    return abstract;
  }

  /**
   * Call a method on a resolved service
   */
  call<T, R>(abstract: string | symbol, method: keyof T, args: unknown[] = []): R {
    const instance = this.make<T>(abstract);
    const fn = instance[method];
    if (typeof fn !== 'function') {
      throw new Error(`Method [${String(method)}] not found on service [${String(abstract)}]`);
    }
    return (fn as (...args: unknown[]) => R).apply(instance, args);
  }
}

/**
 * Contextual Binding Builder
 */
class ContextualBindingBuilder {
  constructor(
    private container: Container,
    private concrete: string
  ) {}

  needs<T>(abstract: string | symbol): ContextualBindingGiver<T> {
    return new ContextualBindingGiver<T>(this.container, this.concrete, abstract);
  }
}

class ContextualBindingGiver<T> {
  constructor(
    private container: Container,
    private concrete: string,
    private abstract: string | symbol
  ) {}

  give(factory: ServiceFactory<T>): Container {
    return this.container.addContextualBinding(this.concrete, this.abstract, factory);
  }
}

// Global container helper function
export function container(): Container {
  return Container.getInstance();
}

// Resolve helper
export function resolve<T>(abstract: string | symbol): T {
  return Container.getInstance().make<T>(abstract);
}
