import { readdir } from "node:fs/promises";
import { join } from "node:path";
import { pathToFileURL } from "node:url";
import type { DatabaseManager } from "./database-manager";
import type { Migration } from "./migration";

export interface MigratorOptions {
    readonly database: DatabaseManager;
    readonly path: string;
    readonly table?: string;
}

type MigrationModule = {
    default?: new () => Migration;
};

/**
 * Run forward migrations discovered in a directory.
 */
export class Migrator {
    private readonly database: DatabaseManager;
    private readonly path: string;
    private readonly table: string;

    constructor(options: MigratorOptions) {
        this.database = options.database;
        this.path = options.path;
        this.table = options.table ?? "migrations";
    }

    async ensureMigrationsTable(): Promise<void> {
        await this.database.connection().run(`
            CREATE TABLE IF NOT EXISTS ${this.table} (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                migration TEXT NOT NULL UNIQUE,
                batch INTEGER NOT NULL
            )
        `);
    }

    async getRanMigrations(): Promise<Set<string>> {
        await this.ensureMigrationsTable();
        const rows = await this.database
            .connection()
            .query<{ migration: string }>(`SELECT migration FROM ${this.table}`);
        return new Set(rows.map((row) => row.migration));
    }

    async getMigrationFiles(): Promise<string[]> {
        const entries = await readdir(this.path);
        return entries
            .filter((file) => file.endsWith(".ts") || file.endsWith(".js"))
            .sort((left, right) => left.localeCompare(right));
    }

    async getPendingMigrations(): Promise<string[]> {
        const ran = await this.getRanMigrations();
        const files = await this.getMigrationFiles();
        return files.filter((file) => !ran.has(stripExtension(file)));
    }

    async getNextBatch(): Promise<number> {
        const rows = await this.database
            .connection()
            .query<{ batch: number }>(`SELECT MAX(batch) as batch FROM ${this.table}`);
        const current = rows[0]?.batch ?? 0;
        return current + 1;
    }

    async run(onStep?: (migration: string) => void): Promise<string[]> {
        const pending = await this.getPendingMigrations();
        if (pending.length === 0) {
            return [];
        }

        const batch = await this.getNextBatch();
        const executed: string[] = [];
        const connection = this.database.connection();

        for (const file of pending) {
            const migrationName = stripExtension(file);
            const module = (await import(pathToFileURL(join(this.path, file)).href)) as MigrationModule;
            const MigrationClass = module.default;

            if (!MigrationClass) {
                throw new Error(`Migration [${file}] must export a default class implementing Migration.`);
            }

            const instance = new MigrationClass();
            await instance.up(connection);
            await connection.run(`INSERT INTO ${this.table} (migration, batch) VALUES (?, ?)`, [
                migrationName,
                batch,
            ]);
            executed.push(migrationName);
            onStep?.(migrationName);
        }

        return executed;
    }
}

function stripExtension(file: string): string {
    return file.replace(/\.(ts|js)$/, "");
}
