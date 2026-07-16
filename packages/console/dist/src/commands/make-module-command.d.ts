import { Command } from "../command";
import { type GeneratorPathsConfig } from "../generator";
export interface MakeModuleCommandOptions {
    readonly paths?: GeneratorPathsConfig;
}
/**
 * Generate a domain module skeleton (Provider + routes) with optional resources.
 */
export declare class MakeModuleCommand extends Command {
    protected signature: string;
    protected description: string;
    private readonly resolver;
    constructor(options?: MakeModuleCommandOptions);
    handle(): Promise<number>;
    private generateController;
    private generateModel;
    private generateMigration;
}
