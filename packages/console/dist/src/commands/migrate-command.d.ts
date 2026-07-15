import { Command } from "../command";
import type { Migrator } from "@ninots/orm";
export interface MigrateCommandOptions {
    readonly resolveMigrator: () => Migrator | Promise<Migrator>;
}
/**
 * Run pending database migrations (forward-only).
 */
export declare class MigrateCommand extends Command {
    private readonly options;
    signature: string;
    description: string;
    constructor(options: MigrateCommandOptions);
    handle(): Promise<number>;
}
