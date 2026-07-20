/**
 * Pure emitter: named routes → `types/routes.d.ts` module augmentation source.
 *
 * @packageDocumentation
 */
import type { Route } from "./route";
/**
 * Emit the contents of a `types/routes.d.ts` artifact from registered routes.
 *
 * Only named routes are included. Output is sorted by name for stable diffs.
 * Duplicate names throw with the conflicting name in the message.
 *
 * @param routes - Routes from `Router.getRoutes()`
 * @returns Full `.d.ts` source (header + `declare module` augmentation)
 * @throws Error when two routes share the same name
 */
export declare function emitRouteRegistry(routes: Route[]): string;
