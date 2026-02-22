import { describe, expect, test } from 'bun:test';
import type { Awaitable, Store } from '../../src/contracts/store';
import { CacheRepository } from '../../src/repository';

/**
 * A basic MockStore to satisfy tests without external dependencies.
 */
class MockStore implements Store {
  protected items = new Map<string, unknown>();

  get<T>(key: string): Awaitable<T | undefined> {
    return this.items.get(key) as T | undefined;
  }

  put(key: string, value: unknown, _ttlSeconds?: number): Awaitable<boolean> {
    this.items.set(key, value);
    return true;
  }

  increment(key: string, value = 1): Awaitable<number | boolean> {
    const current = (this.items.get(key) as number) || 0;
    const next = current + value;
    this.items.set(key, next);
    return next;
  }

  decrement(key: string, value = 1): Awaitable<number | boolean> {
    const current = (this.items.get(key) as number) || 0;
    const next = current - value;
    this.items.set(key, next);
    return next;
  }

  forever(key: string, value: unknown): Awaitable<boolean> {
    this.items.set(key, value);
    return true;
  }

  forget(key: string): Awaitable<boolean> {
    return this.items.delete(key);
  }

  flush(): Awaitable<boolean> {
    this.items.clear();
    return true;
  }

  getPrefix(): string {
    return '';
  }
}

describe('CacheRepository', () => {
  test('delegates default ops to store', async () => {
    const repo = new CacheRepository(new MockStore());
    await repo.put('key1', 'value1');
    expect(await repo.get('key1')).toBe('value1');

    await repo.increment('counter', 10);
    expect(await repo.get('counter')).toBe(10);

    await repo.decrement('counter', 2);
    expect(await repo.get('counter')).toBe(8);

    await repo.forget('key1');
    expect(await repo.get('key1')).toBeUndefined();
  });

  test('has and missing methods work correctly', async () => {
    const repo = new CacheRepository(new MockStore());
    await repo.put('flag', 'enabled');

    expect(await repo.has('flag')).toBe(true);
    expect(await repo.missing('flag')).toBe(false);

    expect(await repo.has('undefined')).toBe(false);
    expect(await repo.missing('undefined')).toBe(true);
  });

  test('pull retrieves and deletes instantly', async () => {
    const repo = new CacheRepository(new MockStore());
    await repo.put('temp', 'foo');

    const result = await repo.pull('temp');
    expect(result).toBe('foo');
    expect(await repo.has('temp')).toBe(false);

    const fallback = await repo.pull('no-key', 'default');
    expect(fallback).toBe('default');
  });

  test('remember executes closure when missing, remembers otherwise', async () => {
    const repo = new CacheRepository(new MockStore());
    let calls = 0;

    const generate = () => {
      calls++;
      return 'expensive';
    };

    const first = await repo.remember('val', 60, generate);
    expect(first).toBe('expensive');
    expect(calls).toBe(1);

    const second = await repo.remember('val', 60, generate);
    expect(second).toBe('expensive');
    expect(calls).toBe(1); // Closure was not executed again
  });
});
