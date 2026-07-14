/**
 * Bun.serve options factory for ninoTS applications.
 *
 * @packageDocumentation
 */

import type { Serve } from "bun";
import type { Application } from "@/application.ts";
import { createHttpHandler } from "@/create-http-handler.ts";
import type { RequestHandler } from "@/types.ts";

/**
 * Options accepted by {@link createServeOptions}.
 */
export interface CreateServeOptionsInput {
    /**
     * Override the fetch handler. Defaults to the application handler or {@link createHttpHandler}.
     */
    fetch?: RequestHandler;

    /**
     * Idle timeout in seconds for open connections.
     * @defaultValue 30
     */
    idleTimeout?: number;
}

/**
 * Build typed `Bun.serve` options from a booted application.
 *
 * Mirrors the fetch wrapper used by {@link Application.start} so apps can call
 * `Bun.serve(createServeOptions(app))` directly when needed.
 *
 * @param app - Booted application instance
 * @param overrides - Optional serve overrides (port, hostname, websocket, …)
 * @returns Bun.serve configuration object
 */
export function createServeOptions(
    app: Application,
    overrides: CreateServeOptionsInput & Partial<Serve.Options<undefined>> = {},
): Serve.Options<undefined> {
    const config = app.getConfig();
    const baseHandler = overrides.fetch ?? app.getHandler() ?? createHttpHandler(app);

    const fetch = async (request: Request): Promise<Response> => {
        return baseHandler(request);
    };

    const { fetch: _fetch, idleTimeout, port, hostname, ...rest } = overrides;

    return {
        fetch,
        hostname: hostname ?? config.hostname,
        idleTimeout: idleTimeout ?? 30,
        port: port ?? config.port,
        ...rest,
    };
}
