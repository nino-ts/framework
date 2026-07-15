/**
 * Arr utility class for array and object manipulation
 *
 * Provides static methods for common operations on arrays and objects
 * inspired by Laravel's Arr class
 *
 * @example
 * ```typescript
 * // Get with dot notation
 * Arr.get({ user: { name: 'John' } }, 'user.name'); // 'John'
 *
 * // Merge objects
 * Arr.merge({ a: 1 }, { b: 2 }); // { a: 1, b: 2 }
 *
 * // Unique values
 * Arr.unique([1, 2, 2, 3]); // [1, 2, 3]
 * ```
 */
export declare const Arr: {
    /**
     * Return all keys except specified ones from an object
     *
     * @param obj - The object to filter
     * @param keys - Keys to exclude
     * @returns New object without specified keys
     * @example
     * ```typescript
     * const user = { id: 1, name: 'John', password: '...' };
     * Arr.except(user, ['password']); // { id: 1, name: 'John' }
     * ```
     */
    except<T extends Record<string, unknown>>(obj: T, keys: string[]): Partial<T>;
    /**
     * Flatten an array recursively
     *
     * @param arr - Array to flatten
     * @param depth - How many levels deep to flatten (default: Infinity)
     * @returns Flattened array
     * @example
     * ```typescript
     * Arr.flatten([1, [2, 3], [4, [5]]], 1); // [1, 2, 3, 4, [5]]
     * Arr.flatten([1, [2, [3, [4]]]]); // [1, 2, 3, 4]
     * ```
     */
    flatten<T>(arr: unknown[], depth?: number): T[];
    /**
     * Get an item from an object using dot notation
     *
     * @param obj - The object to get from
     * @param key - The key to get (supports dot notation: 'user.profile.name')
     * @param defaultValue - Default value if key not found
     * @returns The value or default
     * @example
     * ```typescript
     * const user = { profile: { name: 'John' } };
     * Arr.get(user, 'profile.name'); // 'John'
     * Arr.get(user, 'profile.email', 'unknown'); // 'unknown'
     * ```
     */
    get<T = unknown>(obj: unknown, key: string, defaultValue?: T): T | undefined;
    /**
     * Group array items by a key or function
     *
     * @param arr - Array to group
     * @param keyOrFn - Key name or function to group by
     * @returns Object with grouped items
     * @example
     * ```typescript
     * const items = [
     *   { type: 'a', value: 1 },
     *   { type: 'b', value: 2 },
     *   { type: 'a', value: 3 }
     * ];
     * Arr.groupBy(items, 'type');
     * // { a: [{ type: 'a', value: 1 }, { type: 'a', value: 3 }], b: [...] }
     * ```
     */
    groupBy<T>(arr: T[], keyOrFn: string | ((item: T) => string | number)): Record<string, T[]>;
    /**
     * Check if an object has a given key using dot notation
     *
     * @param obj - The object to check
     * @param key - The key to check (supports dot notation)
     * @returns True if key exists
     * @example
     * ```typescript
     * const user = { profile: { name: 'John' } };
     * Arr.has(user, 'profile.name'); // true
     * Arr.has(user, 'profile.email'); // false
     * ```
     */
    has(obj: unknown, key: string): boolean;
    /**
     * Check if a value is empty
     *
     * @param value - Value to check
     * @returns True if value is empty
     * @example
     * ```typescript
     * Arr.isEmpty([]); // true
     * Arr.isEmpty({}); // true
     * Arr.isEmpty(''); // true
     * Arr.isEmpty(null); // true
     * Arr.isEmpty(0); // true
     * Arr.isEmpty([1]); // false
     * ```
     */
    isEmpty(value: unknown): boolean;
    /**
     * Index array by a key or function
     *
     * @param arr - Array to index
     * @param keyOrFn - Key name or function to index by
     * @returns Object indexed by the specified key
     * @example
     * ```typescript
     * const users = [{ id: 1, name: 'John' }, { id: 2, name: 'Jane' }];
     * Arr.keyBy(users, 'id');
     * // { 1: { id: 1, name: 'John' }, 2: { id: 2, name: 'Jane' } }
     * ```
     */
    keyBy<T>(arr: T[], keyOrFn: string | ((item: T) => string | number)): Record<string, T>;
    /**
     * Recursively merge one or more objects
     *
     * @param objects - Objects to merge
     * @returns Merged object
     * @example
     * ```typescript
     * Arr.merge({ a: 1 }, { b: 2 }); // { a: 1, b: 2 }
     * Arr.merge({ user: { name: 'John' } }, { user: { age: 30 } });
     * // { user: { name: 'John', age: 30 } }
     * ```
     */
    merge(...objects: Record<string, unknown>[]): Record<string, unknown>;
    /**
     * Return only specified keys from an object
     *
     * @param obj - The object to filter
     * @param keys - Keys to include
     * @returns New object with only specified keys
     * @example
     * ```typescript
     * const user = { id: 1, name: 'John', email: 'john@example.com' };
     * Arr.only(user, ['id', 'name']); // { id: 1, name: 'John' }
     * ```
     */
    only<T extends Record<string, unknown>>(obj: T, keys: string[]): Partial<T>;
    /**
     * Set an item in an object using dot notation
     *
     * @param obj - The object to set in
     * @param key - The key to set (supports dot notation)
     * @param value - The value to set
     * @returns The modified object
     * @example
     * ```typescript
     * const user = {};
     * Arr.set(user, 'profile.name', 'John');
     * // user.profile.name === 'John'
     * ```
     */
    set(obj: Record<string, unknown>, key: string, value: unknown): Record<string, unknown>;
    /**
     * Get unique values from an array
     *
     * @param arr - Array to get unique values from
     * @returns Array with only unique values
     * @example
     * ```typescript
     * Arr.unique([1, 2, 2, 3, 3, 3]); // [1, 2, 3]
     * ```
     */
    unique<T>(arr: T[]): T[];
};
