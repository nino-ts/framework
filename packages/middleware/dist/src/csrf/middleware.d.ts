/**
 * CSRF verification middleware using `Bun.CSRF`.
 *
 * @packageDocumentation
 */
import type { CsrfOptions } from "./types";
import type { Middleware } from "../types";
/**
 * Create middleware that verifies CSRF tokens on unsafe HTTP methods.
 *
 * Safe methods (`GET`, `HEAD`, `OPTIONS`) pass through without verification.
 */
export declare function verifyCsrf(options?: CsrfOptions): Middleware;
