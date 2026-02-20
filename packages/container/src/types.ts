/**
 * Type definitions for the Container package.
 *
 * @packageDocumentation
 */

/**
 * Branded type for abstract service keys.
 *
 * This prevents accidentally using arbitrary strings where service keys are expected,
 * providing compile-time safety for container bindings.
 *
 * @example
 * ```typescript
 * const key = createAbstractKey('logger');
 * container.bind(key, () => new Logger());
 * ```
 */
export type AbstractKey = string & { readonly __brand: 'AbstractKey' };

/**
 * Creates a branded AbstractKey from a string.
 *
 * @param key - The string key to brand
 * @returns A branded AbstractKey
 *
 * @example
 * ```typescript
 * const loggerKey = createAbstractKey('logger');
 * ```
 */
export function createAbstractKey(key: string): AbstractKey {
  if (key.trim().length === 0) {
    throw new Error('Abstract key cannot be empty');
  }
  return key as AbstractKey;
}

/**
 * Factory function that creates an instance of a service.
 *
 * @typeParam T - The type of service to create
 *
 * @example
 * ```typescript
 * const loggerFactory: Factory<Logger> = (container) => {
 *   const config = container.make<Config>('config');
 *   return new Logger(config);
 * };
 * ```
 */
export type Factory<T> = (container: ContainerInterface) => T;

/**
 * Represents a binding in the container.
 *
 * This is an immutable data structure representing a registered service.
 *
 * @typeParam T - The type of the bound service
 *
 * @example
 * ```typescript
 * const binding: Binding<Logger> = {
 *   factory: (c) => new Logger(),
 *   shared: true,
 * };
 * ```
 */
export interface Binding<T = unknown> {
  /**
   * The factory function to create the service.
   */
  readonly factory: Factory<T>;

  /**
   * Whether this binding should be treated as a singleton.
   */
  readonly shared: boolean;

  /**
   * The cached instance for singleton bindings.
   *
   * This is only present after the first resolution of a singleton.
   */
  instance?: T;
}

/**
 * Interface for the IoC Container.
 *
 * Defines the contract for dependency injection and service resolution.
 *
 * @example
 * ```typescript
 * class MyContainer implements ContainerInterface {
 *   // ... implementation
 * }
 * ```
 */
export interface ContainerInterface {
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
   * container.bind<Logger>('logger', (c) => new ConsoleLogger());
   * ```
   */
  bind<T>(abstract: string, factory: Factory<T>): void;

  /**
   * Register a singleton binding in the container.
   *
   * Creates a singleton binding - the same instance is returned on each resolution.
   *
   * @typeParam T - The type of service to bind
   * @param abstract - The key to bind the service under
   * @param factory - Factory function to create the service
   * @returns void
   *
   * @example
   * ```typescript
   * container.singleton<Database>('db', (c) => new Database());
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
   * container.bindIf<Logger>('logger', (c) => new FileLogger());
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
   * container.singletonIf<Cache>('cache', (c) => new MemoryCache());
   * ```
   */
  singletonIf<T>(abstract: string, factory: Factory<T>): void;

  /**
   * Resolve a service from the container.
   *
   * @typeParam T - The expected type of the resolved service
   * @param abstract - The key of the service to resolve
   * @returns The resolved service instance
   * @throws {BindingNotFoundException} If the binding is not found
   *
   * @example
   * ```typescript
   * const logger = container.make<Logger>('logger');
   * logger.log('Hello');
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
   * container.flush();
   * ```
   */
  flush(): void;
}
