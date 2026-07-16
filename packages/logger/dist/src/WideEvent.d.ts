/**
 * Wide Event / Canonical Log Line API.
 *
 * Accumulate request lifecycle fields, then emit **once** (Logging Sucks).
 * Structured JSON ≠ Wide — this is one high-dimensionality event per request.
 *
 * @packageDocumentation
 */
/**
 * Discriminant for request outcome on the canonical line.
 */
type WideEventOutcome = "success" | "error";
/**
 * Error detail required when `outcome === "error"`.
 */
type WideEventErrorFields = {
    type: string;
    message: string;
};
/**
 * Minimal fields always present on a Wide Event emit (Sprint 9 binding).
 */
type WideEvent = {
    request_id: string;
    timestamp: string;
    method: string;
    path: string;
    status_code: number;
    duration_ms: number;
    outcome: WideEventOutcome;
    error?: WideEventErrorFields;
};
/**
 * Initial request identity for {@link createWideEvent}.
 * Status / duration / outcome are filled before {@link WideEventHandle.emit}.
 */
type WideEventInit = {
    method: string;
    path: string;
    request_id?: string;
    timestamp?: string;
};
/**
 * Mutable wide-event store with mid-request enrichment and single emit.
 */
type WideEventHandle = {
    /** Mutable field bag (also used as AsyncLocalStorage store). */
    readonly fields: Record<string, unknown>;
    /**
     * Enrich the event mid-request (business fields, error, etc.).
     * Also merges into ALS via {@link addContext} when a store is active.
     */
    set(fields: Record<string, unknown>): void;
    /**
     * Serialize **one** flat JSON line via `Bun.write(Bun.stdout, …)`.
     * Call only from middleware `finally`.
     */
    emit(): void;
};
/**
 * Module-level enrichment helpers that mutate the active ALS store.
 * Prefer {@link WideEventHandle.set} when you hold the handle; `wideEvent.set`
 * is the documented alias over {@link addContext} for handlers.
 */
declare const wideEvent: {
    set(fields: Record<string, unknown>): void;
    emit(): void;
};
/**
 * Creates the initial mutable store for a request-scoped wide event.
 *
 * @param init - HTTP method / path and optional id / timestamp
 * @returns Handle with `set` / `emit` — pass `fields` to `runWithContext`
 */
declare function createWideEvent(init: WideEventInit): WideEventHandle;
export type { WideEvent, WideEventErrorFields, WideEventHandle, WideEventInit, WideEventOutcome };
export { createWideEvent, wideEvent };
