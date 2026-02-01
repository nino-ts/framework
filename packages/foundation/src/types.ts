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
