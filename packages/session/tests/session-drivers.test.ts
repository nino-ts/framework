import { afterAll, beforeEach, describe, expect, it } from 'bun:test';
import { rmSync } from 'node:fs';
import { join } from 'node:path';
import { DatabaseSessionDriver, type SessionConnectionInterface } from '../src/drivers/database-driver.ts';
import { FileSessionDriver } from '../src/drivers/file-driver.ts';
import { MemorySessionDriver } from '../src/drivers/memory-driver.ts';

describe('MemorySessionDriver', () => {
  let driver: MemorySessionDriver;

  beforeEach(() => {
    driver = new MemorySessionDriver();
  });

  it('returns empty object for non-existent session', async () => {
    expect(await driver.read('non-existent')).toEqual({});
  });

  it('writes and reads session data', async () => {
    await driver.write('session-1', { user: 'john' }, 60);
    const data = await driver.read('session-1');
    expect(data).toEqual({ user: 'john' });
  });

  it('overwrites existing session data', async () => {
    await driver.write('session-1', { user: 'john' }, 60);
    await driver.write('session-1', { user: 'jane' }, 60);
    expect(await driver.read('session-1')).toEqual({ user: 'jane' });
  });

  it('destroys a session', async () => {
    await driver.write('session-1', { user: 'john' }, 60);
    const result = await driver.destroy('session-1');
    expect(result).toBe(true);
    expect(await driver.read('session-1')).toEqual({});
  });

  it('destroy returns false for non-existent session', async () => {
    const result = await driver.destroy('non-existent');
    expect(result).toBe(false);
  });

  it('returns empty object for expired session', async () => {
    // Write with 0 lifetime (already expired)
    await driver.write('session-1', { user: 'john' }, 0);

    // Manually force expiration by patching internal state
    // Since lifetime=0 means expires at Date.now() + 0, it should be expired
    // We need a small delay to ensure expiration
    await new Promise((resolve) => setTimeout(resolve, 10));

    expect(await driver.read('session-1')).toEqual({});
  });

  it('garbage collects expired sessions', async () => {
    await driver.write('expired-1', { a: 1 }, 0);
    await driver.write('expired-2', { b: 2 }, 0);
    await driver.write('valid', { c: 3 }, 60);

    await new Promise((resolve) => setTimeout(resolve, 10));

    const collected = await driver.gc(0);
    expect(collected).toBe(2);
    expect(await driver.read('valid')).toEqual({ c: 3 });
  });
});

describe('FileSessionDriver', () => {
  const testDir = join(import.meta.dir, '.tmp-sessions');
  let driver: FileSessionDriver;

  beforeEach(() => {
    try {
      rmSync(testDir, { recursive: true });
    } catch {
      // Ignore if not exists
    }
    driver = new FileSessionDriver(testDir);
  });

  afterAll(() => {
    try {
      rmSync(testDir, { recursive: true });
    } catch {
      // Ignore
    }
  });

  it('returns empty object for non-existent session', async () => {
    expect(await driver.read('non-existent')).toEqual({});
  });

  it('writes and reads session data', async () => {
    await driver.write('file-session-1', { name: 'test' }, 60);
    const data = await driver.read('file-session-1');
    expect(data).toEqual({ name: 'test' });
  });

  it('overwrites existing session data', async () => {
    await driver.write('file-session-1', { name: 'old' }, 60);
    await driver.write('file-session-1', { name: 'new' }, 60);
    expect(await driver.read('file-session-1')).toEqual({ name: 'new' });
  });

  it('destroys a session file', async () => {
    await driver.write('file-session-1', { name: 'test' }, 60);
    const result = await driver.destroy('file-session-1');
    expect(result).toBe(true);
    expect(await driver.read('file-session-1')).toEqual({});
  });

  it('destroy returns false for non-existent file', async () => {
    const result = await driver.destroy('non-existent');
    expect(result).toBe(false);
  });

  it('returns empty object for expired session file', async () => {
    await driver.write('file-session-1', { name: 'test' }, 0);
    await new Promise((resolve) => setTimeout(resolve, 10));
    expect(await driver.read('file-session-1')).toEqual({});
  });

  it('garbage collects expired session files', async () => {
    await driver.write('expired-1', { name: 'old' }, 0);
    await driver.write('valid-1', { name: 'new' }, 60);

    await new Promise((resolve) => setTimeout(resolve, 10));

    const collected = await driver.gc(0);

    expect(collected).toBe(1);
    expect(await driver.read('expired-1')).toEqual({});
    expect(await driver.read('valid-1')).toEqual({ name: 'new' });
  });
});

