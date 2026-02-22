import { afterAll, beforeAll, describe, expect, test } from 'bun:test';
import fs from 'node:fs';
import path from 'node:path';
import { Glob } from 'bun';
import { FileStore } from '../../src/stores/file-store';

const TEST_DIR = path.join(process.cwd(), 'tests', '.tmp', 'file-cache');

describe('FileStore', () => {
  beforeAll(() => {
    if (!fs.existsSync(TEST_DIR)) {
      fs.mkdirSync(TEST_DIR, { recursive: true });
    }
  });

  afterAll(async () => {
    const glob = new Glob('**/*');
    for await (const file of glob.scan(TEST_DIR)) {
      await Bun.file(path.join(TEST_DIR, file)).delete();
    }
  });

  test('put and get items accurately mapping file structures', async () => {
    const store = new FileStore(TEST_DIR);
    const success = await store.put('sample_key', 'test_data');
    expect(success).toBe(true);

    const val = await store.get('sample_key');
    expect(val).toBe('test_data');
  });

  test('ignores items if ttl has expired', async () => {
    const store = new FileStore(TEST_DIR);
    await store.put('short_lived', 'magic', 0.05); // 50ms

    expect(await store.get('short_lived')).toBe('magic');

    await Bun.sleep(60); // Wait 60ms

    expect(await store.get('short_lived')).toBeUndefined();
  });

  test('increments and decrements numerical items deleting ttl constraints mapping natively', async () => {
    const store = new FileStore(TEST_DIR);

    await store.increment('my_counter', 5);
    expect(await store.get('my_counter')).toBe(5);

    await store.decrement('my_counter', 2);
    expect(await store.get('my_counter')).toBe(3);
  });

  test('forever maintains persistent cache limits efficiently explicitly', async () => {
    const store = new FileStore(TEST_DIR);
    const result = await store.forever('infinite', { some: 'object' });
    expect(result).toBe(true);
    expect(await store.get('infinite')).toEqual({ some: 'object' });
  });

  test('forget correctly invalidates mappings', async () => {
    const store = new FileStore(TEST_DIR);
    await store.put('temp_key', 'val');

    await store.forget('temp_key');
    expect(await store.get('temp_key')).toBeUndefined();
  });

  test('flush wipes the explicit test directory mapping multiple keys naturally safely efficiently', async () => {
    const store = new FileStore(TEST_DIR);
    await store.put('A', 'xyz');
    await store.put('B', 'zyx');

    const didFlush = await store.flush();
    expect(didFlush).toBe(true);

    expect(await store.get('A')).toBeUndefined();
    expect(await store.get('B')).toBeUndefined();
  });
});
