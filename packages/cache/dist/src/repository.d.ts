import type { Awaitable, Store } from "./contracts/store";
/**
 * CacheRepository wraps a Store exposing high-level operations.
 * Adapted from Laravel's Illuminate\Cache\Repository.
 */
export declare class CacheRepository implements Store {
    protected store: Store;
    constructor(store: Store);
    /**
     * Determine if an item exists in the cache.
     */
    has(key: string): Promise<boolean>;
    /**
     * Determine if an item doesn't exist in the cache.
     */
    missing(key: string): Promise<boolean>;
    /**
     * Retrieve an item from the cache and delete it.
     */
    pull<T>(key: string, defaultValue?: T): Promise<T | undefined>;
    /**
     * Get an item from the cache, or execute the given Closure and store the result.
     */
    remember<T>(key: string, ttlSeconds: number | undefined, closure: () => Awaitable<T>): Promise<T>;
    /**
     * Get an item from the cache, or execute the given Closure and store the result forever.
     */
    rememberForever<T>(key: string, closure: () => Awaitable<T>): Promise<T>;
    get<T>(key: string): Awaitable<T | undefined>;
    put(key: string, value: unknown, ttlSeconds?: number): Awaitable<boolean>;
    increment(key: string, value?: number): Awaitable<number | boolean>;
    decrement(key: string, value?: number): Awaitable<number | boolean>;
    forever(key: string, value: unknown): Awaitable<boolean>;
    forget(key: string): Awaitable<boolean>;
    flush(): Awaitable<boolean>;
    getPrefix(): string;
    /**
     * Access the underlying store directly.
     */
    getStore(): Store;
}
