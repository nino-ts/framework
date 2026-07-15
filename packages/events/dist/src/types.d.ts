/**
 * Job contract — implement {@link handle} for sync/async execution.
 */
export interface Job {
    handle(): void | Promise<void>;
}
/**
 * Supported queue connections (sync only in Sprint 2).
 */
export type QueueConnection = "sync";
/**
 * Event listener callback or class with a handle method.
 */
export type EventListener<T = unknown> = ((event: T) => void | Promise<void>) | {
    handle(event: T): void | Promise<void>;
};
/**
 * Constructor used as the listener registry key.
 */
export type EventClass<T = unknown> = abstract new (...args: never[]) => T;
