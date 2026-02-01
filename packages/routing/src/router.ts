/**
 * Router class for registering and matching routes.
 *
 * @packageDocumentation
 */

import { Route } from '@/route';
import type {
    HttpMethod,
    RouteHandler,
    RouteParams,
    RouteMatch,
    RouteGroupOptions,
} from '@/types';

/**
 * HTTP Router for registering and matching routes.
 *
 * @example
 * ```typescript
 * const router = new Router();
 *
 * router.get('/users', async (req) => {
 *   return Response.json({ users: [] });
 * });
 *
 * router.get('/users/:id', async (req, params) => {
 *   return Response.json({ id: params.id });
 * });
 *
 * const match = router.match('GET', '/users/123');
 * if (match) {
 *   const response = await match.route.handler(request, match.params);
 * }
 * ```
 */
export class Router {
    /**
     * Registered routes.
     */
    private routes: Route[] = [];

    /**
     * Named routes lookup.
     */
    private namedRoutes: Map<string, Route> = new Map();

    /**
     * Current group options stack.
     */
    private groupStack: RouteGroupOptions[] = [];

    /**
     * Register a GET route.
     *
     * @param path - URL path pattern
     * @param handler - Route handler
     * @returns The created Route for chaining
     */
    get(path: string, handler: RouteHandler): Route {
        return this.addRoute('GET', path, handler);
    }

    /**
     * Register a POST route.
     *
     * @param path - URL path pattern
     * @param handler - Route handler
     * @returns The created Route for chaining
     */
    post(path: string, handler: RouteHandler): Route {
        return this.addRoute('POST', path, handler);
    }

    /**
     * Register a PUT route.
     *
     * @param path - URL path pattern
     * @param handler - Route handler
     * @returns The created Route for chaining
     */
    put(path: string, handler: RouteHandler): Route {
        return this.addRoute('PUT', path, handler);
    }

    /**
     * Register a PATCH route.
     *
     * @param path - URL path pattern
     * @param handler - Route handler
     * @returns The created Route for chaining
     */
    patch(path: string, handler: RouteHandler): Route {
        return this.addRoute('PATCH', path, handler);
    }

    /**
     * Register a DELETE route.
     *
     * @param path - URL path pattern
     * @param handler - Route handler
     * @returns The created Route for chaining
     */
    delete(path: string, handler: RouteHandler): Route {
        return this.addRoute('DELETE', path, handler);
    }

    /**
     * Register a HEAD route.
     *
     * @param path - URL path pattern
     * @param handler - Route handler
     * @returns The created Route for chaining
     */
    head(path: string, handler: RouteHandler): Route {
        return this.addRoute('HEAD', path, handler);
    }

    /**
     * Register an OPTIONS route.
     *
     * @param path - URL path pattern
     * @param handler - Route handler
     * @returns The created Route for chaining
     */
    options(path: string, handler: RouteHandler): Route {
        return this.addRoute('OPTIONS', path, handler);
    }

    /**
     * Create a route group with shared attributes.
     *
     * @param options - Group options (prefix, middleware)
     * @param callback - Callback to register routes within the group
     *
     * @example
     * ```typescript
     * router.group({ prefix: '/api', middleware: ['auth'] }, () => {
     *   router.get('/users', handler); // /api/users with 'auth' middleware
     * });
     * ```
     */
    group(options: RouteGroupOptions, callback: () => void): void {
        this.groupStack.push(options);
        callback();
        this.groupStack.pop();
    }

    /**
     * Match a request to a route.
     *
     * @param method - HTTP method
     * @param path - Request path
     * @returns The matched route and params, or undefined if no match
     *
     * @example
     * ```typescript
     * const match = router.match('GET', '/users/123');
     * if (match) {
     *   const response = await match.route.handler(request, match.params);
     * }
     * ```
     */
    match(method: string, path: string): RouteMatch | undefined {
        const normalizedMethod = method.toUpperCase() as HttpMethod;
        const normalizedPath = this.normalizePath(path);

        for (const route of this.routes) {
            if (route.getMethod() !== normalizedMethod) {
                continue;
            }

            const params = this.matchPath(route.getPath(), normalizedPath);
            if (params !== null) {
                return {
                    route: route.getDefinition(),
                    params,
                };
            }
        }

        return undefined;
    }

