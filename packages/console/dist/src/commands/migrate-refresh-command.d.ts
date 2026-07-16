import { Command } from "../command";
import type { Migrator, SeederRunner } from "@ninots/orm";
export interface MigrateRefreshCommandOptions {
    readonly resolveMigrator: () => Migrator | Promise<Migrator>;
    /** Required when `--seed` is passed; reuses the application `db:seed` runner. */
    readonly resolveSeederRunner?: () => SeederRunner | Promise<SeederRunner>;
}
/**
 * Reset (or step-rollback) and re-run all migrations; optional `--seed`.
 */
export declare class MigrateRefreshCommand extends Command {
    private readonly options;
    signature: string;
    description: string;
    constructor(options: MigrateRefreshCommandOptions);
    handle(): Promise<number>;
}
