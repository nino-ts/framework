/**
 * Represents a generic type that can be either synchronous or asynchronous.
 */
export type Awaitable<T> = T | Promise<T>;

/**
 * Interface defining the minimal operations required by a Ninots Cache Store.
 * Adapted from Laravel's underlying `Illuminate\Contracts\Cache\Store`.
 */
export interface Store {
  /**
   * Retrieve an item from the cache by key.
   *
   * @param key - The cache key
   * @returns The cached value, or undefined if not found
   */
  get<T>(key: string): Awaitable<T | undefined>;

  /**
   * Store an item in the cache.
   *
   * @param key - The cache key
   * @param value - The value to store
   * @param ttlSeconds - Time To Live in seconds (defaults to infinite/driver default if omitted)
   * @returns True if successfully persisted, false otherwise
   */
  put(key: string, value: unknown, ttlSeconds?: number): Awaitable<boolean>;

  /**
   * Increment the value of an item in the cache.
   *
   * @param key - The cache key
   * @param value - The amount to increment by
   * @returns The incremented value, or false/undefined on failure depending on driver
   */
  increment(key: string, value?: number): Awaitable<number | boolean>;

  /**
   * Decrement the value of an item in the cache.
   *
   * @param key - The cache key
   * @param value - The amount to decrement by
   * @returns The decremented value, or false/undefined on failure depending on driver
   */
  decrement(key: string, value?: number): Awaitable<number | boolean>;

  /**
   * Store an item in the cache indefinitely.
   *
   * @param key - The cache key
   * @param value - The value to store
   * @returns True if successfully persisted
   */
  forever(key: string, value: unknown): Awaitable<boolean>;

  /**
   * Remove an item from the cache.
   *
   * @param key - The cache key
   * @returns True if removed, false otherwise
   */
  forget(key: string): Awaitable<boolean>;

  /**
   * Remove all items from the cache.
   *
   * @returns True if completely flushed
   */
  flush(): Awaitable<boolean>;

  /**
   * Get the cache key prefix.
   *
   * @returns The string prefix prepended to all keys by this store
   */
  getPrefix(): string;
}
