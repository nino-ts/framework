/**
 * Framework bootstrap entry point.
 *
 * Initializes the ninoTS application with:
 * - Dependency injection container
 * - HTTP routing system
 * - Middleware pipeline
 * - Request/response lifecycle
 *
 * @packageDocumentation
 */

import { Container } from "../../packages/container";
import { createApp } from "../../packages/foundation";

const container = new Container();

/**
 * Pre-configured application with core services wired.
 *
 * Environment:
 * - `NODE_ENV`: Application environment (production/development)
 * - `HOST`: Server hostname (default: localhost)
 * - `PORT`: Server port (default: 3000)
 */
const app = createApp(
    {
        development: process.env.NODE_ENV !== "production",
        hostname: process.env.HOST || "localhost",
        port: Number(process.env.PORT) || 3000,
    },
    container,
);

export { app, container };

/**
 * Auto-boot when executed as main module.
 */
if (import.meta.main) {
    app.start().catch((_error: unknown) => {
        process.exit(1);
    });
}
