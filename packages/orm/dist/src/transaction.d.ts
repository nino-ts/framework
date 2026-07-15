/**
 * Transaction management utilities.
 *
 * Provides convenient abstraction over Connection.begin() for transaction handling.
 * Uses Bun SQL's native transaction support with automatic rollback on error.
 *
 * @packageDocumentation
 */
import type { Connection } from "./connection";
import type { IsolationLevel, WhereClauseValue } from "./types";
/**
 * Transaction state.
 */
export type TransactionState = "active" | "committed" | "rolled_back";
/**
 * Transaction execution result with metadata.
 */
export interface TransactionResult<T> {
    readonly result: T;
    readonly committed: boolean;
}
/**
 * Transaction options.
 */
export interface TransactionOptions {
    /**
     * Isolation level for the transaction.
     *
     * @default 'READ COMMITTED'
     */
    readonly isolationLevel?: IsolationLevel;
    /**
     * Maximum retry attempts on deadlock/serialization errors.
     *
     * @default 0 (no retries)
     */
    readonly maxRetries?: number;
}
/**
 * Transaction class providing a convenient API over Connection.begin().
 *
 * **Recommended Usage**: Use Connection.begin() directly with callback API:
 *
 * @example
 * ```typescript
 * // Recommended: Callback API (uses Bun SQL native)
 * await connection.begin(async (tx) => {
 *     await tx.run('INSERT INTO users (name) VALUES (?)', ['Alice']);
 *     await tx.run('UPDATE accounts SET balance = balance - ?', [100]);
 *     // Auto-commit on success, auto-rollback on error
 * });
 * ```
 *
 * **Legacy Usage**: Object-oriented API (compatibility):
 *
 * @example
 * ```typescript
 * // Legacy: Manual control (for compatibility)
 * const tx = await Transaction.begin(conn);
 * try {
 *     await tx.run('INSERT INTO users (name) VALUES (?)', ['Alice']);
 *     await tx.commit();
 * } catch (error) {
 *     await tx.rollback();
 *     throw error;
 * }
 * ```
 *
 * **Disposable Pattern**:
 *
 * @example
 * ```typescript
 * // Using TypeScript 'using' keyword (auto-rollback)
 * {
 *     using tx = await Transaction.begin(conn);
 *     await tx.run('INSERT INTO users (name) VALUES (?)', ['Alice']);
 *     await tx.commit(); // Explicit commit required
 * } // Auto-rollback if not committed
 * ```
 */
export declare class Transaction implements AsyncDisposable {
    /**
     * Transaction state.
     */
    private state;
    /**
     * Wrapped connection instance.
     */
    private readonly connection;
    /**
     * Private constructor - use Transaction.begin() instead.
     *
     * @param connection - Database connection
     */
    private constructor();
    /**
     * Begin a new transaction.
     *
     * Executes BEGIN statement immediately to start the transaction.
     *
     * @param connection - Database connection
     * @param options - Transaction options
     * @returns Transaction instance
     *
     * @example
     * ```typescript
     * const tx = await Transaction.begin(conn);
     * await tx.run('INSERT INTO users (name) VALUES (?)', ['Alice']);
     * await tx.commit();
     * ```
     */
    static begin(connection: Connection, options?: TransactionOptions): Promise<Transaction>;
    /**
     * Execute a transaction with automatic commit/rollback.
     *
     * This is a convenience wrapper around Connection.begin() that provides
     * a cleaner API. Uses Bun SQL's native transaction management.
     *
     * @template T - Return type of the callback
     * @param connection - Database connection
     * @param callback - Transaction callback
     * @param options - Transaction options
     * @returns Transaction result
     *
     * @example
     * ```typescript
     * const result = await Transaction.execute(conn, async (tx) => {
     *     const user = await tx.query('SELECT * FROM users WHERE id = ?', [1]);
     *     await tx.run('UPDATE users SET active = ? WHERE id = ?', [true, 1]);
     *     return user;
     * });
     * ```
     */
    static execute<T>(connection: Connection, callback: (tx: Connection) => Promise<T>, options?: TransactionOptions): Promise<TransactionResult<T>>;
    /**
     * Execute a SQL query within this transaction.
     *
     * @template T - Result row type
     * @param sql - SQL query
     * @param bindings - Query bindings
     * @returns Query results
     */
    query<T = unknown>(sql: string, bindings?: readonly WhereClauseValue[]): Promise<T[]>;
    /**
     * Execute a SQL statement within this transaction.
     *
     * @param sql - SQL statement
     * @param bindings - Query bindings
     * @returns Statement result
     */
    run(sql: string, bindings?: readonly WhereClauseValue[]): Promise<{
        readonly lastInsertId: number | string | null;
        readonly changes: number;
    }>;
    /**
     * Commit the transaction.
     *
     * Note: When using Connection.begin() callback API, commit is automatic.
     * This method is for manual transaction control only.
     */
    commit(): Promise<void>;
    /**
     * Rollback the transaction.
     *
     * Note: When using Connection.begin() callback API, rollback is automatic on error.
     * This method is for manual transaction control only.
     */
    rollback(): Promise<void>;
    /**
     * Create a savepoint within the transaction.
     *
     * Savepoints allow partial rollback of transaction work.
     *
     * @param name - Savepoint name
     *
     * @example
     * ```typescript
     * await tx.savepoint('before_update');
     * await tx.run('UPDATE users SET active = false');
     * await tx.rollbackTo('before_update'); // Undo the update
     * ```
     */
    savepoint(name: string): Promise<void>;
    /**
     * Rollback to a specific savepoint.
     *
     * @param name - Savepoint name
     */
    rollbackTo(name: string): Promise<void>;
    /**
     * Release a savepoint (commits its changes).
     *
     * @param name - Savepoint name
     */
    releaseSavepoint(name: string): Promise<void>;
    /**
     * Check if transaction is currently active.
     */
    get isActive(): boolean;
    /**
     * Check if transaction was committed.
     */
    get isCommitted(): boolean;
    /**
     * Check if transaction was rolled back.
     */
    get isRolledBack(): boolean;
    /**
     * Get current transaction state.
     */
    get currentState(): TransactionState;
    /**
     * AsyncDisposable implementation - auto-rollback if not committed.
     *
     * Used with TypeScript 'using' keyword for automatic cleanup.
     */
    [Symbol.asyncDispose](): Promise<void>;
    /**
     * Assert transaction is active, throw error otherwise.
     */
    private assertActive;
}
/**
 * Helper function for executing a transaction with automatic commit/rollback.
 *
 * Convenience wrapper around Connection.begin() for functional style.
 *
 * @template T - Result type
 * @param connection - Database connection
 * @param callback - Transaction callback
 * @param options - Transaction options
 * @returns Result from callback
 *
 * @example
 * ```typescript
 * const userId = await transaction(conn, async (tx) => {
 *     const result = await tx.run(
 *         'INSERT INTO users (name) VALUES (?)',
 *         ['Alice']
 *     );
 *     return result.lastInsertId;
 * });
 * ```
 */
export declare function transaction<T>(connection: Connection, callback: (tx: Connection) => Promise<T>, options?: TransactionOptions): Promise<T>;
