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
export declare function Column(name: string): (target: object | undefined, context: string | ClassFieldDecoratorContext) => void;
