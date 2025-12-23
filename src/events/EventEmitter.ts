/**
 * Ninots Framework - Event Emitter
 * Laravel-inspired event system
 * Zero dependencies implementation
 */

import type { EventListener, EventSubscription } from '../types';

/**
 * Event dispatcher/emitter
 */
export class EventEmitter {
  private listeners: Map<string, EventSubscription[]> = new Map();
  private wildcardListeners: EventListener[] = [];

  /**
   * Register an event listener
   */
  on<T = unknown>(event: string, listener: EventListener<T>): () => void {
    const subscription: EventSubscription = {
      event,
      listener: listener as EventListener,
      once: false,
    };

    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    const eventListeners = this.listeners.get(event);
    if (eventListeners) {
      eventListeners.push(subscription);
    }

    // Return unsubscribe function
    return () => this.off(event, listener);
  }

  /**
   * Register a one-time event listener
   */
  once<T = unknown>(event: string, listener: EventListener<T>): () => void {
    const subscription: EventSubscription = {
      event,
      listener: listener as EventListener,
      once: true,
    };

    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    const onceListeners = this.listeners.get(event);
    if (onceListeners) {
      onceListeners.push(subscription);
    }

    return () => this.off(event, listener);
  }

  /**
   * Remove an event listener
   */
  off<T = unknown>(event: string, listener: EventListener<T>): void {
    const eventListeners = this.listeners.get(event);
    if (!eventListeners) return;

    const index = eventListeners.findIndex((sub) => sub.listener === listener);
    if (index !== -1) {
      eventListeners.splice(index, 1);
    }

    if (eventListeners.length === 0) {
      this.listeners.delete(event);
    }
  }

  /**
   * Register a wildcard listener (receives all events)
   */
  onAny(listener: EventListener<{ event: string; payload: unknown }>): () => void {
    this.wildcardListeners.push(listener as EventListener);
    return () => {
      const index = this.wildcardListeners.indexOf(listener as EventListener);
      if (index !== -1) {
        this.wildcardListeners.splice(index, 1);
      }
    };
  }

  /**
   * Emit an event
   */
  async emit<T = unknown>(event: string, payload?: T): Promise<void> {
    const eventListeners = this.listeners.get(event) ?? [];
    const toRemove: EventSubscription[] = [];

    // Call event-specific listeners
    for (const subscription of eventListeners) {
      await subscription.listener(payload);
      if (subscription.once) {
        toRemove.push(subscription);
      }
    }

    // Remove one-time listeners
    for (const sub of toRemove) {
      const index = eventListeners.indexOf(sub);
      if (index !== -1) {
        eventListeners.splice(index, 1);
      }
    }

    // Call wildcard listeners
    for (const listener of this.wildcardListeners) {
      await listener({ event, payload });
    }
  }

  /**
   * Emit an event synchronously
   */
  emitSync<T = unknown>(event: string, payload?: T): void {
    const eventListeners = this.listeners.get(event) ?? [];
    const toRemove: EventSubscription[] = [];

    for (const subscription of eventListeners) {
      subscription.listener(payload);
      if (subscription.once) {
        toRemove.push(subscription);
      }
    }

    for (const sub of toRemove) {
      const index = eventListeners.indexOf(sub);
      if (index !== -1) {
        eventListeners.splice(index, 1);
      }
    }

    for (const listener of this.wildcardListeners) {
      listener({ event, payload });
    }
  }

  /**
   * Check if event has listeners
   */
  hasListeners(event: string): boolean {
    return (this.listeners.get(event)?.length ?? 0) > 0;
  }

  /**
   * Get listener count for an event
   */
  listenerCount(event: string): number {
    return this.listeners.get(event)?.length ?? 0;
  }

  /**
   * Get all registered events
   */
  eventNames(): string[] {
    return Array.from(this.listeners.keys());
  }

  /**
   * Remove all listeners for an event
   */
  removeAllListeners(event?: string): void {
    if (event) {
      this.listeners.delete(event);
    } else {
      this.listeners.clear();
      this.wildcardListeners = [];
    }
  }

  /**
   * Wait for an event to be emitted
   */
  waitFor<T = unknown>(event: string, timeout?: number): Promise<T> {
    return new Promise((resolve, reject) => {
      let timeoutId: ReturnType<typeof setTimeout> | null = null;

      const unsubscribe = this.once<T>(event, (payload) => {
        if (timeoutId) clearTimeout(timeoutId);
        resolve(payload as T);
      });

      if (timeout) {
        timeoutId = setTimeout(() => {
          unsubscribe();
          reject(new Error(`Timeout waiting for event: ${event}`));
        }, timeout);
      }
    });
  }
}

// ============================================================================
// Global Event Instance
// ============================================================================

let globalEmitter: EventEmitter | null = null;

/**
 * Get the global event emitter
 */
export function events(): EventEmitter {
  if (!globalEmitter) {
    globalEmitter = new EventEmitter();
  }
  return globalEmitter;
}

/**
 * Reset the global event emitter
 */
export function resetEvents(): void {
  globalEmitter = null;
}

// ============================================================================
// Event Decorators (for class-based event handling)
// ============================================================================

const eventHandlers: Map<string, Array<{ target: object; method: string }>> = new Map();

/**
 * Decorator to mark a method as an event handler
 */
export function Listen(eventName: string): MethodDecorator {
  return (_target: object, propertyKey: string | symbol, _descriptor: PropertyDescriptor) => {
    if (!eventHandlers.has(eventName)) {
      eventHandlers.set(eventName, []);
    }
    const handlers = eventHandlers.get(eventName);
    if (handlers) {
      handlers.push({
        target: _target,
        method: String(propertyKey),
      });
    }
  };
}

/**
 * Register all decorated event handlers
 */
export function registerEventHandlers(instances: object[]): void {
  for (const [eventName, handlers] of eventHandlers) {
    for (const handler of handlers) {
      const instance = instances.find(
        (inst) => Object.getPrototypeOf(inst) === handler.target
      );
      if (instance) {
        const method = (instance as Record<string, EventListener>)[handler.method];
        if (typeof method === 'function') {
          events().on(eventName, method.bind(instance));
        }
      }
    }
  }
}