    /**
     * Get a route by name.
     *
     * @param name - Route name
     * @returns The route or undefined
     */
    getRouteByName(name: string): Route | undefined {
        return this.namedRoutes.get(name);
    }

    /**
     * Generate a URL for a named route.
     *
     * @param name - Route name
     * @param params - Parameters to substitute in the URL
     * @returns The generated URL
     * @throws Error if route not found
     *
     * @example
     * ```typescript
     * router.get('/users/:id', handler).name('users.show');
     * const url = router.url('users.show', { id: '123' }); // '/users/123'
     * ```
     */
    url(name: string, params: RouteParams = {}): string {
        const route = this.namedRoutes.get(name);
        if (!route) {
            throw new Error(`Route not found: ${name}`);
        }

        let url = route.getPath();
        for (const [key, value] of Object.entries(params)) {
            url = url.replace(`:${key}`, value);
        }

        return url;
    }

    /**
     * Get all registered routes.
     *
     * @returns Array of all routes
     */
    getRoutes(): Route[] {
        return [...this.routes];
    }

    /**
     * Add a route to the router.
     *
     * @param method - HTTP method
     * @param path - URL path pattern
     * @param handler - Route handler
     * @returns The created Route
     */
    private addRoute(method: HttpMethod, path: string, handler: RouteHandler): Route {
        const fullPath = this.applyGroupPrefix(path);
        const route = new Route(method, fullPath, handler);

        // Apply group middleware
        const groupMiddleware = this.getGroupMiddleware();
        if (groupMiddleware.length > 0) {
            route.middleware(groupMiddleware);
        }

        this.routes.push(route);

        // Track named routes
        const originalName = route.name.bind(route);
        route.name = (routeName: string) => {
            const result = originalName(routeName);
            this.namedRoutes.set(routeName, route);
            return result;
        };

        return route;
    }

    /**
     * Apply group prefixes to a path.
     */
    private applyGroupPrefix(path: string): string {
        const prefixes = this.groupStack
            .map((g) => g.prefix)
            .filter((p): p is string => p !== undefined);

        if (prefixes.length === 0) {
            return path;
        }

        const prefix = prefixes.join('');
        return `${prefix}${path}`;
    }

    /**
     * Get combined middleware from all groups.
     */
    private getGroupMiddleware(): string[] {
        return this.groupStack.flatMap((g) => g.middleware ?? []);
    }

    /**
     * Normalize a path for matching.
     */
    private normalizePath(path: string): string {
        // Remove query string
        const queryIndex = path.indexOf('?');
        if (queryIndex !== -1) {
            path = path.slice(0, queryIndex);
        }

        // Remove trailing slash (except for root)
        if (path.length > 1 && path.endsWith('/')) {
            path = path.slice(0, -1);
        }

        return path;
    }

    /**
     * Match a path pattern against a request path.
     *
     * @param pattern - Route pattern (e.g., /users/:id)
     * @param path - Request path (e.g., /users/123)
     * @returns Extracted params or null if no match
     */
    private matchPath(pattern: string, path: string): RouteParams | null {
        const patternParts = pattern.split('/');
        const pathParts = path.split('/');

        if (patternParts.length !== pathParts.length) {
            return null;
        }

        const params: RouteParams = {};

        for (let i = 0; i < patternParts.length; i++) {
            const patternPart = patternParts[i];
            const pathPart = pathParts[i];

            if (patternPart === undefined || pathPart === undefined) {
                return null;
            }

            if (patternPart.startsWith(':')) {
                // Parameter segment
                const paramName = patternPart.slice(1);
                params[paramName] = pathPart;
            } else if (patternPart !== pathPart) {
                // Static segment mismatch
                return null;
            }
        }

        return params;
    }
}
