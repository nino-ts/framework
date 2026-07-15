/**
 * Database session driver interface for dependency inversion.
 * Mirrors the contract pattern — session doesn't import auth or orm.
 */
export interface SessionConnectionInterface {
    query(sql: string, params?: unknown[]): Promise<Record<string, unknown>[]>;
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
export declare class DatabaseSessionDriver {
    protected connection: SessionConnectionInterface;
    protected table: string;
    constructor(connection: SessionConnectionInterface, table?: string);
    read(sessionId: string): Promise<Record<string, unknown>>;
    write(sessionId: string, data: Record<string, unknown>, lifetime: number): Promise<boolean>;
    destroy(sessionId: string): Promise<boolean>;
    gc(maxLifetime: number): Promise<number>;
}
