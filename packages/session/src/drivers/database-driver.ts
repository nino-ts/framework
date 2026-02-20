/**
 * Database session driver interface for dependency inversion.
 * Mirrors the contract pattern — session doesn't import auth or orm.
 */
export interface SessionConnectionInterface {
  query(sql: string, params?: unknown[]): Promise<Record<string, unknown>[]>;
}

/**
 * Generates a cryptographically secure random token for session identification.
 *
 * @internal
 */
function generateSessionToken(): string {
  const bytes = new Uint8Array(32);
  crypto.getRandomValues(bytes);
  return Array.from(bytes)
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

/**
 * Stores sessions in a database table via a ConnectionInterface.
 *
 * Expected table schema (Drizzle-compatible):
 *   id TEXT PRIMARY KEY (session identifier, can be the same as token or separate)
 *   token TEXT UNIQUE NOT NULL (regenerable token for authentication)
 *   data TEXT (JSON-encoded session data)
 *   expiresAt TIMESTAMP NOT NULL (UTC expiration time)
 *   createdAt TIMESTAMP NOT NULL
 *   updatedAt TIMESTAMP NOT NULL
 *   ipAddress TEXT (optional, used for session audit)
 *   userAgent TEXT (optional, used for session audit)
 *   userId TEXT (optional FK to users table)
 */
export class DatabaseSessionDriver {
  constructor(
    protected connection: SessionConnectionInterface,
    protected table: string = 'session',
  ) {}

  async read(sessionId: string): Promise<Record<string, unknown>> {
    const results = await this.connection.query(`SELECT * FROM ${this.table} WHERE id = ? LIMIT 1`, [sessionId]);

    if (!results || results.length === 0) {
      return {};
    }

    const row = results[0]!;
    const dataStr = row.data as string | undefined;

    if (!dataStr) {
      return {};
    }

    try {
      return JSON.parse(dataStr) as Record<string, unknown>;
    } catch {
      return {};
    }
  }

  async write(sessionId: string, data: Record<string, unknown>, lifetime: number): Promise<boolean> {
    const dataJson = JSON.stringify(data);
    const now = new Date();
    const expiresAt = new Date(now.getTime() + lifetime * 1000);
    const token = generateSessionToken();

    const existing = await this.connection.query(`SELECT id FROM ${this.table} WHERE id = ? LIMIT 1`, [sessionId]);

    if (existing && existing.length > 0) {
      await this.connection.query(`UPDATE ${this.table} SET data = ?, updated_at = ?, expires_at = ? WHERE id = ?`, [
        dataJson,
        now,
        expiresAt,
        sessionId,
      ]);
    } else {
      await this.connection.query(
        `INSERT INTO ${this.table} (id, token, data, expires_at, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?)`,
        [sessionId, token, dataJson, expiresAt, now, now],
      );
    }

    return true;
  }

  async destroy(sessionId: string): Promise<boolean> {
    await this.connection.query(`DELETE FROM ${this.table} WHERE id = ?`, [sessionId]);
    return true;
  }

  async gc(maxLifetime: number): Promise<number> {
    const cutoff = new Date(Date.now() - maxLifetime * 1000);

    const expired = await this.connection.query(`SELECT id FROM ${this.table} WHERE expires_at < ?`, [cutoff]);

    if (!expired || expired.length === 0) {
      return 0;
    }

    await this.connection.query(`DELETE FROM ${this.table} WHERE expires_at < ?`, [cutoff]);

    return expired.length;
  }
}
