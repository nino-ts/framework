/**
 * Response helper functions for creating HTTP responses.
 *
 * @packageDocumentation
 */
import type { BunFile } from "bun";
import type { FileResponseOptions, HtmlResponseOptions, JsonResponseOptions, RedirectResponseOptions, TextResponseOptions } from "./types";
/**
 * Helper functions for creating HTTP responses.
 *
 * These are static methods that work with native Response objects,
 * providing a Laravel-like API for common response types.
 *
 * @example
 * ```typescript
 * // JSON response
 * return ResponseHelpers.json({ user: 'John' });
 *
 * // Redirect
 * return ResponseHelpers.redirect('/login');
 *
 * // HTML
 * return ResponseHelpers.html('<h1>Hello</h1>');
 * ```
 */
/** @internal */
export interface ResponseHelpersType {
    badRequest(message?: string): Response;
    created<T>(data?: T, location?: string): Response;
    file(file: BunFile, options?: FileResponseOptions): Response;
    forbidden(message?: string): Response;
    html(html: string, options?: HtmlResponseOptions): Response;
    json<T>(body: T, options?: JsonResponseOptions): Response;
    noContent(): Response;
    notFound(message?: string): Response;
    redirect(url: string, options?: RedirectResponseOptions | number): Response;
    serverError(message?: string): Response;
    text(text: string, options?: TextResponseOptions): Response;
    unauthorized(message?: string): Response;
    unprocessableEntity(errors: Record<string, unknown>): Response;
}
export declare const ResponseHelpers: ResponseHelpersType;
