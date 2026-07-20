import type { Router } from "./router";
/**
 * Loads routes from a directory using Bun.FileSystemRouter
 * and registers them into the provided Router instance.
 *
 * It maps Next.js style file routes (e.g., /users/[id].ts) to
 * framework routes (e.g., /users/:id).
 *
 * @remarks
 * **Experimental.** File-based routing is not wired in the starter (fluent-only).
 * Known gaps: silent import failures, ignored path collisions, no `.name()` /
 * typed-registry integration. Wire + tests + naming — or deprecation — is backlog
 * (Sprint 11+). Prefer fluent `Router` registration for application routes.
 *
 * @param dir Absolute path to the routes directory
 * @param router Router instance to register routes on
 * @param prefix Optional prefix for all routes from this directory
 */
export declare function loadRoutes(dir: string, router: Router, prefix?: string): Promise<void>;
