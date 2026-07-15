import type { Model } from "../model";
import type { QueryBuilder } from "../query-builder";
/**
 * Constructor type for mixin pattern.
 * Note: Mixin constructors accept unknown arguments and preserve the concrete model type.
 *
 * @template T - The base class type
 */
export type Constructor<T extends Model = Model> = new (...args: unknown[]) => T;
type ScopedConstructor<TBase extends Constructor> = TBase & {
    scope(name: string, ...args: unknown[]): QueryBuilder;
};
/**
 * Type for model class with scope methods.
 */
export interface ModelWithScopes {
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
export declare function HasScopes<TBase extends Constructor>(Base: TBase): ScopedConstructor<TBase>;
export {};
