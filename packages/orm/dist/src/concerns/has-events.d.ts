import type { Model } from "../model";
/**
 * Constructor type for mixin pattern.
 * Note: Mixin constructors accept unknown arguments and preserve the concrete model type.
 *
 * @template T - The base class type
 */
export type Constructor<T extends Model = Model> = new (...args: unknown[]) => T;
type EventfulModel = Model & {
    fireModelEvent(event: EventName): boolean;
};
type EventfulConstructor<TBase extends Constructor> = (new (...args: ConstructorParameters<TBase>) => InstanceType<TBase> & EventfulModel) & {
    addEventListener(event: EventName, callback: EventCallback): void;
    clearEventListeners(): void;
};
/**
 * Event callback function type.
 * Return false to prevent the event from continuing.
 */
export type EventCallback = (model: Model) => boolean | undefined;
/**
 * Available model lifecycle event names.
 */
export type EventName = "creating" | "created" | "updating" | "updated" | "saving" | "saved" | "deleting" | "deleted" | "restoring" | "restored";
/**
 * HasEvents mixin adds model lifecycle events.
 *
 * @template TBase - The base constructor type
 *
 * @example
 * ```typescript
 * class User extends HasEvents(Model) {
 *     protected static table = 'users';
 * }
 *
 * User.addEventListener('creating', (user) => {
 *     console.log('Creating user:', user);
 *     // Return false to cancel creation
 * });
 *
 * const user = new User({ name: 'John' });
 * await user.save(); // Fires creating, saving, created, saved events
 * ```
 */
export declare function HasEvents<TBase extends Constructor>(Base: TBase): TBase & EventfulConstructor<TBase>;
export {};
