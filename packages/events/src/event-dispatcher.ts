import type { EventClass, EventListener } from "./types";

/**
 * In-memory event dispatcher with a listener registry.
 */
export class EventDispatcher {
    private readonly listeners = new Map<EventClass, Set<EventListener>>();

    /**
     * Register a listener for an event class.
     */
    public listen<T>(event: EventClass<T>, listener: EventListener<T>): void {
        const bucket = this.listeners.get(event) ?? new Set<EventListener>();
        bucket.add(listener as EventListener);
        this.listeners.set(event, bucket);
    }

    /**
     * Dispatch an event to all registered listeners.
     */
    public async dispatch<T extends object>(event: T): Promise<void> {
        const eventClass = event.constructor as EventClass<T>;
        const bucket = this.listeners.get(eventClass);
        if (!bucket) {
            return;
        }

        for (const listener of bucket) {
            if (typeof listener === "function") {
                await listener(event);
                continue;
            }
            await listener.handle(event);
        }
    }

    /**
     * Returns whether any listener is registered for the event class.
     */
    public hasListeners<T>(event: EventClass<T>): boolean {
        return (this.listeners.get(event)?.size ?? 0) > 0;
    }
}
