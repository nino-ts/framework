/**
 * Wire core HTTP services into the application container.
 *
 * @packageDocumentation
 */

import { MiddlewareStack } from "@ninots/middleware";
import { Router } from "@ninots/routing";
import type { Application } from "@/application.ts";
import { ROUTER_KEY, MIDDLEWARE_STACK_KEY } from "@/core-keys.ts";
import { createHttpHandler } from "@/create-http-handler.ts";

/**
 * Registers router and middleware stack singletons and sets the default HTTP handler.
 *
 * @param app - Application instance to wire
 * @returns The same application for chaining
 */
export function wireCoreServices(app: Application): Application {
    const router = new Router();
    const middlewareStack = new MiddlewareStack();

    app.instance(ROUTER_KEY, router);
    app.instance(MIDDLEWARE_STACK_KEY, middlewareStack);
    app.setHandler(createHttpHandler(app));

    return app;
}
