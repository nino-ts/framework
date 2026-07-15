import type { Model } from "../model";
/**
 * Constructor type for mixin pattern.
 * Note: Mixin constructors accept unknown arguments and preserve the concrete model type.
 *
 * @template T - The base class type
 */
export type Constructor<T extends Model = Model> = new (...args: unknown[]) => T;
type TimestampedModel = Model & {
    updateTimestamps(): void;
};
type TimestampedConstructor<TBase extends Constructor> = new (...args: ConstructorParameters<TBase>) => InstanceType<TBase> & TimestampedModel;
/**
 * HasTimestamps mixin handles automatic timestamp management.
 *
 * @template TBase - The base constructor type
 *
 * @example
 * ```typescript
 * class User extends HasTimestamps(Model) {
 *     protected static table = 'users';
 * }
 *
 * const user = new User({ name: 'John' });
 * await user.save(); // Automatically sets created_at and updated_at
 *
 * user.name = 'Jane';
 * await user.save(); // Automatically updates updated_at
 * ```
 */
export declare function HasTimestamps<TBase extends Constructor>(Base: TBase): TBase & TimestampedConstructor<TBase>;
export {};
