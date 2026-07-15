import type { Store } from "../contracts/store";
/**
 * Internal structure covering internal store items.
 */
interface CacheItem<T> {
    value: T;
    expiresAt: number | null;
}
/**
 * ArrayStore implements an in-memory test-friendly caching driver.
 * Stores variables directly in memory via JavaScript `Map`. Data is lost when the process exits.
 */
export declare class ArrayStore implements Store {
    protected items: Map<string, CacheItem<unknown>>;
    get<T>(key: string): T | undefined;
    put(key: string, value: unknown, ttlSeconds?: number): boolean;
    increment(key: string, value?: number): number | boolean;
    decrement(key: string, value?: number): number | boolean;
    forever(key: string, value: unknown): boolean;
    forget(key: string): boolean;
    flush(): boolean;
    getPrefix(): string;
}
export {};
