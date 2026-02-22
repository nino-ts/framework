import type { Store } from './contracts/store';
import { CacheRepository } from './repository';

export interface CacheConfig {
  default: string;
}

/**
 * The CacheManager acts as the central registry and high-level orchestrator for the caching subsystem.
 * It manages active driver connections, applies default fallback routes, and exposes convenient facade behaviors.
 */
export class CacheManager {
  protected stores = new Map<string, CacheRepository>();
  protected customCreators = new Map<string, () => Store>();

  constructor(protected config: CacheConfig) {}

  /**
   * Retrieves or initializes a specific cache adapter by its defined name.
   */
  store(name?: string): CacheRepository {
    const storeName = name ?? this.config.default;

    if (this.stores.has(storeName)) {
      return this.stores.get(storeName)!;
    }

    const store = this.resolve(storeName);
    const repository = new CacheRepository(store);

    this.stores.set(storeName, repository);
    return repository;
  }

  /**
   * Evaluates the custom internal definitions mapping extensions successfully securely resolving bindings natively.
   */
  protected resolve(name: string): Store {
    if (this.customCreators.has(name)) {
      const creator = this.customCreators.get(name)!;
      return creator();
    }
    throw new Error(`Cache store [${name}] is not defined.`);
  }

  /**
   * Registers a custom store driver overriding default behaviors explicitly tracking factories natively.
   */
  extend(driver: string, callback: () => Store): this {
    this.customCreators.set(driver, callback);
    return this;
  }

  // --- Dynamic delegation routing all global parameters to the default active cache store natively ---

  async get<T>(key: string): Promise<T | undefined> {
    return this.store().get<T>(key);
  }

  async put(key: string, value: unknown, ttlSeconds?: number): Promise<boolean> {
    return this.store().put(key, value, ttlSeconds);
  }

  async increment(key: string, value = 1): Promise<number | boolean> {
    return this.store().increment(key, value);
  }

  async decrement(key: string, value = 1): Promise<number | boolean> {
    return this.store().decrement(key, value);
  }

  async forever(key: string, value: unknown): Promise<boolean> {
    return this.store().forever(key, value);
  }

  async forget(key: string): Promise<boolean> {
    return this.store().forget(key);
  }

  async flush(): Promise<boolean> {
    return this.store().flush();
  }

  async pull<T>(key: string): Promise<T | undefined> {
    return this.store().pull<T>(key);
  }

  async has(key: string): Promise<boolean> {
    return this.store().has(key);
  }

  async missing(key: string): Promise<boolean> {
    return this.store().missing(key);
  }

  async remember<T>(key: string, ttlSeconds: number | undefined, closure: () => T | Promise<T>): Promise<T> {
    return this.store().remember<T>(key, ttlSeconds, closure);
  }

  async rememberForever<T>(key: string, closure: () => T | Promise<T>): Promise<T> {
    return this.store().rememberForever<T>(key, closure);
  }
}
