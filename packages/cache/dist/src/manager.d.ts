import type { Store } from "./contracts/store";
import { CacheRepository } from "./repository";
export interface CacheConfig {
    default: string;
}
/**
 * The CacheManager acts as the central registry and high-level orchestrator for the caching subsystem.
 * It manages active driver connections, applies default fallback routes, and exposes convenient facade behaviors.
 */
export declare class CacheManager {
    protected config: CacheConfig;
    protected stores: Map<string, CacheRepository>;
    protected customCreators: Map<string, () => Store>;
    constructor(config: CacheConfig);
    /**
     * Retrieves or initializes a specific cache adapter by its defined name.
     */
    store(name?: string): CacheRepository;
    /**
     * Evaluates the custom internal definitions mapping extensions successfully securely resolving bindings natively.
     */
    protected resolve(name: string): Store;
    /**
     * Registers a custom store driver overriding default behaviors explicitly tracking factories natively.
     */
    extend(driver: string, callback: () => Store): this;
    get<T>(key: string): Promise<T | undefined>;
    put(key: string, value: unknown, ttlSeconds?: number): Promise<boolean>;
    increment(key: string, value?: number): Promise<number | boolean>;
    decrement(key: string, value?: number): Promise<number | boolean>;
    forever(key: string, value: unknown): Promise<boolean>;
    forget(key: string): Promise<boolean>;
    flush(): Promise<boolean>;
    pull<T>(key: string): Promise<T | undefined>;
    has(key: string): Promise<boolean>;
    missing(key: string): Promise<boolean>;
    remember<T>(key: string, ttlSeconds: number | undefined, closure: () => T | Promise<T>): Promise<T>;
    rememberForever<T>(key: string, closure: () => T | Promise<T>): Promise<T>;
}
