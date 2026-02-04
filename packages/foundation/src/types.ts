/**
 * Type definitions for the Foundation package.
 *
 * @packageDocumentation
 */

/**
 * Application configuration options.
 */
export interface ApplicationConfig {
    /**
     * Port to listen on.
     * @defaultValue 3000
     */
    port?: number;

    /**
     * Hostname to bind to.
     * @defaultValue 'localhost'
     */
    hostname?: string;

    /**
     * Whether to enable development mode.
     * @defaultValue false
     */
    development?: boolean;
}

/**
 * Possible states of the application.
 */
export type ApplicationState =
    | 'created'
    | 'registered'
    | 'booted'
    | 'running'
    | 'stopped';

/**
 * Interface for service providers.
 */
export interface ServiceProviderInterface {
    /**
     * Register services in the container.
     */
    register(): void;

    /**
     * Boot services after all providers are registered.
     */
    boot(): void | Promise<void>;
}

/**
 * Handler function for HTTP requests.
 */
export type RequestHandler = (request: Request) => Response | Promise<Response>;

/**
 * Interface for custom error handlers.
 *
 * Allows centralized error handling across the application.
 *
 * @example
 * ```typescript
 * class JsonErrorHandler implements ErrorHandler {
 *     handle(error: Error, request?: Request): Response {
 *         return new Response(JSON.stringify({ error: error.message }), {
 *             status: 500,
 *             headers: { 'Content-Type': 'application/json' }
 *         });
 *     }
 * }
 * ```
 */
export interface ErrorHandler {
    /**
     * Handle an error and return a response.
     *
     * @param error - The error that occurred
     * @param request - Optional request that caused the error
     * @returns Response to send to the client
     */
    handle(error: Error, request?: Request): Response | Promise<Response>;
}

/**
 * Configuration options for error handling.
 */
export interface ErrorHandlerOptions {
    /**
     * Enable debug mode (shows stack traces).
     * @defaultValue false
     */
    debug?: boolean;

    /**
     * Custom logger function for errors.
     */
    logger?: (error: Error) => void;
}

/**
 * Configuration options for graceful shutdown.
 */
export interface ShutdownOptions {
    /**
     * Maximum time to wait for active requests (milliseconds).
     * @defaultValue 10000 (10 seconds)
     */
    timeout?: number;

    /**
     * Force immediate shutdown without waiting for requests.
     * @defaultValue false
     */
    force?: boolean;
}
