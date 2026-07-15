/**
 * Collection class for fluent array operations
 *
 * Provides a fluent interface for working with arrays,
 * supporting common operations like map, filter, reduce
 *
 * @example
 * ```typescript
 * const collection = new Collection([1, 2, 3, 4, 5]);
 * const result = collection
 *   .map(n => n * 2)
 *   .filter(n => n > 4)
 *   .toArray(); // [6, 8, 10]
 * ```
 */
export declare class Collection<T = unknown> implements Iterable<T> {
    /**
     * @internal
     */
    private items;
    /**
     * Create a new Collection
     *
     * @param items - Array or items to initialize the collection with
     * @example
     * ```typescript
     * const col = new Collection([1, 2, 3]);
     * const empty = new Collection();
     * ```
     */
    constructor(items?: T[]);
    /**
     * Apply a function to each item and return a new Collection
     *
     * @param fn - Transform function
     * @returns New Collection with transformed items
     * @example
     * ```typescript
     * new Collection([1, 2, 3]).map(n => n * 2); // Collection [2, 4, 6]
     * ```
     */
    map<U>(fn: (item: T, index: number) => U): Collection<U>;
    /**
     * Filter items by a predicate function
     *
     * @param fn - Predicate function
     * @returns New Collection with filtered items
     * @example
     * ```typescript
     * new Collection([1, 2, 3, 4, 5]).filter(n => n > 2); // Collection [3, 4, 5]
     * ```
     */
    filter(fn: (item: T, index: number) => boolean): Collection<T>;
    /**
     * Reduce items to a single value
     *
     * @param fn - Reducer function
     * @param initial - Initial value (optional, uses first item if not provided)
     * @returns Reduced value
     * @example
     * ```typescript
     * new Collection([1, 2, 3, 4]).reduce((sum, n) => sum + n, 0); // 10
     * ```
     */
    reduce<U>(fn: (acc: U, item: T, index: number) => U, initialValue: U): U;
    reduce(fn: (acc: T, item: T, index: number) => T): T;
    /**
     * Group items by a key or function
     *
     * @param keyOrFn - Key name or function to group by
     * @returns Object with grouped items as arrays
     * @example
     * ```typescript
     * const items = [{ type: 'a', value: 1 }, { type: 'b', value: 2 }];
     * const col = new Collection(items);
     * const grouped = col.groupBy('type');
     * // { a: [...], b: [...] }
     * ```
     */
    groupBy(keyOrFn: string | ((item: T) => string | number)): Record<string, T[]>;
    /**
     * Get unique items in the collection
     *
     * @returns New Collection with only unique items
     * @example
     * ```typescript
     * new Collection([1, 2, 2, 3, 3]).unique(); // Collection [1, 2, 3]
     * ```
     */
    unique(): Collection<T>;
    /**
     * Get the values as a plain array
     *
     * @returns Plain array of items
     * @example
     * ```typescript
     * new Collection([1, 2, 3]).values(); // [1, 2, 3]
     * ```
     */
    values(): T[];
    /**
     * Convert collection to array
     *
     * @returns Array representation of collection
     * @example
     * ```typescript
     * new Collection([1, 2, 3]).toArray(); // [1, 2, 3]
     * ```
     */
    toArray(): T[];
    /**
     * Implement iterable protocol for for...of loops
     *
     * @returns Iterator for the collection items
     * @example
     * ```typescript
     * const col = new Collection([1, 2, 3]);
     * for (const item of col) {
     *   console.log(item); // 1, 2, 3
     * }
     * ```
     */
    [Symbol.iterator](): Iterator<T>;
}
