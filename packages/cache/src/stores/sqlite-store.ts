import type { Database } from 'bun:sqlite';
import type { Store } from '../contracts/store';

/**
 * SQLiteStore implements a cache driver on top of a SQLite database utilizing the high-performance `bun:sqlite`.
 * Since bun:sqlite is entirely synchronous, all mapping operations rely on zero-delay internal executions natively.
 */
export class SQLiteStore implements Store {
  constructor(
    protected db: Database,
    protected tableName = 'ninots_cache',
  ) {
    this.ensureTableExists();
  }

  protected ensureTableExists(): void {
    this.db
      .query(
        `CREATE TABLE IF NOT EXISTS ${this.tableName} (
          key TEXT PRIMARY KEY,
          value TEXT NOT NULL,
          expires_at INTEGER
        )`,
      )
      .run();
  }

  get<T>(key: string): T | undefined {
    const row = this.db
      .query(`SELECT value, expires_at FROM ${this.tableName} WHERE key = $key`)
      .get({ $key: key }) as {
      value: string;
      expires_at: number | null;
    } | null;

    if (!row) {
      return undefined;
    }

    if (row.expires_at !== null && Date.now() > row.expires_at) {
      this.forget(key);
      return undefined;
    }

    try {
      return JSON.parse(row.value) as T;
    } catch {
      return undefined; // Corrupted
    }
  }

  put(key: string, value: unknown, ttlSeconds?: number): boolean {
    const expiresAt = ttlSeconds ? Date.now() + ttlSeconds * 1000 : null;
    try {
      this.db
        .query(
          `INSERT INTO ${this.tableName} (key, value, expires_at)
           VALUES ($key, $val, $exp)
           ON CONFLICT(key) DO UPDATE SET value = excluded.value, expires_at = excluded.expires_at`,
        )
        .run({
          $exp: expiresAt,
          $key: key,
          $val: JSON.stringify(value),
        });
      return true;
    } catch {
      return false;
    }
  }

  increment(key: string, value = 1): number | boolean {
    const current = (this.get(key) as number) ?? 0;
    const next = current + value;
    const success = this.put(key, next);
    return success ? next : false;
  }

  decrement(key: string, value = 1): number | boolean {
    const current = (this.get(key) as number) ?? 0;
    const next = current - value;
    const success = this.put(key, next);
    return success ? next : false;
  }

  forever(key: string, value: unknown): boolean {
    try {
      this.db
        .query(
          `INSERT INTO ${this.tableName} (key, value, expires_at)
           VALUES ($key, $val, NULL)
           ON CONFLICT(key) DO UPDATE SET value = excluded.value, expires_at = NULL`,
        )
        .run({
          $key: key,
          $val: JSON.stringify(value),
        });
      return true;
    } catch {
      return false;
    }
  }

  forget(key: string): boolean {
    try {
      const result = this.db.query(`DELETE FROM ${this.tableName} WHERE key = $key`).run({ $key: key });
      return result.changes > 0;
    } catch {
      return false;
    }
  }

  flush(): boolean {
    try {
      this.db.query(`DELETE FROM ${this.tableName}`).run();
      return true;
    } catch {
      return false;
    }
  }

  getPrefix(): string {
    return '';
  }
}
