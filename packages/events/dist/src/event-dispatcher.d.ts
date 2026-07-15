import type { EventClass, EventListener } from "./types";
/**
 * In-memory event dispatcher with a listener registry.
 */
export declare class EventDispatcher {
    private readonly listeners;
    /**
     * Register a listener for an event class.
     */
    listen<T>(event: EventClass<T>, listener: EventListener<T>): void;
    /**
     * Dispatch an event to all registered listeners.
     */
    dispatch<T extends object>(event: T): Promise<void>;
    /**
     * Returns whether any listener is registered for the event class.
     */
    hasListeners<T>(event: EventClass<T>): boolean;
}
