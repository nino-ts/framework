/**
 * Render helpers — TSX/string views to HTTP Response.
 *
 * @packageDocumentation
 */
import type { ViewComponent, ViewInit, ViewResult } from "./types";
/**
 * Render a view result (HTML string or component) into an HTTP Response.
 *
 * @param view - HTML string, promise, or view component
 * @param props - Props when `view` is a component function
 * @param init - Optional Response init (status, headers)
 */
export declare function render<P extends Record<string, unknown> = Record<string, unknown>>(view: ViewResult | ViewComponent<P>, props?: P, init?: ViewInit): Promise<Response>;
