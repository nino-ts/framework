/**
 * Middleware Stack for managing named middleware.
 *
 * @packageDocumentation
 */
import type { Middleware } from "./types";
/**
 * Manages a collection of named middleware.
 *
 * Allows registering middleware with names and resolving them by name.
 * Useful for defining middleware once and applying them by name in routes.
 *
 * @example
 * ```typescript
 * const stack = new MiddlewareStack();
 *
 * stack.add('auth', authMiddleware);
 * stack.add('log', logMiddleware);
 * stack.add('admin', adminMiddleware);
 *
 * // Resolve middleware by names
 * const middleware = stack.resolve(['log', 'auth']);
 *
 * // Use middleware aliases
 * stack.alias('web', ['log', 'session', 'csrf']);
 * const webMiddleware = stack.resolve(['web']);
 * ```
 */
export declare class MiddlewareStack {
    /**
     * Map of middleware by name.
     */
    private middlewares;
    /**
     * Map of middleware group aliases.
     */
    private groups;
    /**
     * Register a middleware with a name.
     *
     * @param name - The middleware name
     * @param middleware - The middleware function
     * @returns This stack for chaining
     *
     * @example
     * ```typescript
     * stack.add('auth', async (request, next) => {
     *   // Check authentication
     *   return next(request);
     * });
     * ```
     */
    add(name: string, middleware: Middleware): this;
    /**
     * Get a middleware by name.
     *
     * @param name - The middleware name
     * @returns The middleware or undefined
     */
    get(name: string): Middleware | undefined;
    /**
     * Check if a middleware exists.
     *
     * @param name - The middleware name
     * @returns True if the middleware exists
     */
    has(name: string): boolean;
    /**
     * Remove a middleware by name.
     *
     * @param name - The middleware name
     * @returns True if the middleware was removed
     */
    remove(name: string): boolean;
    /**
     * Create a middleware group alias.
     *
     * @param name - The group name
     * @param middlewareNames - Array of middleware names in the group
     * @returns This stack for chaining
     *
     * @example
     * ```typescript
     * stack.alias('web', ['log', 'session', 'csrf']);
     * stack.alias('api', ['log', 'throttle']);
     * ```
     */
    alias(name: string, middlewareNames: string[]): this;
    /**
     * Resolve middleware by names.
     *
     * Expands group aliases and returns the middleware functions.
     *
     * @param names - Array of middleware/group names
     * @returns Array of middleware functions
     * @throws Error if a middleware name is not found
     * @throws Error if circular group dependency is detected
     *
     * @example
     * ```typescript
     * const middleware = stack.resolve(['log', 'auth']);
     * ```
     */
    resolve(names: string[]): Middleware[];
    /**
     * Internal resolve method that tracks visited groups to detect circular dependencies.
     *
     * @param names - Array of middleware/group names
     * @param visited - Set of visited group names
     * @returns Array of middleware functions
     * @throws Error if circular dependency is detected
     */
    private resolveWithVisited;
    /**
     * Get all registered middleware names.
     *
     * @returns Array of middleware names
     */
    getNames(): string[];
    /**
     * Get all group names.
     *
     * @returns Array of group names
     */
    getGroups(): string[];
    /**
     * Clear all middleware and groups.
     */
    clear(): void;
}
