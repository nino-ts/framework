import type { Router } from "./router";
/**
 * Loads routes from a directory using Bun.FileSystemRouter
 * and registers them into the provided Router instance.
 *
 * It maps Next.js style file routes (e.g., /users/[id].ts) to
 * framework routes (e.g., /users/:id).
 *
 * @param dir Absolute path to the routes directory
 * @param router Router instance to register routes on
 * @param prefix Optional prefix for all routes from this directory
 */
export declare function loadRoutes(dir: string, router: Router, prefix?: string): Promise<void>;
