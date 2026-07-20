import type { Router } from "./router";
/**
 * Loads routes from a directory using Bun.FileSystemRouter
 * and registers them into the provided Router instance.
 *
 * It maps Next.js style file routes (e.g., /users/[id].ts) to
 * framework routes (e.g., /users/:id).
 *
 * @deprecated Prefer fluent `Router` registration and the typed route registry
 * for application routes. File-based routing is not wired in the starter
 * (fluent-only) and has no `.name()` / typed-registry integration. Kept for
 * advanced/manual use with hardened failure modes (import errors and path
 * collisions throw).
 *
 * @param dir Absolute path to the routes directory
 * @param router Router instance to register routes on
 * @param prefix Optional prefix for all routes from this directory
 */
export declare function loadRoutes(dir: string, router: Router, prefix?: string): Promise<void>;
