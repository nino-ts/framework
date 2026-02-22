import { describe, expect, test } from 'bun:test';
import { CacheManager } from '../../src/manager';
import { ArrayStore } from '../../src/stores/array-store';

describe('CacheManager', () => {
  test('resolves local extensions managing custom configurations', () => {
    const manager = new CacheManager({ default: 'memory' });

    manager.extend('memory', () => new ArrayStore());

    const store = manager.store();
    expect(store).toBeDefined();

    // Singleton check:
    const store2 = manager.store('memory');
    expect(store).toBe(store2);
  });

  test('throws error tracking invalid missing constraints logically checking native exceptions smoothly', () => {
    const manager = new CacheManager({ default: 'invalid_db' });

    expect(() => manager.store()).toThrow('Cache store [invalid_db] is not defined.');
  });

  test('delegates global executions completely over standard proxy resolving parameters precisely organically internally safely flawlessly', async () => {
    const manager = new CacheManager({ default: 'app_cache' });

    const arrayStore = new ArrayStore();
    manager.extend('app_cache', () => arrayStore);

    await manager.put('manager_key', 42);
    expect(await manager.get('manager_key')).toBe(42);

    expect(await manager.has('manager_key')).toBe(true);
    expect(await manager.missing('manager_key')).toBe(false);

    await manager.increment('manager_key', 10);
    expect(await manager.get('manager_key')).toBe(52);

    const pullCheck = await manager.pull('manager_key');
    expect(pullCheck).toBe(52);
    expect(await manager.get('manager_key')).toBeUndefined();
  });

  test('remember functions propagate smoothly mapping custom callbacks routing local payload mappings efficiently', async () => {
    const manager = new CacheManager({ default: 'array_test' });
    manager.extend('array_test', () => new ArrayStore());

    const result = await manager.remember('my_data', 10, () => 'calculated_value');
    expect(result).toBe('calculated_value');

    // Should pull cleanly resolving payload gracefully checking bounds automatically safely effectively bypassing local execution calls purely securely internally
    const cached = await manager.remember('my_data', 10, () => 'should_not_run');
    expect(cached).toBe('calculated_value');

    // Test remember forever mapping logic safely
    const foreverResult = await manager.rememberForever('forever_key', () => 'infinity_loop');
    expect(foreverResult).toBe('infinity_loop');
    expect(await manager.get('forever_key')).toBe('infinity_loop');
  });
});
