/**
 * @ninots/foundation - application foundation.
 *
 * @packageDocumentation
 */
export { Application } from "./src/application";
export type { ApplicationInterface } from "./src/contracts/application-interface";
export type { ContainerInterface } from "./src/contracts/container-interface";
export { createApp, createApplication, type CreateApplicationOptions } from "./src/create-app";
export { createHttpHandler } from "./src/create-http-handler";
export { createServeOptions, type CreateServeOptionsInput } from "./src/create-serve-options";
export { CORE_SERVICE_KEYS, MIDDLEWARE_STACK_KEY, ROUTER_KEY, EVENT_DISPATCHER_KEY, SYNC_BUS_KEY, type CoreServiceKey } from "./src/core-keys";
export { wireCoreServices } from "./src/wire-core-services";
export type { ApplicationConfig, ApplicationState, RequestHandler } from "./src/types";
