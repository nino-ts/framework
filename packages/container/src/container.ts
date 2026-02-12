/**
 * IoC Container implementation.
 *
 * @packageDocumentation
 */

import type { Binding, ContainerInterface, Factory } from '@/types';

/**
 * Exception thrown when a binding is not found in the container.
 *
 * @example
 * ```typescript
 * try {
 *   container.make('unknown');
 * } catch (error) {
 *   if (error instanceof BindingNotFoundException) {
 *     console.error('Service not found:', error.abstract);
 *   }
 * }
 * ```
 */
export class BindingNotFoundException extends Error {
    /**
     * The abstract key that was not found.
     */
    public readonly abstract: string;

    /**
     * Creates a new BindingNotFoundException.
     *
     * @param abstract - The key that was not found
     */
    constructor(abstract: string) {
        super(`Binding not found: ${abstract}`);
        this.name = 'BindingNotFoundException';
        this.abstract = abstract;
    }
}

/**
 * Exception thrown when a circular dependency is detected.
 *
 * @example
 * ```typescript
 * try {
 *   container.make('service-a');
 * } catch (error) {
 *   if (error instanceof CircularDependencyException) {
 *     console.error('Circular dependency:', error.chain);
 *   }
 * }
 * ```
 */
export class CircularDependencyException extends Error {
    /**
     * The chain of dependencies that caused the circular reference.
     */
    public readonly chain: readonly string[];

    /**
     * Creates a new CircularDependencyException.
     *
     * @param abstract - The key being resolved
     * @param chain - The current resolution chain
     */
    constructor(abstract: string, chain: readonly string[]) {
        super(`Circular dependency detected: ${[...chain, abstract].join(' -> ')}`);
        this.name = 'CircularDependencyException';
        this.chain = Object.freeze([...chain, abstract]);
    }
}

/**
 * IoC Container for managing dependencies and performing dependency injection.
 *
 * This implementation provides:
 * - Type-safe dependency injection
 * - Singleton and transient bindings
 * - Circular dependency detection
 * - Conditional binding
 * - Instance registration
 *
 * @example
 * ```typescript
 * const container = new Container();
 *
 * // Register a simple binding
 * container.bind<Logger>('logger', () => new ConsoleLogger());
 *
 * // Register a singleton
 * container.singleton<Database>('db', (c) => {
 *   const config = c.make<Config>('config');
 *   return new Database(config);
 * });
 *
 * // Resolve
 * const logger = container.make<Logger>('logger');
 * logger.log('Application started');
 * ```
 */
export class Container implements ContainerInterface {
    /**
     * The container's bindings.
     *
     * Maps abstract keys to their binding configurations.
     */
    private readonly bindings: Map<string, Binding> = new Map();

    /**
     * Track the current resolution chain to detect circular dependencies.
     */
    private readonly resolutionStack: Set<string> = new Set();

    /**
     * Register a binding in the container.
     *
     * Creates a transient binding - a new instance is created on each resolution.
     *
     * @typeParam T - The type of service to bind
     * @param abstract - The key to bind the service under
     * @param factory - Factory function to create the service
     * @returns void
     *
     * @example
     * ```typescript
     * container.bind<Logger>('logger', (c) => {
     *   return new ConsoleLogger();
     * });
     * ```
     */
    public bind<T>(abstract: string, factory: Factory<T>): void {
        this.bindings.set(abstract, {
            factory: factory as Factory<unknown>,
            shared: false,
        });
    }

    /**
     * Register a singleton binding in the container.
     *
     * The factory will only be called once, and the same instance
     * will be returned on subsequent calls.
     *
     * @typeParam T - The type of service to bind
     * @param abstract - The key to bind the service under
     * @param factory - Factory function to create the service
     * @returns void
     *
     * @example
     * ```typescript
     * container.singleton<Database>('db', (c) => {
     *   const config = c.make<Config>('config');
     *   return new Database(config);
     * });
     * ```
     */
    public singleton<T>(abstract: string, factory: Factory<T>): void {
        this.bindings.set(abstract, {
            factory: factory as Factory<unknown>,
            shared: true,
        });
    }

