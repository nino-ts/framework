/**
 * Wire core HTTP services into the application container.
 *
 * @packageDocumentation
 */

import { MiddlewareStack } from "@ninots/middleware";
import { EventDispatcher, SyncBus } from "@ninots/events";
import { Router } from "@ninots/routing";
import type { Application } from "@/application.ts";
import { ROUTER_KEY, MIDDLEWARE_STACK_KEY, EVENT_DISPATCHER_KEY, SYNC_BUS_KEY } from "@/core-keys.ts";
import { createHttpHandler } from "@/create-http-handler.ts";

/**
 * Registers router, middleware, events, sync bus, and the default HTTP handler.
 *
 * @param app - Application instance to wire
 * @returns The same application for chaining
 */
export function wireCoreServices(app: Application): Application {
    const router = new Router();
    const middlewareStack = new MiddlewareStack();
    const eventDispatcher = new EventDispatcher();
    const syncBus = new SyncBus("sync");

    app.instance(ROUTER_KEY, router);
    app.instance(MIDDLEWARE_STACK_KEY, middlewareStack);
    app.instance(EVENT_DISPATCHER_KEY, eventDispatcher);
    app.instance(SYNC_BUS_KEY, syncBus);
    app.setHandler(createHttpHandler(app));

    return app;
}
