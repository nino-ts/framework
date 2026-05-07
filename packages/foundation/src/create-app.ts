/**
 * Factory for creating application instances.
 *
 * @packageDocumentation
 */

import { Application } from "@/application.ts";
import type { ContainerInterface } from "@/contracts/container-interface.ts";
import type { ApplicationConfig } from "@/types.ts";

/**
 * Creates a new application instance.
 *
 * @param config - Optional application configuration merged with the framework defaults.
 * @param container - Optional IoC container instance.
 * @returns A new {@link Application} instance.
 *
 * @example
 * ```typescript
 * const app = createApp({ port: 3000 });
 * await app.start();
 * ```
 */
export function createApp(config: ApplicationConfig = {}, container?: ContainerInterface): Application {
    return new Application(config, container);
}
