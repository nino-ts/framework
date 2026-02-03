/**
 * Application class - the heart of the Ninots framework.
 *
 * @packageDocumentation
 */

import type {
    ApplicationConfig,
    ApplicationState,
    ServiceProviderInterface,
    RequestHandler,
    ErrorHandler,
} from '@/types';

/**
 * Default application configuration.
 */
const DEFAULT_CONFIG: Required<ApplicationConfig> = {
    port: 3000,
    hostname: 'localhost',
    development: false,
};

/**
 * The main Application class that bootstraps and runs the framework.
 *
 * @example
 * ```typescript
 * const app = new Application({ port: 3000 });
 * app.register(new AppServiceProvider(app.container));
 * await app.boot();
 * await app.start();
 * ```
 */
export class Application {
    /**
     * Application configuration.
     */
    private config: Required<ApplicationConfig>;

    /**
     * Current application state.
     */
    private state: ApplicationState = 'created';

    /**
     * Registered service providers.
     */
    private providers: ServiceProviderInterface[] = [];

    /**
     * The HTTP server instance.
     */
    private server: ReturnType<typeof Bun.serve> | null = null;

    /**
     * The request handler.
     */
    private handler: RequestHandler | null = null;

    /**
     * The error handler.
     */
    private errorHandler: ErrorHandler | null = null;

    /**
     * Creates a new Application instance.
     *
     * @param config - Application configuration
     */
    constructor(config: ApplicationConfig) {
        this.config = {
            ...DEFAULT_CONFIG,
            ...config,
        };
    }

    /**
     * Register a service provider.
     *
     * @param provider - The service provider to register
     * @returns This application for chaining
     */
    register(provider: ServiceProviderInterface): this {
        provider.register();
        this.providers.push(provider);
        this.state = 'registered';
        return this;
    }

    /**
     * Boot all registered service providers.
     *
     * @returns Promise that resolves when all providers are booted
     */
    async boot(): Promise<void> {
        for (const provider of this.providers) {
            await provider.boot();
        }
        this.state = 'booted';
    }

    /**
     * Set the request handler.
     *
     * @param handler - The handler function
     */
    setHandler(handler: RequestHandler): void {
        this.handler = handler;
    }

    /**
     * Set the error handler.
     *
     * @param handler - The error handler
     * @returns This application for chaining
     *
     * @example
     * ```typescript
     * app.setErrorHandler({
     *     handle(error, request) {
     *         return new Response(JSON.stringify({ error: error.message }), {
     *             status: 500,
     *             headers: { 'Content-Type': 'application/json' }
     *         });
     *     }
     * });
     * ```
     */
    setErrorHandler(handler: ErrorHandler): this {
        this.errorHandler = handler;
        return this;
    }

    /**
     * Start the HTTP server.
     *
     * @returns Promise that resolves when the server is started
     */
    async start(): Promise<void> {
        if (this.state !== 'booted') {
            await this.boot();
        }

        const handler = this.handler ?? (() => new Response('Not Found', { status: 404 }));
        const errorHandler = this.errorHandler;

        this.server = Bun.serve({
            port: this.config.port,
            hostname: this.config.hostname,
            fetch: async (request: Request): Promise<Response> => {
                try {
                    return await handler(request);
                } catch (error) {
                    if (errorHandler) {
                        return await errorHandler.handle(error as Error, request);
                    }
                    // Re-throw if no error handler is configured
                    throw error;
                }
            },
        });

        this.state = 'running';
    }

    /**
     * Stop the HTTP server.
     *
     * @returns Promise that resolves when the server is stopped
     */
    async stop(): Promise<void> {
        if (this.server) {
            this.server.stop();
            this.server = null;
        }
        this.state = 'stopped';
    }

    /**
     * Get the application configuration.
     *
     * @returns The application configuration
     */
    getConfig(): Required<ApplicationConfig> {
        return this.config;
    }

    /**
     * Get the current application state.
     *
     * @returns The current state
     */
    getState(): ApplicationState {
        return this.state;
    }

    /**
     * Get all registered providers.
     *
     * @returns Array of service providers
     */
    getProviders(): ServiceProviderInterface[] {
        return this.providers;
    }

    /**
     * Get the HTTP server instance.
     *
     * @returns The server or null if not running
     */
    getServer(): ReturnType<typeof Bun.serve> | null {
        return this.server;
    }

    /**
     * Get the request handler.
     *
     * @returns The handler or null
     */
    getHandler(): RequestHandler | null {
        return this.handler;
    }
}
