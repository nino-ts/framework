import { Command } from "../command";
import { type GeneratorPathsConfig } from "../generator";
export interface MakeModelCommandOptions {
    readonly paths?: GeneratorPathsConfig;
}
/**
 * Generate a model class and optional migration.
 */
export declare class MakeModelCommand extends Command {
    protected signature: string;
    protected description: string;
    private readonly resolver;
    constructor(options?: MakeModelCommandOptions);
    handle(): Promise<number>;
}