    /**
     * Register a binding only if it doesn't already exist.
     *
     * This is useful for providing default implementations that can be overridden.
     *
     * @typeParam T - The type of service to bind
     * @param abstract - The key to bind the service under
     * @param factory - Factory function to create the service
     * @returns void
     *
     * @example
     * ```typescript
     * // Provide a default logger
     * container.bindIf<Logger>('logger', () => new FileLogger());
     *
     * // This won't override the existing binding
     * container.bindIf<Logger>('logger', () => new ConsoleLogger());
     * ```
     */
    public bindIf<T>(abstract: string, factory: Factory<T>): void {
        if (!this.bound(abstract)) {
            this.bind(abstract, factory);
        }
    }

    /**
     * Register a singleton binding only if it doesn't already exist.
     *
     * @typeParam T - The type of service to bind
     * @param abstract - The key to bind the service under
     * @param factory - Factory function to create the service
     * @returns void
     *
     * @example
     * ```typescript
     * container.singletonIf<Cache>('cache', () => new MemoryCache());
     * ```
     */
    public singletonIf<T>(abstract: string, factory: Factory<T>): void {
        if (!this.bound(abstract)) {
            this.singleton(abstract, factory);
        }
    }

    /**
     * Register an existing instance in the container.
     *
     * This is equivalent to a singleton binding with a pre-constructed instance.
     *
     * @typeParam T - The type of the instance
     * @param abstract - The key to bind the instance under
     * @param instance - The instance to register
     * @returns void
     *
     * @example
     * ```typescript
     * const config = { debug: true, env: 'production' };
     * container.instance<Config>('config', config);
     * ```
     */
    public instance<T>(abstract: string, instance: T): void {
        this.bindings.set(abstract, {
            factory: (): T => instance,
            instance,
            shared: true,
        });
    }

    /**
     * Resolve a service from the container.
     *
     * @typeParam T - The expected type of the resolved service
     * @param abstract - The key of the service to resolve
     * @returns The resolved service instance
     * @throws {BindingNotFoundException} If the binding is not found
     * @throws {CircularDependencyException} If a circular dependency is detected
     *
     * @example
     * ```typescript
     * const logger = container.make<Logger>('logger');
     * logger.log('Hello world');
     * ```
     */
    public make<T>(abstract: string): T {
        // Check for circular dependency
        if (this.resolutionStack.has(abstract)) {
            throw new CircularDependencyException(abstract, Array.from(this.resolutionStack));
        }

        const binding: Binding | undefined = this.bindings.get(abstract);

        if (!binding) {
            throw new BindingNotFoundException(abstract);
        }

        // Handle singleton with cached instance
        if (binding.shared && binding.instance !== undefined) {
            return binding.instance as T;
        }

        // Add to resolution stack
        this.resolutionStack.add(abstract);

        try {
            const instance: T = binding.factory(this) as T;

            // Cache singleton instance
            if (binding.shared) {
                binding.instance = instance;
            }

            return instance;
        } finally {
            // Always remove from resolution stack (even if factory throws)
            this.resolutionStack.delete(abstract);
        }
    }

    /**
     * Check if a binding exists in the container.
     *
     * @param abstract - The key to check
     * @returns True if the binding exists, false otherwise
     *
     * @example
     * ```typescript
     * if (container.bound('logger')) {
     *   const logger = container.make<Logger>('logger');
     * }
     * ```
     */
    public bound(abstract: string): boolean {
        return this.bindings.has(abstract);
    }

    /**
     * Remove a binding from the container.
     *
     * @param abstract - The key to remove
     * @returns void
     *
     * @example
     * ```typescript
     * container.forget('logger');
     * ```
     */
    public forget(abstract: string): void {
        this.bindings.delete(abstract);
    }

    /**
     * Remove all bindings from the container.
     *
     * This effectively resets the container to its initial state.
     *
     * @returns void
     *
     * @example
     * ```typescript
     * // Clear all services
     * container.flush();
     *
     * // Re-register new services
     * container.bind('logger', () => new Logger());
     * ```
     */
    public flush(): void {
        this.bindings.clear();
        this.resolutionStack.clear();
    }
}
