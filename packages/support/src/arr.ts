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

import { deepClone } from './utils/helpers';

export class Arr {
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
    static get<T = unknown>(obj: unknown, key: string, defaultValue?: T): T | undefined {
        const parts = key.split('.');
        let current: unknown = obj;

        for (const part of parts) {
            if (current === null || current === undefined) {
                return defaultValue;
            }
            if (typeof current === 'object') {
                current = (current as Record<string, unknown>)[part];
            } else {
                return defaultValue;
            }
        }

        if (current === null || current === undefined) {
            return defaultValue;
        }

        return current as T | undefined;
    }

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
    static set(obj: Record<string, unknown>, key: string, value: unknown): Record<string, unknown> {
        const parts = key.split('.');
        const lastKey = parts.pop();

        if (!lastKey) return obj;

        let current = obj;

        for (const part of parts) {
            if (!(part in current) || typeof current[part] !== 'object' || current[part] === null) {
                current[part] = {};
            }
            current = current[part] as Record<string, unknown>;
        }

        current[lastKey] = value;
        return obj;
    }

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
    static has(obj: unknown, key: string): boolean {
        const parts = key.split('.');
        let current: unknown = obj;

        for (const part of parts) {
            if (current === null || current === undefined) {
                return false;
            }
            if (typeof current === 'object') {
                if (!(part in (current as Record<string, unknown>))) {
                    return false;
                }
                current = (current as Record<string, unknown>)[part];
            } else {
                return false;
            }
        }

        return true;
    }

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
    static merge(...objects: Record<string, unknown>[]): Record<string, unknown> {
        const result = deepClone(objects[0] ?? {});

        for (let i = 1; i < objects.length; i++) {
            const obj = objects[i];
            for (const key in obj) {
                const srcValue = obj[key];
                const destValue = result[key];

                if (
                    srcValue &&
                    typeof srcValue === 'object' &&
                    !Array.isArray(srcValue) &&
                    destValue &&
                    typeof destValue === 'object' &&
                    !Array.isArray(destValue)
                ) {
                    result[key] = this.merge(destValue as Record<string, unknown>, srcValue as Record<string, unknown>);
                } else {
                    result[key] = srcValue;
                }
            }
        }

        return result;
    }

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
    static only<T extends Record<string, unknown>>(obj: T, keys: string[]): Partial<T> {
        const result: Partial<T> = {};

        for (const key of keys) {
            if (key in obj) {
                result[key as keyof T] = obj[key as keyof T];
            }
        }

        return result;
    }

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
    static except<T extends Record<string, unknown>>(obj: T, keys: string[]): Partial<T> {
        const result: Partial<T> = {};
        const excludeSet = new Set(keys);

        for (const key in obj) {
            if (!excludeSet.has(key)) {
                result[key as keyof T] = obj[key as keyof T];
            }
        }

        return result;
    }

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
    static unique<T>(arr: T[]): T[] {
        return Array.from(new Set(arr));
    }

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
    static flatten<T>(arr: unknown[], depth: number = Infinity): T[] {
        const result: T[] = [];

        for (const item of arr) {
            if (depth > 0 && Array.isArray(item)) {
                result.push(...this.flatten<T>(item, depth - 1));
            } else {
                result.push(item as T);
            }
        }

        return result;
    }

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
    static groupBy<T>(arr: T[], keyOrFn: string | ((item: T) => string | number)): Record<string, T[]> {
        const result: Record<string, T[]> = {};

        for (const item of arr) {
            const key = typeof keyOrFn === 'function'
                ? String(keyOrFn(item))
                : String(this.get(item as unknown as Record<string, unknown>, keyOrFn) ?? '');

            if (!result[key]) {
                result[key] = [];
            }
            result[key].push(item);
        }

        return result;
    }

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
    static keyBy<T>(arr: T[], keyOrFn: string | ((item: T) => string | number)): Record<string, T> {
        const result: Record<string, T> = {};

        for (const item of arr) {
            const key = typeof keyOrFn === 'function'
                ? String(keyOrFn(item))
                : String(this.get(item as unknown as Record<string, unknown>, keyOrFn) ?? '');

            result[key] = item;
        }

        return result;
    }

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
    static isEmpty(value: unknown): boolean {
        if (value === null || value === undefined) {
            return true;
        }

        if (typeof value === 'string' || Array.isArray(value)) {
            return value.length === 0;
        }

        if (typeof value === 'object') {
            return Object.keys(value).length === 0;
        }

        if (typeof value === 'number' || typeof value === 'boolean') {
            return value === 0 || value === false;
        }

        return false;
    }
}
