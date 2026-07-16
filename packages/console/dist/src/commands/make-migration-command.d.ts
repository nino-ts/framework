import { Command } from "../command";
import { PathResolver, type GeneratorPathsConfig } from "../generator";
export interface MakeMigrationCommandOptions {
    readonly paths?: GeneratorPathsConfig | PathResolver;
}
/**
 * Generate a timestamped database migration.
 */
export declare class MakeMigrationCommand extends Command {
    protected signature: string;
    protected description: string;
    private readonly resolver;
    constructor(options?: MakeMigrationCommandOptions);
    handle(): Promise<number>;
}
