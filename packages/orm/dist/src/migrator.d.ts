import type { DatabaseManager } from "./database-manager";
export interface MigratorOptions {
    readonly database: DatabaseManager;
    readonly path: string;
    readonly table?: string;
}
/**
 * Run forward migrations discovered in a directory.
 */
export declare class Migrator {
    private readonly database;
    private readonly path;
    private readonly table;
    constructor(options: MigratorOptions);
    ensureMigrationsTable(): Promise<void>;
    getRanMigrations(): Promise<Set<string>>;
    getMigrationFiles(): Promise<string[]>;
    getPendingMigrations(): Promise<string[]>;
    getNextBatch(): Promise<number>;
    run(onStep?: (migration: string) => void): Promise<string[]>;
}
