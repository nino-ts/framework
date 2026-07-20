/**
 * @ninots/routing - HTTP Router with fluent API
 *
 * @packageDocumentation
 */

export type { RouterInterface } from "./src/contracts/router-interface";
export { emitRouteRegistry } from "./src/emitRouteRegistry";
export { Route } from "./src/route";
export type { RouteRegistry, RouteResolver } from "./src/RouteRegistry";
export { route, setRouteResolver } from "./src/RouteRegistry";
export { Router } from "./src/router";
export type {
    HttpMethod,
    RouteDefinition,
    RouteGroupOptions,
    RouteHandler,
    RouteMatch,
    RouteParams,
} from "./src/types";
export { loadRoutes } from "./src/loader";
