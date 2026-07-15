/**
 * Router class for registering and matching routes.
 *
 * @packageDocumentation
 */
import type { RouterInterface } from "./contracts/router-interface";
import { Route } from "./route";
import type { RouteGroupOptions, RouteHandler, RouteMatch, RouteParams } from "./types";
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
export declare class Router implements RouterInterface {
    /**
     * Registered routes.
     */
    private routes;
    /**
     * Named routes lookup.
     */
    private namedRoutes;
    /**
     * Current group options stack.
     */
    private groupStack;
    /**
     * Register a GET route.
     *
     * @param path - URL path pattern
     * @param handler - Route handler
     * @returns The created Route for chaining
     */
    get(path: string, handler: RouteHandler): Route;
    /**
     * Register a POST route.
     *
     * @param path - URL path pattern
     * @param handler - Route handler
     * @returns The created Route for chaining
     */
    post(path: string, handler: RouteHandler): Route;
    /**
     * Register a PUT route.
     *
     * @param path - URL path pattern
     * @param handler - Route handler
     * @returns The created Route for chaining
     */
    put(path: string, handler: RouteHandler): Route;
    /**
     * Register a PATCH route.
     *
     * @param path - URL path pattern
     * @param handler - Route handler
     * @returns The created Route for chaining
     */
    patch(path: string, handler: RouteHandler): Route;
    /**
     * Register a DELETE route.
     *
     * @param path - URL path pattern
     * @param handler - Route handler
     * @returns The created Route for chaining
     */
    delete(path: string, handler: RouteHandler): Route;
    /**
     * Register a HEAD route.
     *
     * @param path - URL path pattern
     * @param handler - Route handler
     * @returns The created Route for chaining
     */
    head(path: string, handler: RouteHandler): Route;
    /**
     * Register an OPTIONS route.
     *
     * @param path - URL path pattern
     * @param handler - Route handler
     * @returns The created Route for chaining
     */
    options(path: string, handler: RouteHandler): Route;
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
    group(options: RouteGroupOptions, callback: () => void): void;
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
    match(method: string, path: string): RouteMatch | undefined;
    /**
     * Get a route by name.
     *
     * @param name - Route name
     * @returns The route or undefined
     */
    getRouteByName(name: string): Route | undefined;
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
    url(name: string, params?: RouteParams): string;
    /**
     * Get all registered routes.
     *
     * @returns Array of all routes
     */
    getRoutes(): Route[];
    /**
     * Add a route to the router.
     *
     * @param method - HTTP method
     * @param path - URL path pattern
     * @param handler - Route handler
     * @returns The created Route
     */
    private addRoute;
    /**
     * Apply group prefixes to a path.
     */
    private applyGroupPrefix;
    /**
     * Get combined middleware from all groups.
     */
    private getGroupMiddleware;
    /**
     * Normalize a path for matching.
     *
     * Normalizes URLs by:
     * - Removing query strings and fragment identifiers
     * - Collapsing multiple consecutive slashes into a single slash
     * - Removing trailing slashes (except for root path)
     *
     * Uses the URL class for robust parsing when possible.
     *
     * @param path - Request path to normalize
     * @returns Normalized path
     *
     * @example
     * ```typescript
     * normalizePath('/users?page=1')     // '/users'
     * normalizePath('/users#section')    // '/users'
     * normalizePath('//users')           // '/users'
     * normalizePath('/users/')           // '/users'
     * normalizePath('/')                 // '/' (root preserved)
     * ```
     */
    private normalizePath;
    /**
     * Match a path pattern against a request path.
     *
     * Performs segment-by-segment matching of URL paths. Parameter segments
     * (prefixed with `:`) are automatically URL-decoded to support special
     * characters, spaces, and Unicode.
     *
     * @param pattern - Route pattern (e.g., /users/:id)
     * @param path - Request path (e.g., /users/123)
     * @returns Extracted params or null if no match
     *
     * @example
     * ```typescript
     * // Static route matching
     * matchPath('/users', '/users')  // {}
     *
     * // Dynamic parameter matching
     * matchPath('/users/:id', '/users/123')  // { id: '123' }
     *
     * // URL-encoded parameters
     * matchPath('/users/:name', '/users/john%20doe')  // { name: 'john doe' }
     * matchPath('/posts/:title', '/posts/%E6%97%A5%E6%9C%AC%E8%AA%9E')  // { title: '日本語' }
     *
     * // Multiple parameters
     * matchPath('/users/:userId/posts/:postId', '/users/10/posts/42')
     * // { userId: '10', postId: '42' }
     *
     * // No match
     * matchPath('/users/:id', '/posts/123')  // null
     * ```
     */
    private matchPath;
}
