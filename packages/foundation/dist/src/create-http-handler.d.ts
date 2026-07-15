/**
 * Factory for the default router + middleware HTTP handler.
 *
 * @packageDocumentation
 */
import type { Application } from "./application";
import type { RequestHandler } from "./types";
/**
 * Creates an HTTP request handler that dispatches through the registered router and pipeline.
 *
 * @param app - Application with wired router and middleware stack
 * @returns Request handler suitable for {@link Application.setHandler} or `Bun.serve`
 */
export declare function createHttpHandler(app: Application): RequestHandler;
