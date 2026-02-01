/**
 * @ninots/framework - Main Framework Entry Point
 *
 * Exports all core packages for the Ninots framework.
 *
 * @packageDocumentation
 */

// Container
export { Container, ServiceProvider } from './packages/container/index';
export type { ContainerInterface, Binding, Factory } from './packages/container/index';

// HTTP
export { RequestHelpers, ResponseHelpers } from './packages/http/index';
export type {
    JsonResponseOptions,
    RedirectResponseOptions,
    HtmlResponseOptions,
    TextResponseOptions,
    FileResponseOptions,
} from './packages/http/index';

// Routing
export { Router, Route } from './packages/routing/index';
export type {
    RouteHandler,
    RouteParams,
    RouteDefinition,
    RouteMatch,
    RouteGroupOptions,
    HttpMethod,
} from './packages/routing/index';

// Middleware
export { Pipeline, MiddlewareStack } from './packages/middleware/index';
export type { Middleware, MiddlewareNext, MiddlewareHandler } from './packages/middleware/index';

// Foundation
export { Application, createApp } from './packages/foundation/index';
export type { ApplicationConfig, ApplicationState } from './packages/foundation/index';

// Console
export { Command, Kernel, OutputStyle } from './packages/console/index';
export type {
    CommandSignature,
    CommandDefinition,
    ParsedArguments,
} from './packages/console/index';