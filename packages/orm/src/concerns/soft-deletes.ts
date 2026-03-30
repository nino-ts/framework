import type { Model } from '@/model.ts';
import type { QueryBuilder } from '@/query-builder.ts';

/**
 * Constructor type for mixin pattern.
 * Note: TypeScript requires any[] for mixin constructors (TS2545).
 *
 * @template T - The base class type
 */
// biome-ignore lint/suspicious/noExplicitAny: Mixin constructor pattern requires any[]
export type Constructor<T extends Model = Model> = new (...args: any[]) => T;

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
    override newQuery(): QueryBuilder<Model<Record<string, unknown>>> {
      const builder = super.newQuery() as unknown as QueryBuilder<Model<Record<string, unknown>>>;
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
    static withTrashed(): QueryBuilder<Model<Record<string, unknown>>> {
      const Ctor =
        /* biome-ignore lint/complexity/noThisInStatic: Mixins require this to identify the class */ this as unknown as new () => Model<
        Record<string, unknown>
      >;
      // @ts-expect-error Property 'newQueryWithoutScopes' does not exist on type 'Model<Record<string, unknown>>'
      return new Ctor().newQueryWithoutScopes() as unknown as QueryBuilder<Model<Record<string, unknown>>>;
    }

    /**
     * Get a new query builder without applying the soft delete scope.
     *
     * @returns QueryBuilder instance without scopes
     */
    newQueryWithoutScopes(): QueryBuilder<Model<Record<string, unknown>>> {
      return super.newQuery() as unknown as QueryBuilder<Model<Record<string, unknown>>>;
    }
  };
}