describe('DatabaseSessionDriver', () => {
  let driver: DatabaseSessionDriver;
  let storage: Map<string, Record<string, unknown>>;

  function createMockConnection(): SessionConnectionInterface {
    storage = new Map();

    return {
      async query(sql: string, params?: unknown[]): Promise<Record<string, unknown>[]> {
        const normalizedSql = sql.trim().toUpperCase();

        if (normalizedSql.startsWith('SELECT * FROM')) {
          const id = params?.[0] as string;
          const row = storage.get(id);
          return row ? [row] : [];
        }

        if (normalizedSql.startsWith('SELECT ID FROM') && normalizedSql.includes('WHERE ID')) {
          const id = params?.[0] as string;
          return storage.has(id) ? [{ id }] : [];
        }

        if (normalizedSql.startsWith('SELECT ID FROM') && normalizedSql.includes('EXPIRES_AT')) {
          const cutoff = params?.[0] as Date;
          const expired: Record<string, unknown>[] = [];
          for (const [id, row] of storage.entries()) {
            if ((row.expires_at as Date) < cutoff) {
              expired.push({ id });
            }
          }
          return expired;
        }

        if (normalizedSql.startsWith('INSERT')) {
          // INSERT INTO session (id, token, data, expires_at, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?)
          const [id, token, data, expiresAt, createdAt, updatedAt] = params as [
            string,
            string,
            string,
            Date,
            Date,
            Date,
          ];
          storage.set(id, {
            created_at: createdAt,
            data,
            expires_at: expiresAt,
            id,
            token,
            updated_at: updatedAt,
          });
          return [];
        }

        if (normalizedSql.startsWith('UPDATE')) {
          // UPDATE session SET data = ?, updated_at = ?, expires_at = ? WHERE id = ?
          const [data, updatedAt, expiresAt, id] = params as [string, Date, Date, string];
          const existing = storage.get(id);
          if (existing) {
            storage.set(id, {
              ...existing,
              data,
              expires_at: expiresAt,
              updated_at: updatedAt,
            });
          }
          return [];
        }

        if (normalizedSql.startsWith('DELETE') && normalizedSql.includes('WHERE ID')) {
          const id = params?.[0] as string;
          storage.delete(id);
          return [];
        }

        if (normalizedSql.startsWith('DELETE') && normalizedSql.includes('EXPIRES_AT')) {
          const cutoff = params?.[0] as Date;
          for (const [id, row] of storage.entries()) {
            if ((row.expires_at as Date) < cutoff) {
              storage.delete(id);
            }
          }
          return [];
        }

        return [];
      },
    };
  }

  beforeEach(() => {
    const connection = createMockConnection();
    driver = new DatabaseSessionDriver(connection);
  });

  it('returns empty object for non-existent session', async () => {
    expect(await driver.read('non-existent')).toEqual({});
  });

  it('writes and reads session data', async () => {
    await driver.write('db-session-1', { role: 'admin' }, 60);
    const data = await driver.read('db-session-1');
    expect(data).toEqual({ role: 'admin' });
  });

  it('updates existing session data', async () => {
    await driver.write('db-session-1', { role: 'admin' }, 60);
    await driver.write('db-session-1', { role: 'user' }, 60);
    expect(await driver.read('db-session-1')).toEqual({ role: 'user' });
  });

  it('destroys a session', async () => {
    await driver.write('db-session-1', { role: 'admin' }, 60);
    const result = await driver.destroy('db-session-1');
    expect(result).toBe(true);
    expect(await driver.read('db-session-1')).toEqual({});
  });

  it('garbage collects expired sessions', async () => {
    // Write sessions with old timestamps
    const connection = createMockConnection();
    driver = new DatabaseSessionDriver(connection);

    const now = new Date();
    const pastDate = new Date(now.getTime() - 7200000); // 2 hours ago

    // Directly set old expiresAt via mock storage
    storage.set('old-1', {
      created_at: pastDate,
      data: JSON.stringify({ x: 1 }),
      expires_at: pastDate,
      id: 'old-1',
      token: 'token-1',
      updated_at: pastDate,
    });
    storage.set('old-2', {
      created_at: pastDate,
      data: JSON.stringify({ y: 2 }),
      expires_at: pastDate,
      id: 'old-2',
      token: 'token-2',
      updated_at: pastDate,
    });
    storage.set('recent', {
      created_at: now,
      data: JSON.stringify({ z: 3 }),
      expires_at: new Date(now.getTime() + 3600000), // 1 hour from now
      id: 'recent',
      token: 'token-3',
      updated_at: now,
    });

    const collected = await driver.gc(3600);
    expect(collected).toBe(2);
    expect(await driver.read('recent')).toEqual({ z: 3 });
  });

  it('handles corrupted data gracefully', async () => {
    // Manually insert bad data
    storage.set('bad-session', {
      created_at: new Date(),
      data: 'not-valid-json{{{',
      expires_at: new Date(),
      id: 'bad-session',
      token: 'token-bad',
      updated_at: new Date(),
    });

    expect(await driver.read('bad-session')).toEqual({});
  });
});
