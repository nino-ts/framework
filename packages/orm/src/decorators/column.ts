import type { Model } from '@/model';
import type { ColumnMapping } from '@/model';

/**
 * Type for model instance with column mapping metadata.
 */
interface ModelInstanceWithMapping extends Model {
    constructor: {
        __columnMapping?: ColumnMapping;
    };
}

/**
 * Column decorator to map a property name to a database column name.
 *
 * @param name - The database column name
 * @returns Decorator function
 *
 * @example
 * ```typescript
 * class User extends Model {
 *     @Column('first_name')
 *     firstName!: string;
 *
 *     @Column('last_name')
 *     lastName!: string;
 * }
 *
 * const user = new User();
 * user.firstName = 'John'; // Maps to 'first_name' column
 * ```
 */
export function Column(name: string) {
    return function (
        target: Model | object,
        context: string | ClassFieldDecoratorContext
    ): void {
        // Legacy Decorator Support
        if (typeof context === 'string') {
            const propertyKey = context;
            const targetWithMapping = target as ModelInstanceWithMapping;

            if (!targetWithMapping.constructor.__columnMapping) {
                Object.defineProperty(targetWithMapping.constructor, '__columnMapping', {
                    value: {},
                    enumerable: false,
                    writable: true,
                    configurable: true
                });
            }
            targetWithMapping.constructor.__columnMapping![propertyKey] = name;
            return;
        }

        // Standard Decorator Support
        const ctx = context as ClassFieldDecoratorContext;
        ctx.addInitializer(function (this: unknown) {
            const instance = this as ModelInstanceWithMapping;
            if (!instance.constructor.__columnMapping) {
                Object.defineProperty(instance.constructor, '__columnMapping', {
                    value: {},
                    enumerable: false,
                    writable: true,
                    configurable: true
                });
            }
            const propName = String(ctx.name);
            instance.constructor.__columnMapping![propName] = name;
        });
    };
}
