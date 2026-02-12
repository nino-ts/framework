/**
 * @ninots/framework - Main Framework Entry Point
 *
 * Exports all core packages for the Ninots framework.
 *
 * @packageDocumentation
 */

export type {
    CommandDefinition,
    CommandSignature,
    ParsedArguments,
} from './packages/console/index';
// Console
export { Command, Kernel, OutputStyle } from './packages/console/index';
export type { Binding, ContainerInterface, Factory } from './packages/container/index';
// Container
export { Container, ServiceProvider } from './packages/container/index';
export type { ApplicationConfig, ApplicationState } from './packages/foundation/index';
// Foundation
export { Application, createApp } from './packages/foundation/index';
export type {
    FileResponseOptions,
    HtmlResponseOptions,
    JsonResponseOptions,
    RedirectResponseOptions,
    TextResponseOptions,
} from './packages/http/index';
// HTTP
export { RequestHelpers, ResponseHelpers } from './packages/http/index';
export type { Middleware, MiddlewareHandler, MiddlewareNext } from './packages/middleware/index';
// Middleware
export { MiddlewareStack, Pipeline } from './packages/middleware/index';
export type {
    HttpMethod,
    RouteDefinition,
    RouteGroupOptions,
    RouteHandler,
    RouteMatch,
    RouteParams,
} from './packages/routing/index';
// Routing
export { Route, Router } from './packages/routing/index';
