/**
 * Factory for the default router + middleware HTTP handler.
 *
 * @packageDocumentation
 */

import { Pipeline, type Middleware, MiddlewareStack } from "@ninots/middleware";
import type { Router } from "@ninots/routing";
import type { Application } from "@/application.ts";
import { ROUTER_KEY, MIDDLEWARE_STACK_KEY } from "@/core-keys.ts";
import type { RequestHandler } from "@/types.ts";

/**
 * Creates an HTTP request handler that dispatches through the registered router and pipeline.
 *
 * @param app - Application with wired router and middleware stack
 * @returns Request handler suitable for {@link Application.setHandler} or `Bun.serve`
 */
export function createHttpHandler(app: Application): RequestHandler {
    return async (request: Request): Promise<Response> => {
        const router = app.make<Router>(ROUTER_KEY);
        const middlewareStack = app.make<MiddlewareStack>(MIDDLEWARE_STACK_KEY);
        const url = new URL(request.url);
        const match = router.match(request.method, url.pathname);

        if (!match) {
            return new Response("Not Found", { status: 404 });
        }

        const terminal = async (req: Request): Promise<Response> => {
            return match.route.handler(req, match.params);
        };

        const middlewareNames = match.route.middleware ?? [];
        if (middlewareNames.length === 0) {
            return terminal(request);
        }

        const middleware: Middleware[] = middlewareStack.resolve(middlewareNames);
        const pipeline = Pipeline.create();

        return pipeline.through(middleware).then(terminal).handle(request);
    };
}
