import { Database } from 'bun:sqlite';
import { SQL } from 'bun';
import type { ConnectionConfig } from './Types';
import type { Connector } from './QueryBuilder';

export class Connection implements Connector {
    protected db: any; // Database type varies by driver
    protected config: ConnectionConfig;
    protected driver: 'sqlite' | 'postgres' | 'mysql';

    constructor(config: ConnectionConfig) {
        this.config = config;
        // Normaliza 'postgresql' para 'postgres'
        const driverName = config.driver === 'postgresql' ? 'postgres' : config.driver;
        this.driver = driverName as 'sqlite' | 'postgres' | 'mysql';
        this.connect();
    }

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
}

