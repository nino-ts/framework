import type { DatabaseManager } from "./database-manager";
export interface MigratorOptions {
    readonly database: DatabaseManager;
    readonly path: string;
    readonly table?: string;
}
export interface RollbackOptions {
    /** Number of individual migrations to revert (newest first). When omitted, reverts the last batch. */
    readonly step?: number;
}
export interface RefreshOptions {
    /** When set, only roll back this many migrations before re-running; otherwise reset all. */
    readonly step?: number;
}
export interface RefreshResult {
    readonly rolledBack: string[];
    readonly migrated: string[];
}
interface MigrationRecord {
    readonly migration: string;
    readonly batch: number;
}
/**
 * Run and reverse migrations discovered in a directory (Laravel-like batch lifecycle).
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
    getLastBatchNumber(): Promise<number>;
    /**
     * Resolve migration records to roll back (newest first).
     */
    getMigrationsForRollback(options?: RollbackOptions): Promise<MigrationRecord[]>;
    run(onStep?: (migration: string) => void): Promise<string[]>;
    /**
     * Roll back the last batch, or the newest `step` migrations when provided.
     */
    rollback(options?: RollbackOptions, onStep?: (migration: string) => void): Promise<string[]>;
    /**
     * Roll back every applied migration (newest first).
     */
    reset(onStep?: (migration: string) => void): Promise<string[]>;
    /**
     * Reset (or step-rollback) then re-run pending migrations.
     */
    refresh(options?: RefreshOptions, onStep?: (event: {
        type: "down" | "up";
        migration: string;
    }) => void): Promise<RefreshResult>;
    private rollbackRecords;
    private getFilesByMigrationName;
    private loadMigration;
}
export {};
