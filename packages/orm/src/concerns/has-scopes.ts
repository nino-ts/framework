import { Model } from '@/model';
import { QueryBuilder } from '@/query-builder';

type Constructor<T = Model> = new (...args: any[]) => T;

/**
 * HasScopes mixin adds local scope support.
 * 
 * Define scopes as static methods prefixed with 'scope':
 * ```typescript
 * class User extends HasScopes(Model) {
 *   static scopeActive(query: QueryBuilder) {
 *     return query.where('active', '=', true);
 *   }
 * }
 * 
 * // Usage: User.scope('active').get()
 * // Or with params: User.scope('olderThan', 25).get()
 * ```
 */
export function HasScopes<TBase extends Constructor>(Base: TBase) {
    return class extends Base {
        /**
         * Apply a local scope
         */
        static scope(name: string, ...args: any[]): QueryBuilder {
            const scopeMethod = `scope${name.charAt(0).toUpperCase()}${name.slice(1)}`;

            if (typeof (this as any)[scopeMethod] !== 'function') {
                throw new Error(`Scope '${name}' not found on ${this.name}`);
            }

            const query = (this as any).query();
            return (this as any)[scopeMethod](query, ...args);
        }
    };
}
