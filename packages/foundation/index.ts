/**
 * @ninots/foundation - application foundation.
 *
 * @packageDocumentation
 */

export { Application } from "@/application.ts";
export type { ApplicationInterface } from "@/contracts/application-interface.ts";
export type { ContainerInterface } from "@/contracts/container-interface.ts";
export { createApp, createApplication, type CreateApplicationOptions } from "@/create-app.ts";
export { createHttpHandler } from "@/create-http-handler.ts";
export { createServeOptions, type CreateServeOptionsInput } from "@/create-serve-options.ts";
export { CORE_SERVICE_KEYS, MIDDLEWARE_STACK_KEY, ROUTER_KEY, EVENT_DISPATCHER_KEY, SYNC_BUS_KEY, type CoreServiceKey } from "@/core-keys.ts";
export { wireCoreServices } from "@/wire-core-services.ts";
export type { ApplicationConfig, ApplicationState, RequestHandler } from "@/types.ts";
