import type { Model } from '@/model';

/**
 * Type for class constructor with table property.
 */
interface ModelConstructorWithTable {
    table: string;
}

/**
 * Table decorator to specify the database table name for a model.
 *
 * @param name - The table name
 * @returns Decorator function
 *
 * @example
 * ```typescript
 * @Table('users')
 * class User extends Model {
 *     // ...
 * }
 * ```
 */
export function Table(name: string) {
    return function (
        target: (new (...args: unknown[]) => Model) | typeof Model,
        context?: ClassDecoratorContext
    ): void {
        // Legacy Support (target is Constructor)
        if (typeof target === 'function' && (!context || typeof context === 'undefined')) {
            (target as unknown as ModelConstructorWithTable).table = name;
            return;
        }

        // Standard Support
        if (context) {
            context.addInitializer(function (this: ModelConstructorWithTable) {
                this.table = name;
            });
        }
    };
}
