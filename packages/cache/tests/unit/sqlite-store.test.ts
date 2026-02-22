import { Database } from 'bun:sqlite';
import { describe, expect, test } from 'bun:test';
import { SQLiteStore } from '../../src/stores/sqlite-store';

describe('SQLiteStore', () => {
  // We use `:memory:` to maintain isolated ultra-fast ephemeral DB blocks without disk overheads natively

  test('put and get items relying on internal DB mappings natively', () => {
    const db = new Database(':memory:');
    const store = new SQLiteStore(db);

    const success = store.put('my_key', { obj: 'val' });
    expect(success).toBe(true);

    const data = store.get('my_key');
    expect(data).toEqual({ obj: 'val' });
  });

  test('expires items synchronously measuring precise bounds completely natively', async () => {
    const db = new Database(':memory:');
    const store = new SQLiteStore(db);

    store.put('ex_key', 'some_val', 0.05); // 50ms setup

    expect(store.get('ex_key')).toBe('some_val');

    await Bun.sleep(60); // Await block triggering timeout smoothly

    expect(store.get('ex_key')).toBeUndefined();
  });

  test('increments and decrements values securely resetting expiration timers organically', () => {
    const db = new Database(':memory:');
    const store = new SQLiteStore(db);

    store.increment('val1', 20);
    expect(store.get('val1')).toBe(20);

    store.decrement('val1', 5);
    expect(store.get('val1')).toBe(15);
  });

  test('forever keeps exact limits seamlessly safely effectively natively', () => {
    const db = new Database(':memory:');
    const store = new SQLiteStore(db);

    const success = store.forever('infinite_db', [1, 2, 3]);
    expect(success).toBe(true);
    expect(store.get('infinite_db')).toEqual([1, 2, 3]);
  });

  test('forget correctly invalidates items resolving strict properties organically', () => {
    const db = new Database(':memory:');
    const store = new SQLiteStore(db);

    store.put('delete_me', 123);
    const didDelete = store.forget('delete_me');

    expect(didDelete).toBe(true);
    expect(store.get('delete_me')).toBeUndefined();

    // Testing absence correctly
    expect(store.forget('no_existent_key')).toBe(false);
  });

  test('flush correctly wiping complete store parameters matching full resets flawlessly safely', () => {
    const db = new Database(':memory:');
    const store = new SQLiteStore(db);

    store.put('A', 1);
    store.put('B', 2);

    expect(store.get('A')).toBe(1);

    store.flush();

    expect(store.get('A')).toBeUndefined();
    expect(store.get('B')).toBeUndefined();
  });
});
