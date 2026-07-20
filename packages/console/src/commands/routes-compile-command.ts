import { join } from "node:path";
import type { Router } from "@ninots/routing";
import { emitRouteRegistry } from "@ninots/routing";
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
export class RoutesCompileCommand extends Command {
    signature = "routes:compile {--out=types/routes.d.ts}";
    description = "Compile typed route registry from registered routes";

    constructor(private readonly options: RoutesCompileCommandOptions) {
        super();
    }

    async handle(): Promise<number> {
        try {
            const router = await this.options.resolveRouter();
            const outOption = this.option("out");
            const outRel = typeof outOption === "string" && outOption.length > 0 ? outOption : "types/routes.d.ts";
            const outPath = join(process.cwd(), outRel);

            const content = emitRouteRegistry(router.getRoutes());
            await Bun.write(outPath, content);
            this.success(`Wrote ${outRel}`);
            return 0;
        } catch (error: unknown) {
            const message = error instanceof Error ? error.message : String(error);
            this.error(`routes:compile failed: ${message}`);
            return 1;
        }
    }
}
