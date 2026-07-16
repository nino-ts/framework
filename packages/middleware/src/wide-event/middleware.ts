/**
 * HTTP middleware that emits one Wide Event (canonical log line) per request.
 *
 * Accumulates context during the lifecycle; emits once in `finally`
 * (Logging Sucks / Sprint 9 binding). No multipoint `logger.info` diary.
 *
 * @packageDocumentation
 */

import { createWideEvent, runWithContext } from "@ninots/logger";
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
function wideEventMiddleware(options: WideEventMiddlewareOptions = {}): Middleware {
    return async (request, next) => {
        const url = new URL(request.url);
        const event = createWideEvent({
            method: request.method,
            path: url.pathname,
            request_id: options.requestId,
            timestamp: options.timestamp,
        });
        const startedAt = performance.now();

        return runWithContext(event.fields, async () => {
            let response: Response | undefined;
            let thrown: unknown;

            try {
                response = await next(request);
                return response;
            } catch (error: unknown) {
                thrown = error;
                throw error;
            } finally {
                const durationMs = Math.round(performance.now() - startedAt);

                if (thrown !== undefined) {
                    const err = toError(thrown);
                    event.set({
                        status_code: 500,
                        duration_ms: durationMs,
                        outcome: "error",
                        error: {
                            type: err.name,
                            message: err.message,
                        },
                    });
                } else if (response !== undefined) {
                    const statusCode = response.status;
                    const outcome = statusCode >= 500 ? "error" : "success";
                    if (outcome === "error") {
                        event.set({
                            status_code: statusCode,
                            duration_ms: durationMs,
                            outcome,
                            error: {
                                type: "HttpError",
                                message: `HTTP ${statusCode}`,
                            },
                        });
                    } else {
                        event.set({
                            status_code: statusCode,
                            duration_ms: durationMs,
                            outcome,
                        });
                    }
                }

                event.emit();
            }
        });
    };
}

function toError(value: unknown): Error {
    if (value instanceof Error) {
        return value;
    }
    return new Error(String(value));
}

export type { WideEventMiddlewareOptions };
export { wideEventMiddleware };
