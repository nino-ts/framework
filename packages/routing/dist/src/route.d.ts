/**
 * Route class for fluent route building.
 *
 * @packageDocumentation
 */
import type { HttpMethod, RouteDefinition, RouteHandler } from "./types";
/**
 * Represents a single route with fluent methods for configuration.
 *
 * @example
 * ```typescript
 * const route = new Route('GET', '/users', handler);
 * route.name('users.index').middleware(['auth']);
 * ```
 */
export declare class Route {
    /**
     * The route definition.
     */
    private definition;
    /**
     * Creates a new Route instance.
     *
     * @param method - HTTP method
     * @param path - URL path pattern
     * @param handler - Route handler function
     */
    constructor(method: HttpMethod, path: string, handler: RouteHandler);
    /**
     * Set the name of this route.
     *
     * @param routeName - The route name
     * @returns This route for chaining
     *
     * @example
     * ```typescript
     * router.get('/login', handler).name('auth.login');
     * ```
     */
    name(routeName: string): this;
    /**
     * Add middleware to this route.
     *
     * @param middlewareNames - Middleware names to add
     * @returns This route for chaining
     *
     * @example
     * ```typescript
     * router.get('/profile', handler).middleware(['auth', 'verified']);
     * ```
     */
    middleware(middlewareNames: string[]): this;
    /**
     * Get the route definition.
     *
     * @returns The complete route definition
     */
    getDefinition(): RouteDefinition;
    /**
     * Get the route path.
     *
     * @returns The route path
     */
    getPath(): string;
    /**
     * Get the route method.
     *
     * @returns The HTTP method
     */
    getMethod(): HttpMethod;
    /**
     * Get the route name.
     *
     * @returns The route name or undefined
     */
    getName(): string | undefined;
    /**
     * Get the route handler.
     *
     * @returns The handler function
     */
    getHandler(): RouteHandler;
    /**
     * Get the route middleware.
     *
     * @returns Array of middleware names
     */
    getMiddleware(): string[];
}
