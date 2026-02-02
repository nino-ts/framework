import { Model } from '@/model';
import { QueryBuilder } from '@/query-builder';

/**
 * Constructor type for mixin pattern.
 *
 * @template T - The base class type
 */
type Constructor<T extends Model = Model> = new (...args: never[]) => T;

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
export function SoftDeletes<TBase extends Constructor>(Base: TBase) {
    return class extends Base {
        /**
         * Soft delete the model by setting deleted_at timestamp.
         *
         * @returns Promise resolving to true if successful
         */
        async delete(): Promise<boolean> {
            this.setAttribute('deleted_at', new Date().toISOString());
            return this.save();
        }

        /**
         * Override newQuery to apply global scope excluding soft-deleted records.
         *
         * @returns QueryBuilder instance with soft delete scope
         */
        newQuery(): QueryBuilder {
            const builder = super.newQuery() as QueryBuilder;
            builder.whereNull('deleted_at');
            return builder;
        }

        /**
         * Get a new query builder that includes soft-deleted records.
         *
         * @returns QueryBuilder instance without soft delete scope
         *
         * @example
         * ```typescript
         * const allUsers = await User.withTrashed().get();
         * ```
         */
        static withTrashed(): QueryBuilder {
            return (new this()).newQueryWithoutScopes();
        }

        /**
         * Get a new query builder without applying the soft delete scope.
         *
         * @returns QueryBuilder instance without scopes
         */
        newQueryWithoutScopes(): QueryBuilder {
            return super.newQuery() as QueryBuilder;
        }
    };
}
