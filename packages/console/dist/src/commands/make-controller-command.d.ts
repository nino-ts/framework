import { Command } from "../command";
import { type GeneratorPathsConfig } from "../generator";
export interface MakeControllerCommandOptions {
    readonly paths?: GeneratorPathsConfig;
}
/**
 * Generate an HTTP controller class and optional resource routes.
 */
export declare class MakeControllerCommand extends Command {
    protected signature: string;
    protected description: string;
    private readonly resolver;
    constructor(options?: MakeControllerCommandOptions);
    handle(): Promise<number>;
    private ensureWebBinding;
    private writeWebResourceRoutes;
    private writeApiResourceRoutes;
}
