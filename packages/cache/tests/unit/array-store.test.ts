import { describe, expect, test } from 'bun:test';
import { ArrayStore } from '../../src/stores/array-store';

describe('ArrayStore', () => {
  test('put and get store values indefinitely without ttl', () => {
    const store = new ArrayStore();
    store.put('key1', 'value1');
    expect(store.get('key1')).toBe('value1');
  });

  test('expires items after TTL', async () => {
    const store = new ArrayStore();
    // 0.05 seconds = 50ms
    store.put('temp', 'foo', 0.05);

    expect(store.get('temp')).toBe('foo');

    // Wait for 60ms
    await Bun.sleep(60);

    expect(store.get('temp')).toBeUndefined();
  });

  test('increment and decrement update numeric values and adhere to TTL', () => {
    const store = new ArrayStore();

    store.increment('counter', 10);
    expect(store.get('counter')).toBe(10);

    store.decrement('counter', 4);
    expect(store.get('counter')).toBe(6);
  });

  test('forever stores item persistently', () => {
    const store = new ArrayStore();
    store.forever('persistent', 'data');
    expect(store.get('persistent')).toBe('data');
  });

  test('forget removes items correctly', () => {
    const store = new ArrayStore();
    store.put('key', 'val');
    expect(store.get('key')).toBe('val');

    store.forget('key');
    expect(store.get('key')).toBeUndefined();
  });

  test('flush clears all items', () => {
    const store = new ArrayStore();
    store.put('a', 1);
    store.put('b', 2);

    store.flush();

    expect(store.get('a')).toBeUndefined();
    expect(store.get('b')).toBeUndefined();
  });
});
