/**
 * Database connection management with Bun native drivers.
 *
 * Provides unified interface for SQLite, PostgreSQL, and MySQL using
 * Bun's native database drivers with automatic connection pooling.
 *
 * @packageDocumentation
 */
import { Database } from "bun:sqlite";
import { SQL } from "bun";
import type { Connector } from "./query-builder";
import type { ConnectionConfig, DatabaseDriver, WhereClauseValue } from "./types";
/**
 * Result of an INSERT/UPDATE/DELETE statement execution.
 */
export interface StatementResult {
    readonly lastInsertId: number | string | null;
    readonly changes: number;
}
/**
 * Database connection type - varies by driver.
 */
export type DatabaseConnection = Database | SQL;
/**
 * Transaction callback type with proper typing.
 */
export type TransactionCallback<T> = (tx: Connection) => Promise<T>;
/**
 * The Connection class handles database connections using Bun's native drivers.
 *
 * Features:
 * - Automatic connection pooling for PostgreSQL/MySQL
 * - Native prepared statements with SQL injection protection
 * - Transaction management with automatic rollback
 * - BigInt type safety configuration
 *
 * @example
 * ```typescript
 * const conn = new Connection({
 *     driver: 'postgres',
 *     url: 'postgres://user:pass@localhost:5432/mydb',
 *     max: 10, // Pool size
 *     bigint: 'string', // Handle BigInt as strings
 * });
 *
 * const users = await conn.query('SELECT * FROM users WHERE age > ?', [18]);
 * await conn.close();
 * ```
 */
export declare class Connection implements Connector {
    /**
     * Raw database connection (Database for SQLite, SQL for Postgres/MySQL).
     */
    protected readonly db: DatabaseConnection;
    /**
     * Connection configuration.
     */
    protected readonly config: Readonly<ConnectionConfig>;
    /**
     * Normalized database driver name.
     */
    protected readonly driver: DatabaseDriver;
    /**
     * Create a new Connection instance.
     *
     * @param config - Connection configuration
     * @throws Error if driver is not supported
     */
    constructor(config: ConnectionConfig);
    /**
     * Serialize binding values for database compatibility.
     *
     * Converts Date objects to ISO strings since Bun SQL expects
     * primitive types for bindings.
     *
     * @param bindings - Raw binding values
     * @returns Serialized bindings safe for database queries
     */
    private serializeBindings;
    /**
     * Establish the database connection.
     *
     * @returns Database connection instance
     * @throws Error if driver is not supported or connection fails
     */
    protected connect(): DatabaseConnection;
    /**
     * Execute a SQL query and return the results.
     *
     * Uses Bun's prepared statements for SQL injection protection.
     *
     * @template T - The type of rows returned
     * @param sql - SQL query string
     * @param bindings - Query parameter bindings
     * @returns Array of result rows
     *
     * @example
     * ```typescript
     * const users = await conn.query<User>(
     *     'SELECT * FROM users WHERE age > ? AND status = ?',
     *     [18, 'active']
     * );
     * ```
     */
    query<T = unknown>(sql: string, bindings?: readonly WhereClauseValue[]): Promise<T[]>;
    /**
     * Execute a statement (INSERT/UPDATE/DELETE) and return result info.
     *
     * @param sql - SQL statement
     * @param bindings - Query parameter bindings
     * @returns Statement execution result
     *
     * @example
     * ```typescript
     * const result = await conn.run(
     *     'INSERT INTO users (name, email) VALUES (?, ?)',
     *     ['Alice', 'alice@example.com']
     * );
     * console.log(`Inserted ID: ${result.lastInsertId}`);
     * ```
     */
    run(sql: string, bindings?: readonly WhereClauseValue[]): Promise<StatementResult>;
    /**
     * Close the database connection.
     *
     * @returns Promise that resolves when connection is closed
     */
    close(): Promise<void>;
    /**
     * Execute a transaction using Bun SQL's native begin() method.
     *
     * Transactions automatically rollback on error. For PostgreSQL/MySQL,
     * uses Bun's native transaction management. For SQLite, uses manual
     * BEGIN/COMMIT/ROLLBACK.
     *
     * @template T - The type returned by the transaction callback
     * @param callback - Callback to execute within transaction context
     * @returns Result from callback
     * @throws Error from callback (after rollback)
     *
     * @example
     * ```typescript
     * await conn.begin(async (tx) => {
     *     await tx.run('INSERT INTO users (name) VALUES (?)', ['Alice']);
     *     await tx.run('UPDATE accounts SET balance = balance - ?', [100]);
     * });
     * ```
     */
    begin<T>(callback: TransactionCallback<T>): Promise<T>;
    /**
     * Get the raw database connection for advanced operations.
     *
     * @returns Raw Database (SQLite) or SQL (Postgres/MySQL) instance
     *
     * @example
     * ```typescript
     * const rawDb = conn.getRawConnection();
     * if (rawDb instanceof Database) {
     *     // SQLite-specific operations
     * }
     * ```
     */
    getRawConnection(): DatabaseConnection;
}
