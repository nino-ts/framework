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
export declare function Table(name: string): (target: object, context?: ClassDecoratorContext) => void;
