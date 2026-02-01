/**
 * Factory function for creating Application instances.
 *
 * @packageDocumentation
 */

import { Application } from '@/application';
import type { ApplicationConfig } from '@/types';

/**
 * Create a new Application instance.
 *
 * @param config - Optional application configuration
 * @returns A new Application instance
 *
 * @example
 * ```typescript
 * const app = createApp({ port: 3000 });
 * app.start();
 * ```
 */
export function createApp(config: ApplicationConfig = {}): Application {
    return new Application(config);
}
