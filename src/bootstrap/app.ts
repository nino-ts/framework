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
import { Application } from "../../packages/foundation";
import { Pipeline } from "../../packages/middleware";
import { Router } from "../../packages/routing";

/**
 * Creates and configures the application instance.
 *
 * Establishes the core framework infrastructure:
 *
 * 1. **IoC Container**: Central dependency registry and resolver
 * 2. **Application**: Main framework orchestrator with lifecycle management
 * 3. **Router**: HTTP request matching and route resolution
 * 4. **Pipeline**: Middleware execution chain
 *
 * Configuration is loaded from environment:
 * - `NODE_ENV`: Application environment (production/development)
 * - `HOST`: Server hostname (default: localhost)
 * - `PORT`: Server port (default: 3000)
 *
 * @example
 * ```typescript
 * // Bootstrap is automatically configured when imported
 * import { app, container } from "./bootstrap/app.ts";
 *
 * // Services can be resolved from the container
 * const router = container.make("router");
 *
 * // Application lifecycle is controlled via app instance
 * await app.start();
 * ```
 */

// 1. Create the IoC Container for dependency injection
const container = new Container();

// 2. Initialize the Foundation Application with environment config
const app = new Application(
    {
        development: process.env.NODE_ENV !== "production",
        hostname: process.env.HOST || "localhost",
        port: Number(process.env.PORT) || 3000,
    },
    container,
);

// 3. Register core services into the container for DI
const router = new Router();
const pipeline = new Pipeline(container);

app.instance("router", router);
app.instance("pipeline", pipeline);

/**
 * HTTP request handler combining routing and middleware.
 *
 * Processing sequence:
 * 1. Parse request method and URL
 * 2. Match request to registered route
 * 3. Execute middleware pipeline for matched route
 * 4. Invoke route handler with parsed parameters
 *
 * Returns 404 if no matching route is found.
 *
 * @param request - The incoming HTTP request
 * @returns HTTP response from route handler or middleware
 *
 * @example
 * ```typescript
 * // The handler is automatically configured for all incoming requests
 * // Routes are matched based on method and pathname
 * app.setHandler(async (request) => {
 *     // Implemented below
 * });
 * ```
 */
app.setHandler(async (request: Request): Promise<Response> => {
    const method = request.method;
    const url = new URL(request.url);

    // Match request to route definition
    const match = router.match(method, url.pathname);

    if (!match) {
        return new Response("Not Found", { status: 404 });
    }

    // Terminal handler executes the matched route
    const terminal = async (req: Request): Promise<Response> => {
        return match.route.handler(req, match.params);
    };

    // Extract middleware chain from route definition
    const middlewareList = match.route.middleware || [];

    return pipeline.send(request).through(middlewareList).then(terminal);
});

export { app, container };

/**
 * Auto-boot when executed as main module.
 *
 * Starts the HTTP server and lifecycle management.
 * Logs startup information and handles initialization errors.
 */
if (import.meta.main) {
    app.start().catch((_error: unknown) => {
        // In production, the application must exit on startup failure
        // Logs are handled by the Application error handler if configured
        process.exit(1);
    });
}
