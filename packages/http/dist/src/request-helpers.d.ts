/**
 * Request helper functions for working with HTTP requests.
 *
 * @packageDocumentation
 */
/**
 * Helper functions for working with HTTP requests.
 *
 * These are static methods that work with native Request objects,
 * providing a Laravel-like API for common operations.
 *
 * @example
 * ```typescript
 * const name = RequestHelpers.input(request, 'name');
 * const page = RequestHelpers.query(request, 'page', '1');
 * const body = await RequestHelpers.json(request);
 * ```
 */
/**
 * Cache for parsed request bodies.
 * Uses WeakMap to avoid memory leaks.
 */
import type { Server } from "bun";
/** @internal */
export interface RequestHelpersType {
    all(request: Request): Promise<Record<string, unknown>>;
    bearerToken(request: Request): string | undefined;
    cookie(request: Request, name: string, defaultValue?: string): string | undefined;
    cookies(request: Request): Record<string, string>;
    expectsJson(request: Request): boolean;
    hasHeader(request: Request, name: string): boolean;
    header(request: Request, name: string, defaultValue?: string): string | undefined;
    input<T = unknown>(request: Request, key: string, defaultValue?: T): Promise<T | undefined>;
    ip(request: Request, server?: Server<unknown>): string | undefined;
    is(request: Request, pattern: string): boolean;
    isAjax(request: Request): boolean;
    isMethod(request: Request, method: string): boolean;
    json<T = Record<string, unknown>>(request: Request): Promise<T>;
    method(request: Request): string;
    path(request: Request): string;
    query(request: Request, key: string, defaultValue?: string): string | undefined;
    queryAll(request: Request): Record<string, string>;
    url(request: Request): string;
}
export declare const RequestHelpers: RequestHelpersType;
