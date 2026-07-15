/**
 * Wire core HTTP services into the application container.
 *
 * @packageDocumentation
 */
import type { Application } from "./application";
/**
 * Registers router, middleware, events, sync bus, and the default HTTP handler.
 *
 * @param app - Application instance to wire
 * @returns The same application for chaining
 */
export declare function wireCoreServices(app: Application): Application;
