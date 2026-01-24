import { Database } from 'bun:sqlite';
import { SQL } from 'bun';
import type { ConnectionConfig } from '@/types';
import type { Connector } from '@/query-builder';

/**
 * The Connection class handles the database connection using Bun's native drivers.
 * Supports SQLite, PostgreSQL, and MySQL.
 */
export class Connection implements Connector {
    protected db: any; // Database type varies by driver
    protected config: ConnectionConfig;
    protected driver: 'sqlite' | 'postgres' | 'mysql';

    /**
     * Create a new Connection instance.
     * @param config Connection configuration
     */
    constructor(config: ConnectionConfig) {
        this.config = config;
        // Normaliza 'postgresql' para 'postgres'
        const driverName = config.driver === 'postgresql' ? 'postgres' : config.driver;
        this.driver = driverName as 'sqlite' | 'postgres' | 'mysql';
        this.connect();
    }

    /**
     * Establish the database connection.
     */
    protected connect() {
        switch (this.driver) {
            case 'sqlite':
                this.db = new Database(this.config.url || ':memory:');
                break;
            case 'postgres':
            case 'mysql':
                // Bun SQL nativo suporta postgres e mysql via URL
                this.db = new SQL(this.config.url!);
                break;
            default:
                throw new Error(`Driver [${this.driver}] not supported.`);
        }
    }

    /**
     * Execute a SQL query and return the results.
     * @param sql SQL query string
     * @param bindings Query bindings
     */
    async query(sql: string, bindings: any[] = []): Promise<any[]> {
        switch (this.driver) {
            case 'sqlite': {
                const query = this.db.query(sql);
                return query.all(...bindings) as any[];
            }
            case 'postgres':
            case 'mysql': {
                // Bun SQL usa tagged templates, mas podemos usar .unsafe() para SQL dinâmico
                const result = await this.db.unsafe(sql, bindings);
                return [...result];
            }
            default:
                return [];
        }
    }

    /**
     * Execute a statement (INSERT/UPDATE/DELETE) and return result info.
     * @param sql SQL statement
     * @param bindings Query bindings
     */
    async run(sql: string, bindings: any[] = []): Promise<any> {
        switch (this.driver) {
            case 'sqlite': {
                const query = this.db.query(sql);
                const result = query.run(...bindings);
                return {
                    lastInsertId: result.lastInsertRowid,
                    changes: result.changes
                };
            }
            case 'postgres':
            case 'mysql': {
                const result = await this.db.unsafe(sql, bindings);
                // Postgres RETURNING clause retorna o id diretamente
                // MySQL usa insertId do result
                return {
                    lastInsertId: result[0]?.id ?? result.insertId ?? null,
                    changes: result.count ?? result.affectedRows ?? 0
                };
            }
            default:
                return null;
        }
    }

    /**
     * Close the database connection.
     */
    async close(): Promise<void> {
        if (!this.db) return;

        switch (this.driver) {
            case 'sqlite':
                this.db.close();
                break;
            case 'postgres':
            case 'mysql':
                await this.db.close();
                break;
        }
    }

    /**
     * Execute a transaction using Bun SQL's native begin() method.
     * This is the correct way to handle transactions in PostgreSQL/MySQL with Bun.
     * 
     * @param callback Callback to execute within transaction
     * @example
     * await conn.begin(async (tx) => {
     *   await tx`INSERT INTO users (name) VALUES (${'Alice'})`;
     *   await tx`UPDATE accounts SET balance = balance - 100`;
     * });
     */
    async begin<T>(callback: (tx: any) => Promise<T>): Promise<T> {
        switch (this.driver) {
            case 'sqlite': {
                // SQLite: use manual BEGIN/COMMIT/ROLLBACK
                this.db.run('BEGIN TRANSACTION');
                try {
                    const result = await callback(this);
                    this.db.run('COMMIT');
                    return result;
                } catch (error) {
                    this.db.run('ROLLBACK');
                    throw error;
                }
            }
            case 'postgres':
            case 'mysql': {
                // Bun SQL: use native begin() method
                return await this.db.begin(callback);
            }
            default:
                throw new Error(`Transactions not supported for driver [${this.driver}]`);
        }
    }

    /**
     * Get the raw database connection for advanced operations.
     */
    getRawConnection(): any {
        return this.db;
    }
}

