import { afterEach, beforeEach, describe, expect, test } from "bun:test";
import { mkdtemp, rm, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { tmpdir } from "node:os";
import { DbSeedCommand, Kernel, MigrateCommand } from "../../index";
import { DatabaseManager, Migrator, Seeder, SeederRunner } from "@ninots/orm";

class TestSeeder extends Seeder {
    public static seeded = false;

    run(): void {
        TestSeeder.seeded = true;
    }
}

describe("Database CLI commands", () => {
    let db: DatabaseManager;
    let migrationsPath = "";

    beforeEach(async () => {
        db = new DatabaseManager();
        db.addConnection("default", {
            database: ":memory:",
            driver: "sqlite",
            url: ":memory:",
        });
        db.setDefaultConnection("default");

        migrationsPath = await mkdtemp(join(tmpdir(), "ninots-cli-migrations-"));

        await writeFile(
            join(migrationsPath, "2024_01_01_create_users_table.ts"),
            `export default class CreateUsersTable {
                async up(connection) {
                    await connection.run("CREATE TABLE users (id INTEGER PRIMARY KEY, email TEXT)");
                }
                async down(connection) {
                    await connection.run("DROP TABLE users");
                }
            }`,
        );
    });

    afterEach(async () => {
        await db.closeALl();
        await rm(migrationsPath, { force: true, recursive: true });
        TestSeeder.seeded = false;
    });

    test("MigrateCommand runs pending migrations", async () => {
        const kernel = new Kernel();
        const lines: string[] = [];

        kernel.setOutput({
            writeLine(text: string): void {
                lines.push(text);
            },
        });

        kernel.register(
            new MigrateCommand({
                resolveMigrator: () => new Migrator({ database: db, path: migrationsPath }),
            }),
        );

        const exitCode = await kernel.run(["migrate"]);

        expect(exitCode).toBe(0);
        expect(lines.some((line) => line.includes("Ran 1 migration"))).toBe(true);
    });

    test("DbSeedCommand runs configured seeder", async () => {
        const kernel = new Kernel();
        const lines: string[] = [];

        kernel.setOutput({
            writeLine(text: string): void {
                lines.push(text);
            },
        });

        kernel.register(
            new DbSeedCommand({
                resolveSeederRunner: () => new SeederRunner(TestSeeder),
            }),
        );

        const exitCode = await kernel.run(["db:seed"]);

        expect(exitCode).toBe(0);
        expect(TestSeeder.seeded).toBe(true);
        expect(lines.some((line) => line.includes("Database seeded"))).toBe(true);
    });
});
