import { Command } from "../command";
import type { Migrator } from "@ninots/orm";
export interface MigrateRollbackCommandOptions {
    readonly resolveMigrator: () => Migrator | Promise<Migrator>;
}
/**
 * Roll back the last database migration batch (or `--step` migrations).
 */
export declare class MigrateRollbackCommand extends Command {
    private readonly options;
    signature: string;
    description: string;
    constructor(options: MigrateRollbackCommandOptions);
    handle(): Promise<number>;
}
