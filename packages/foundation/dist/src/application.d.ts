/**
 * Application class - the heart of the Ninots framework.
 *
 * @packageDocumentation
 */
import type { ApplicationInterface } from "./contracts/application-interface";
import type { ContainerInterface } from "./contracts/container-interface";
import type { ApplicationConfig, ApplicationState, ErrorHandler, MetricsCollector, RequestHandler, ServerMetrics, ServiceProviderInterface, ShutdownOptions } from "./types";
/**
 * The main Application class that bootstraps and runs the framework.
 *
 * @example
 * ```typescript
 * const container = new Container();
 * const app = new Application({ port: 3000 }, container);
 * app.register(new AppServiceProvider(container));
 * await app.boot();
 * await app.start();
 * ```
 */
export declare class Application implements ApplicationInterface {
    /**
     * Application configuration.
     */
    private config;
    /**
     * The IoC container instance.
     */
    readonly container: ContainerInterface;
    /**
     * Current application state.
     */
    private state;
    /**
     * Registered service providers.
     */
    private providers;
    /**
     * The HTTP server instance.
     */
    private server;
    /**
     * The request handler.
     */
    private handler;
    /**
     * The error handler.
     */
    private errorHandler;
    /**
     * Whether the application is shutting down.
     */
    private isShuttingDown;
    /**
     * Set of active request promises for graceful shutdown.
     */
    private activeRequests;
    /**
     * Metrics collector for observability.
     */
    private metricsCollector;
    /**
     * Creates a new Application instance.
     *
     * @param config - Application configuration
     * @param container - IoC Container instance
     */
    constructor(config: ApplicationConfig, container?: ContainerInterface);
    /**
     * Register a service provider.
     *
     * @param provider - The service provider to register
     * @returns This application for chaining
     */
    register(provider: ServiceProviderInterface): this;
    /**
     * Resolve a service from the container.
     */
    make<T>(abstract: string): T;
    /**
     * Register a binding in the container.
     */
    bind<T>(abstract: string, factory: (container: ContainerInterface) => T): void;
    /**
     * Register a singleton binding in the container.
     */
    singleton<T>(abstract: string, factory: (container: ContainerInterface) => T): void;
    /**
     * Check if a binding exists in the container.
     */
    bound(abstract: string): boolean;
    /**
     * Register a binding only if it doesn't already exist.
     */
    bindIf<T>(abstract: string, factory: (container: ContainerInterface) => T): void;
    /**
     * Register a singleton binding only if it doesn't already exist.
     */
    singletonIf<T>(abstract: string, factory: (container: ContainerInterface) => T): void;
    /**
     * Register an existing instance in the container.
     */
    instance<T>(abstract: string, instance: T): void;
    /**
     * Remove a binding from the container.
     */
    forget(abstract: string): void;
    /**
     * Remove all bindings from the container.
     */
    flush(): void;
    /**
     * Boot all registered service providers.
     *
     * @returns Promise that resolves when all providers are booted
     */
    boot(): Promise<void>;
    /**
     * Set the request handler.
     *
     * @param handler - The handler function
     */
    setHandler(handler: RequestHandler): void;
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
    setErrorHandler(handler: ErrorHandler): this;
    /**
     * Set the metrics collector for server observability.
     *
     * @param collector - The metrics collector
     * @returns This application for chaining
     *
     * @example
     * ```typescript
     * app.setMetricsCollector({
     *     recordRequest(duration, error) {
     *         logger.log(`Request completed in ${duration}ms${error ? " with error" : " successfully"}`);
     *     },
     *     getMetrics() {
     *         return { requestCount: 0, errorCount: 0, averageResponseTime: 0, uptime: 0 };
     *     }
     * });
     * ```
     */
    setMetricsCollector(collector: MetricsCollector): this;
    /**
     * Get current server metrics.
     *
     * @returns Current metrics or null if no collector configured
     */
    getMetrics(): ServerMetrics | null;
    /**
     * Start the HTTP server.
     *
     * @returns Promise that resolves when the server is started
     */
    start(): Promise<void>;
    /**
     * Stop the HTTP server.
     *
     * @returns Promise that resolves when the server is stopped
     */
    stop(): Promise<void>;
    /**
     * Gracefully shutdown the server, waiting for active requests to finish.
     *
     * @param options - Shutdown options (timeout, force)
     *
     * @example
     * ```typescript
     * // Wait up to 10 seconds for requests to finish
     * await app.shutdown({ timeout: 10_000 });
     *
     * // Force immediate shutdown
     * await app.shutdown({ force: true });
     * ```
     */
    shutdown(options?: ShutdownOptions): Promise<void>;
    /**
     * Track an active request for graceful shutdown.
     *
     * @param requestPromise - Promise of the request handler
     */
    private trackRequest;
    /**
     * Get the application configuration.
     *
     * @returns The application configuration
     */
    getConfig(): Required<ApplicationConfig>;
    /**
     * Get the current application state.
     *
     * @returns The current state
     */
    getState(): ApplicationState;
    /**
     * Get all registered providers.
     *
     * @returns Array of service providers
     */
    getProviders(): ServiceProviderInterface[];
    /**
     * Get the HTTP server instance.
     *
     * @returns The server or null if not running
     */
    getServer(): ReturnType<typeof Bun.serve> | null;
    /**
     * Get the request handler.
     *
     * @returns The handler or null
     */
    getHandler(): RequestHandler | null;
}
