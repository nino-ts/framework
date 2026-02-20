import type { Model } from '@/model.ts';
import type { QueryBuilder } from '@/query-builder.ts';

/**
 * Constructor type for mixin pattern.
 * Note: TypeScript requires any[] for mixin constructors (TS2545).
 *
 * @template T - The base class type
 */
type Constructor<T extends Model = Model> = new (...args: any[]) => T;

/**
 * Type for model class with scope methods.
 */
interface ModelWithScopes {
  /**
   * Get a new query builder for the model.
   */
  query(): QueryBuilder;

  /**
   * Model class name.
   */
  name: string;

  /**
   * Scope methods are prefixed with 'scope'.
   */
  [key: `scope${string}`]: (query: QueryBuilder, ...args: unknown[]) => QueryBuilder;
}

/**
 * HasScopes mixin adds local scope support.
 *
 * @template TBase - The base constructor type
 *
 * @example
 * ```typescript
 * class User extends HasScopes(Model) {
 *     static scopeActive(query: QueryBuilder) {
 *         return query.where('active', '=', true);
 *     }
 *
 *     static scopeOlderThan(query: QueryBuilder, age: number) {
 *         return query.where('age', '>', age);
 *     }
 * }
 *
 * // Usage: User.scope('active').get()
 * // Or with params: User.scope('olderThan', 25).get()
 * ```
 */
export function HasScopes<TBase extends Constructor>(Base: TBase) {
  return class extends Base {
    /**
     * Apply a local scope to the query.
     *
     * @param name - Scope name (without 'scope' prefix)
     * @param args - Arguments to pass to the scope method
     * @returns QueryBuilder with scope applied
     *
     * @throws Error if scope method not found
     *
     * @example
     * ```typescript
     * User.scope('active').get();
     * User.scope('olderThan', 25).get();
     * ```
     */
    static scope(name: string, ...args: unknown[]): QueryBuilder {
      const scopeMethod = `scope${name.charAt(0).toUpperCase()}${name.slice(1)}` as const;
      const modelClass = this as unknown as ModelWithScopes;

      if (typeof modelClass[scopeMethod] !== 'function') {
        throw new Error(`Scope '${name}' not found on ${modelClass.name}`);
      }

      const query = modelClass.query();
      return modelClass[scopeMethod](query, ...args);
    }
  };
}
