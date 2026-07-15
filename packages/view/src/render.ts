/**
 * Render helpers — TSX/string views to HTTP Response.
 *
 * @packageDocumentation
 */

import type { SafeHtml } from "./safe-html";
import { toHtmlString } from "./safe-html";
import type { ViewComponent, ViewInit, ViewResult } from "./types";

const HTML_CONTENT_TYPE = "text/html; charset=utf-8";

function resolveViewResult(view: ViewResult): Promise<string> {
    return Promise.resolve(view).then((value) => toHtmlString(value));
}

/**
 * Render a view result (HTML string or component) into an HTTP Response.
 *
 * @param view - HTML string, promise, or view component
 * @param props - Props when `view` is a component function
 * @param init - Optional Response init (status, headers)
 */
export function render<P extends Record<string, unknown> = Record<string, unknown>>(
    view: ViewResult | ViewComponent<P>,
    props?: P,
    init?: ViewInit,
): Promise<Response> {
    const content =
        typeof view === "function"
            ? resolveViewResult((view as ViewComponent<P>)(props ?? ({} as P)))
            : resolveViewResult(view);

    return content.then((html) => {
        const headers = new Headers(init?.headers);
        if (!headers.has("Content-Type")) {
            headers.set("Content-Type", HTML_CONTENT_TYPE);
        }

        return new Response(html, {
            ...init,
            headers,
            status: init?.status ?? 200,
        });
    });
}
