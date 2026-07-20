import type { Router } from "@ninots/routing";
import { Command } from "../command";
export interface RoutesCompileCommandOptions {
    readonly resolveRouter: () => Router | Promise<Router>;
}
/**
 * Compile a typed route registry (`.d.ts`) from the application's Router.
 *
 * Boot path: inject `resolveRouter` (same pattern as MigrateCommand) —
 * typically `bootstrap()` → `ROUTER_KEY` → `getRoutes()`. Writes via `Bun.write`.
 */
export declare class RoutesCompileCommand extends Command {
    private readonly options;
    signature: string;
    description: string;
    constructor(options: RoutesCompileCommandOptions);
    handle(): Promise<number>;
}
