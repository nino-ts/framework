import type { Awaitable, Store } from './contracts/store';

/**
 * CacheRepository wraps a Store exposing high-level operations.
 * Adapted from Laravel's Illuminate\Cache\Repository.
 */
export class CacheRepository implements Store {
  constructor(protected store: Store) {}

  /**
   * Determine if an item exists in the cache.
   */
  async has(key: string): Promise<boolean> {
    return (await this.get(key)) !== undefined;
  }

  /**
   * Determine if an item doesn't exist in the cache.
   */
  async missing(key: string): Promise<boolean> {
    return !(await this.has(key));
  }

  /**
   * Retrieve an item from the cache and delete it.
   */
  async pull<T>(key: string, defaultValue?: T): Promise<T | undefined> {
    const value = await this.get<T>(key);
    if (value !== undefined) {
      await this.forget(key);
      return value;
    }
    return defaultValue;
  }

  /**
   * Get an item from the cache, or execute the given Closure and store the result.
   */
  async remember<T>(key: string, ttlSeconds: number | undefined, closure: () => Awaitable<T>): Promise<T> {
    const value = await this.get<T>(key);
    if (value !== undefined) {
      return value as T;
    }

    const newValue = await closure();
    await this.put(key, newValue, ttlSeconds);
    return newValue;
  }

  /**
   * Get an item from the cache, or execute the given Closure and store the result forever.
   */
  async rememberForever<T>(key: string, closure: () => Awaitable<T>): Promise<T> {
    const value = await this.get<T>(key);
    if (value !== undefined) {
      return value as T;
    }

    const newValue = await closure();
    await this.forever(key, newValue);
    return newValue;
  }

  // Pass-through operations to the underlying Store:

  get<T>(key: string): Awaitable<T | undefined> {
    return this.store.get<T>(key);
  }

  put(key: string, value: unknown, ttlSeconds?: number): Awaitable<boolean> {
    return this.store.put(key, value, ttlSeconds);
  }

  increment(key: string, value = 1): Awaitable<number | boolean> {
    return this.store.increment(key, value);
  }

  decrement(key: string, value = 1): Awaitable<number | boolean> {
    return this.store.decrement(key, value);
  }

  forever(key: string, value: unknown): Awaitable<boolean> {
    return this.store.forever(key, value);
  }

  forget(key: string): Awaitable<boolean> {
    return this.store.forget(key);
  }

  flush(): Awaitable<boolean> {
    return this.store.flush();
  }

  getPrefix(): string {
    return this.store.getPrefix();
  }

  /**
   * Access the underlying store directly.
   */
  getStore(): Store {
    return this.store;
  }
}
