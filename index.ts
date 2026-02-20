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
} from './packages/console/index.ts';
// Console
export { Command, Kernel, OutputStyle } from './packages/console/index.ts';
export type { Binding, ContainerInterface, Factory } from './packages/container/index.ts';
// Container
export { Container, ServiceProvider } from './packages/container/index.ts';
export type { ApplicationConfig, ApplicationState } from './packages/foundation/index.ts';
// Foundation
export { Application, createApp } from './packages/foundation/index.ts';
export type {
  FileResponseOptions,
  HtmlResponseOptions,
  JsonResponseOptions,
  RedirectResponseOptions,
  TextResponseOptions,
} from './packages/http/index.ts';
// HTTP
export { RequestHelpers, ResponseHelpers } from './packages/http/index.ts';
export type { Middleware, MiddlewareHandler, MiddlewareNext } from './packages/middleware/index.ts';
// Middleware
export { MiddlewareStack, Pipeline } from './packages/middleware/index.ts';
export type {
  HttpMethod,
  RouteDefinition,
  RouteGroupOptions,
  RouteHandler,
  RouteMatch,
  RouteParams,
} from './packages/routing/index.ts';
// Routing
export { Route, Router } from './packages/routing/index.ts';
