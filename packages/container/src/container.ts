/**
 * IoC Container implementation.
 *
 * @packageDocumentation
 */

import type { Binding, Factory, ContainerInterface } from '@/types';

/**
 * Exception thrown when a binding is not found in the container.
 */
export class BindingNotFoundException extends Error {
    /**
     * Creates a new BindingNotFoundException.
     *
     * @param abstract - The key that was not found
     */
    constructor(abstract: string) {
        super(`Binding not found: ${abstract}`);
        this.name = 'BindingNotFoundException';
    }
}

/**
 * IoC Container for managing dependencies and performing dependency injection.
 *
 * @example
 * ```typescript
 * const container = new Container();
 *
 * // Register a simple binding
 * container.bind('logger', () => new ConsoleLogger());
 *
 * // Register a singleton
 * container.singleton('db', (c) => new Database(c.make('config')));
 *
 * // Resolve
 * const logger = container.make<Logger>('logger');
 * ```
 */
export class Container implements ContainerInterface {
    /**
     * The container's bindings.
     */
    private bindings: Map<string, Binding> = new Map();

    /**
     * Register a binding in the container.
     *
     * @param abstract - The key to bind the service under
     * @param factory - Factory function to create the service
     *
     * @example
     * ```typescript
     * container.bind('logger', () => new ConsoleLogger());
     * ```
     */
    bind<T>(abstract: string, factory: Factory<T>): void {
        this.bindings.set(abstract, {
            factory: factory as Factory<unknown>,
            shared: false,
        });
    }

    /**
     * Register a singleton binding in the container.
     * The factory will only be called once, and the same instance
     * will be returned on subsequent calls.
     *
     * @param abstract - The key to bind the service under
     * @param factory - Factory function to create the service
     *
     * @example
     * ```typescript
     * container.singleton('db', () => new Database());
     * ```
     */
    singleton<T>(abstract: string, factory: Factory<T>): void {
        this.bindings.set(abstract, {
            factory: factory as Factory<unknown>,
            shared: true,
        });
    }

    /**
     * Register a binding only if it doesn't already exist.
     *
     * @param abstract - The key to bind the service under
     * @param factory - Factory function to create the service
     *
     * @example
     * ```typescript
     * container.bindIf('logger', () => new FileLogger());
     * ```
     */
    bindIf<T>(abstract: string, factory: Factory<T>): void {
        if (!this.bound(abstract)) {
            this.bind(abstract, factory);
        }
    }

    /**
     * Register a singleton binding only if it doesn't already exist.
     *
     * @param abstract - The key to bind the service under
     * @param factory - Factory function to create the service
     */
    singletonIf<T>(abstract: string, factory: Factory<T>): void {
        if (!this.bound(abstract)) {
            this.singleton(abstract, factory);
        }
    }

    /**
     * Register an existing instance in the container.
     *
     * @param abstract - The key to bind the instance under
     * @param instance - The instance to register
     *
     * @example
     * ```typescript
     * const config = { debug: true };
     * container.instance('config', config);
     * ```
     */
    instance<T>(abstract: string, instance: T): void {
        this.bindings.set(abstract, {
            factory: () => instance,
            shared: true,
            instance,
        });
    }

    /**
     * Resolve a service from the container.
     *
     * @param abstract - The key of the service to resolve
     * @returns The resolved service instance
     * @throws {BindingNotFoundException} If the binding is not found
     *
     * @example
     * ```typescript
     * const logger = container.make<Logger>('logger');
     * ```
     */
    make<T>(abstract: string): T {
        const binding = this.bindings.get(abstract);

        if (!binding) {
            throw new BindingNotFoundException(abstract);
        }

        if (binding.shared) {
            if (binding.instance !== undefined) {
                return binding.instance as T;
            }

            const instance = binding.factory(this) as T;
            binding.instance = instance;
            return instance;
        }

        return binding.factory(this) as T;
    }

    /**
     * Check if a binding exists in the container.
     *
     * @param abstract - The key to check
     * @returns True if the binding exists
     *
     * @example
     * ```typescript
     * if (container.bound('logger')) {
     *   const logger = container.make('logger');
     * }
     * ```
     */
    bound(abstract: string): boolean {
        return this.bindings.has(abstract);
    }

    /**
     * Remove a binding from the container.
     *
     * @param abstract - The key to remove
     */
    forget(abstract: string): void {
        this.bindings.delete(abstract);
    }

    /**
     * Remove all bindings from the container.
     */
    flush(): void {
        this.bindings.clear();
    }
}
