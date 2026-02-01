/**
 * Base class for Service Providers.
 *
 * Service providers are the central place to configure your application.
 * They bootstrap your application services by binding them into the container.
 *
 * @packageDocumentation
 */

import type { Container } from '@/container';

/**
 * Base class for service providers.
 *
 * @example
 * ```typescript
 * class AppServiceProvider extends ServiceProvider {
 *   register() {
 *     this.app.singleton('config', () => loadConfig());
 *   }
 *
 *   boot() {
 *     const config = this.app.make('config');
 *     console.log('App booted with config:', config);
 *   }
 * }
 * ```
 */
export abstract class ServiceProvider {
    /**
     * The container instance.
     */
    protected app: Container;

    /**
     * Creates a new service provider instance.
     *
     * @param app - The container instance
     */
    constructor(app: Container) {
        this.app = app;
    }

    /**
     * Register any application services.
     *
     * This method is called during the registration phase.
     * Use this to bind services into the container.
     */
    abstract register(): void;

    /**
     * Bootstrap any application services.
     *
     * This method is called after all providers have been registered.
     * Use this to perform any actions that require other services to be available.
     */
    boot(): void {
        // Default implementation does nothing
    }
}
