/**
 * Bun.serve options factory for ninoTS applications.
 *
 * @packageDocumentation
 */
import type { Serve } from "bun";
import type { Application } from "./application";
import type { RequestHandler } from "./types";
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
    /**
     * Override listen port.
     */
    port?: number | string;
    /**
     * Override bind hostname.
     */
    hostname?: string;
    /**
     * Bun.serve error callback.
     */
    error?: (error: Error) => Response;
}
/**
 * Build typed `Bun.serve` options from a booted application.
 *
 * Mirrors the fetch wrapper used by {@link Application.start} so apps can call
 * `Bun.serve(createServeOptions(app))` directly when needed.
 *
 * @param app - Booted application instance
 * @param overrides - Optional serve overrides
 * @returns Bun.serve configuration object
 */
export declare function createServeOptions(app: Application, overrides?: CreateServeOptionsInput): Serve.Options<undefined>;
