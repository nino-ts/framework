/**
 * IoC Container implementation.
 *
 * @packageDocumentation
 */
import type { ContainerInterface, Factory } from "./types";
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
export declare class BindingNotFoundException extends Error {
    /**
     * The abstract key that was not found.
     */
    readonly abstract: string;
    /**
     * Creates a new BindingNotFoundException.
     *
     * @param abstract - The key that was not found
     */
    constructor(abstract: string);
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
export declare class CircularDependencyException extends Error {
    /**
     * The chain of dependencies that caused the circular reference.
     */
    readonly chain: readonly string[];
    /**
     * Creates a new CircularDependencyException.
     *
     * @param abstract - The key being resolved
     * @param chain - The current resolution chain
     */
    constructor(abstract: string, chain: readonly string[]);
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
export declare class Container implements ContainerInterface {
    /**
     * The container's bindings.
     *
     * Maps abstract keys to their binding configurations.
     */
    private readonly bindings;
    /**
     * Track the current resolution chain to detect circular dependencies.
     */
    private readonly resolutionStack;
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
    bind<T>(abstract: string, factory: Factory<T>): void;
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
    singleton<T>(abstract: string, factory: Factory<T>): void;
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
    bindIf<T>(abstract: string, factory: Factory<T>): void;
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
    singletonIf<T>(abstract: string, factory: Factory<T>): void;
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
    instance<T>(abstract: string, instance: T): void;
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
    make<T>(abstract: string): T;
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
    bound(abstract: string): boolean;
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
    forget(abstract: string): void;
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
    flush(): void;
}
