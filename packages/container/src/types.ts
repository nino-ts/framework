/**
 * Type definitions for the Container package.
 *
 * @packageDocumentation
 */

/**
 * Factory function that creates an instance of a service.
 *
 * @typeParam T - The type of service to create
 */
export type Factory<T> = (container: ContainerInterface) => T;

/**
 * Represents a binding in the container.
 *
 * @typeParam T - The type of the bound service
 */
export interface Binding<T = unknown> {
    /**
     * The factory function to create the service.
     */
    factory: Factory<T>;

    /**
     * Whether this binding should be treated as a singleton.
     */
    shared: boolean;

    /**
     * The cached instance for singleton bindings.
     */
    instance?: T;
}

/**
 * Interface for the IoC Container.
 */
export interface ContainerInterface {
    /**
     * Register a binding in the container.
     *
     * @param abstract - The key to bind the service under
     * @param factory - Factory function to create the service
     */
    bind<T>(abstract: string, factory: Factory<T>): void;

    /**
     * Register a singleton binding in the container.
     *
     * @param abstract - The key to bind the service under
     * @param factory - Factory function to create the service
     */
    singleton<T>(abstract: string, factory: Factory<T>): void;

    /**
     * Register a binding only if it doesn't already exist.
     *
     * @param abstract - The key to bind the service under
     * @param factory - Factory function to create the service
     */
    bindIf<T>(abstract: string, factory: Factory<T>): void;

    /**
     * Resolve a service from the container.
     *
     * @param abstract - The key of the service to resolve
     * @returns The resolved service instance
     */
    make<T>(abstract: string): T;

    /**
     * Check if a binding exists in the container.
     *
     * @param abstract - The key to check
     * @returns True if the binding exists
     */
    bound(abstract: string): boolean;

    /**
     * Register an existing instance in the container.
     *
     * @param abstract - The key to bind the instance under
     * @param instance - The instance to register
     */
    instance<T>(abstract: string, instance: T): void;
}
