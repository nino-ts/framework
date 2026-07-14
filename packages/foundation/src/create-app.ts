/**
 * Factory for creating application instances.
 *
 * @packageDocumentation
 */

import { Application } from "@/application.ts";
import type { ContainerInterface } from "@/contracts/container-interface.ts";
import type { ApplicationConfig } from "@/types.ts";
import { wireCoreServices } from "@/wire-core-services.ts";

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
export function createApp(
    config: ApplicationConfig = {},
    container?: ContainerInterface,
    options: CreateApplicationOptions = {},
): Application {
    const app = new Application(config, container);

    if (options.wireCore !== false && container !== undefined) {
        wireCoreServices(app);
    }

    return app;
}

/**
 * Alias for {@link createApp} — Laravel-style naming for the public bootstrap API.
 */
export const createApplication = createApp;
