import type { Database } from "bun:sqlite";
import type { Store } from "../contracts/store";
/**
 * SQLiteStore implements a cache driver on top of a SQLite database utilizing the high-performance `bun:sqlite`.
 * Since bun:sqlite is entirely synchronous, all mapping operations rely on zero-delay internal executions natively.
 */
export declare class SQLiteStore implements Store {
    protected db: Database;
    protected tableName: string;
    constructor(db: Database, tableName?: string);
    protected ensureTableExists(): void;
    get<T>(key: string): T | undefined;
    put(key: string, value: unknown, ttlSeconds?: number): boolean;
    increment(key: string, value?: number): number | boolean;
    decrement(key: string, value?: number): number | boolean;
    forever(key: string, value: unknown): boolean;
    forget(key: string): boolean;
    flush(): boolean;
    getPrefix(): string;
}
