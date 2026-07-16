/**
 * HTTP middleware that emits one Wide Event (canonical log line) per request.
 *
 * Accumulates context during the lifecycle; emits once in `finally`
 * (Logging Sucks / Sprint 9 binding). No multipoint `logger.info` diary.
 *
 * @packageDocumentation
 */
import type { Middleware } from "../types";
/**
 * Optional overrides for tests / custom id generation.
 */
type WideEventMiddlewareOptions = {
    /**
     * Override request id (default: crypto.randomUUID).
     */
    requestId?: string;
    /**
     * Override timestamp at start (default: now ISO-8601).
     */
    timestamp?: string;
};
/**
 * Create middleware that starts a wide-event context and emits once in `finally`.
 *
 * Happy path: exactly one flat JSON line via `Bun.write(Bun.stdout, …)`.
 * Errors: same emit with `outcome: "error"` and `error.type` / `error.message`.
 */
declare function wideEventMiddleware(options?: WideEventMiddlewareOptions): Middleware;
export type { WideEventMiddlewareOptions };
export { wideEventMiddleware };
