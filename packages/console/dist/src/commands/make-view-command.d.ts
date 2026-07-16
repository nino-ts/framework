import { Command } from "../command";
import { type GeneratorPathsConfig } from "../generator";
export interface MakeViewCommandOptions {
    readonly paths?: GeneratorPathsConfig;
}
/**
 * Generate a TSX view component.
 */
export declare class MakeViewCommand extends Command {
    protected signature: string;
    protected description: string;
    private readonly resolver;
    constructor(options?: MakeViewCommandOptions);
    handle(): Promise<number>;
}
