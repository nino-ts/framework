/**
 * Factory function for creating Application instances.
 *
 * @packageDocumentation
 */

import { Application } from '@/application';
import type { ContainerInterface } from '@/contracts/container-interface';
import type { ApplicationConfig } from '@/types';

/**
 * Create a new Application instance.
 *
 * @param config - Optional application configuration
 * @param container - Optional IoC container instance
 * @returns A new Application instance
 *
 * @example
 * ```typescript
 * const app = createApp({ port: 3000 });
 * app.start();
 * ```
 */
export function createApp(config: ApplicationConfig = {}, container?: ContainerInterface): Application {
    return new Application(config, container);
}
