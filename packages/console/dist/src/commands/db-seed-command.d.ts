import { Command } from "../command";
import type { SeederRunner } from "@ninots/orm";
export interface DbSeedCommandOptions {
    readonly resolveSeederRunner: () => SeederRunner | Promise<SeederRunner>;
}
/**
 * Seed the database using the application DatabaseSeeder.
 */
export declare class DbSeedCommand extends Command {
    private readonly options;
    signature: string;
    description: string;
    constructor(options: DbSeedCommandOptions);
    handle(): Promise<number>;
}
