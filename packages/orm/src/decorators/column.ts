import type { ColumnMapping, Model } from '@/model.ts';

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
  return (target: object, context: string | ClassFieldDecoratorContext): void => {
    // Legacy Decorator Support
    if (typeof context === 'string') {
      const propertyKey = context;
      const targetWithMapping = target as ModelInstanceWithMapping;

      if (!targetWithMapping.constructor.__columnMapping) {
        Object.defineProperty(targetWithMapping.constructor, '__columnMapping', {
          configurable: true,
          enumerable: false,
          value: {},
          writable: true,
        });
      }
      if (targetWithMapping.constructor.__columnMapping) {
        targetWithMapping.constructor.__columnMapping[propertyKey] = name;
      }
      return;
    }

    // Standard Decorator Support
    const ctx = context as ClassFieldDecoratorContext;
    ctx.addInitializer(function (this: unknown) {
      const instance = this as ModelInstanceWithMapping;
      if (!instance.constructor.__columnMapping) {
        Object.defineProperty(instance.constructor, '__columnMapping', {
          configurable: true,
          enumerable: false,
          value: {},
          writable: true,
        });
      }
      const propName = String(ctx.name);
      if (instance.constructor.__columnMapping) {
        instance.constructor.__columnMapping[propName] = name;
      }
    });
  };
}
