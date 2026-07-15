/**
 * Factory for creating application instances.
 *
 * @packageDocumentation
 */
import { Application } from "./application";
import type { ContainerInterface } from "./contracts/container-interface";
import type { ApplicationConfig } from "./types";
/**
 * Options for {@link createApp} / {@link createApplication}.
 */
export interface CreateApplicationOptions {
    /**
     * When true (default), register router + middleware stack and set the HTTP handler.
     */
    wireCore?: boolean;
}
/**
 * Creates a new application instance.
 *
 * @param config - Optional application configuration merged with the framework defaults.
 * @param container - Optional IoC container instance.
 * @param options - Bootstrap options
 * @returns A new {@link Application} instance.
 *
 * @example
 * ```typescript
 * const app = createApp({ port: 3000 });
 * await app.start();
 * ```
 */
export declare function createApp(config?: ApplicationConfig, container?: ContainerInterface, options?: CreateApplicationOptions): Application;
/**
 * Alias for {@link createApp} — Laravel-style naming for the public bootstrap API.
 */
export declare const createApplication: typeof createApp;
