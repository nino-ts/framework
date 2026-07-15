import type { Model } from "../model";
import type { QueryBuilder } from "../query-builder";
/**
 * Constructor type for mixin pattern.
 * Note: Mixin constructors accept unknown arguments and preserve the concrete model type.
 *
 * @template T - The base class type
 */
export type Constructor<T extends Model = Model> = new (...args: unknown[]) => T;
type SoftDeletesConstructor<TBase extends Constructor> = TBase & {
    withTrashed(): QueryBuilder<Model<Record<string, unknown>>>;
};
/**
 * SoftDeletes mixin handles soft deletion of models.
 *
 * @template TBase - The base constructor type
 *
 * @example
 * ```typescript
 * class User extends SoftDeletes(Model) {
 *     protected static table = 'users';
 * }
 *
 * const user = await User.find(1);
 * await user.delete(); // Soft delete (sets deleted_at)
 *
 * // Query with soft-deleted records
 * const allUsers = await User.withTrashed().get();
 * ```
 */
export declare function SoftDeletes<TBase extends Constructor>(Base: TBase): SoftDeletesConstructor<TBase>;
export {};
