import { Model } from '@/model';

type Constructor<T = Model> = new (...args: any[]) => T;
type EventCallback = (model: Model) => boolean | void;
type EventName =
    | 'creating' | 'created'
    | 'updating' | 'updated'
    | 'saving' | 'saved'
    | 'deleting' | 'deleted'
    | 'restoring' | 'restored';

// Static event storage per class
const eventListeners = new Map<string, Map<EventName, EventCallback[]>>();

/**
 * HasEvents mixin adds model lifecycle events.
 * 
 * Events: creating, created, updating, updated, saving, saved, deleting, deleted
 */
export function HasEvents<TBase extends Constructor>(Base: TBase) {
    return class extends Base {
        /**
         * Add an event listener
         */
        static addEventListener(event: EventName, callback: EventCallback): void {
            const className = this.name;
            if (!eventListeners.has(className)) {
                eventListeners.set(className, new Map());
            }
            const listeners = eventListeners.get(className)!;
            if (!listeners.has(event)) {
                listeners.set(event, []);
            }
            listeners.get(event)!.push(callback);
        }

        /**
         * Clear all event listeners (useful for tests)
         */
        static clearEventListeners(): void {
            eventListeners.delete(this.name);
        }

        /**
         * Fire a model event
         * @returns false if any listener returns false, true otherwise
         */
        protected fireModelEvent(event: EventName): boolean {
            const className = this._modelClass?.name || this.constructor.name;
            const listeners = eventListeners.get(className)?.get(event);
            if (!listeners) {
                return true;
            }

            for (const callback of listeners) {
                const result = callback(this as unknown as Model);
                if (result === false) {
                    return false;
                }
            }
            return true;
        }

        /**
         * Override save to fire events
         */
        override async save(): Promise<boolean> {
            const isCreating = !this.exists;

            // Fire saving event
            if (!this.fireModelEvent('saving')) {
                return false;
            }

            // Fire creating/updating event
            if (isCreating) {
                if (!this.fireModelEvent('creating')) {
                    return false;
                }
            } else {
                if (!this.fireModelEvent('updating')) {
                    return false;
                }
            }

            // Call parent save
            const result = await super.save();

            if (result) {
                // Fire created/updated event
                if (isCreating) {
                    this.fireModelEvent('created');
                } else {
                    this.fireModelEvent('updated');
                }

                // Fire saved event
                this.fireModelEvent('saved');
            }

            return result;
        }
    };
}
