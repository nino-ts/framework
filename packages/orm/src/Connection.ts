import { Database } from 'bun:sqlite';
import type { ConnectionConfig } from './Types';
import type { Connector } from './QueryBuilder';

export class Connection implements Connector {
    protected db: any; // Database type varies by driver
    protected config: ConnectionConfig;

    constructor(config: ConnectionConfig) {
        this.config = config;
        this.connect();
    }

    protected connect() {
        if (this.config.driver === 'sqlite') {
            this.db = new Database(this.config.url || ':memory:');
        } else {
            throw new Error(`Driver [${this.config.driver}] not supported (yet).`);
        }
    }

    async query(sql: string, bindings: any[] = []): Promise<any[]> {
        if (this.config.driver === 'sqlite') {
            const query = this.db.query(sql);
            return query.all(...bindings) as any[];
        }
        return [];
    }

    async run(sql: string, bindings: any[] = []): Promise<any> {
        if (this.config.driver === 'sqlite') {
            const query = this.db.query(sql);
            const result = query.run(...bindings);
            return {
                lastInsertId: result.lastInsertRowid,
                changes: result.changes
            };
        }
        return null;
    }

    close() {
        if (this.db && typeof this.db.close === 'function') {
            this.db.close();
        }
    }
}
