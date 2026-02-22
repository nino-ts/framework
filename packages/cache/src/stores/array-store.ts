import type { Store } from '../contracts/store';

/**
 * Internal structure covering internal store items.
 */
interface CacheItem<T> {
  value: T;
  expiresAt: number | null; // Timestamp in ms. Null if item never expires.
}

/**
 * ArrayStore implements an in-memory test-friendly caching driver.
 * Stores variables directly in memory via JavaScript `Map`. Data is lost when the process exits.
 */
export class ArrayStore implements Store {
  protected items = new Map<string, CacheItem<unknown>>();

  get<T>(key: string): T | undefined {
    const item = this.items.get(key);
    if (!item) {
      return undefined;
    }

    if (item.expiresAt !== null && Date.now() > item.expiresAt) {
      this.items.delete(key);
      return undefined;
    }

    return item.value as T;
  }

  put(key: string, value: unknown, ttlSeconds?: number): boolean {
    const expiresAt = ttlSeconds ? Date.now() + ttlSeconds * 1000 : null;
    this.items.set(key, { expiresAt, value });
    return true;
  }

  increment(key: string, value = 1): number | boolean {
    const current = (this.get(key) as number) ?? 0;
    const next = current + value;
    this.items.set(key, { expiresAt: null, value: next });
    return next;
  }

  decrement(key: string, value = 1): number | boolean {
    const current = (this.get(key) as number) ?? 0;
    const next = current - value;
    this.items.set(key, { expiresAt: null, value: next });
    return next;
  }

  forever(key: string, value: unknown): boolean {
    this.items.set(key, { expiresAt: null, value });
    return true;
  }

  forget(key: string): boolean {
    return this.items.delete(key);
  }

  flush(): boolean {
    this.items.clear();
    return true;
  }

  getPrefix(): string {
    return '';
  }
}
