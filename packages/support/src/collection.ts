import { Arr } from './arr';

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
export class Collection<T = unknown> implements Iterable<T> {
    /**
     * @internal
     */
    private items: T[];

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
    constructor(items: T[] = []) {
        this.items = Array.isArray(items) ? items : [];
    }

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
    map<U>(fn: (item: T, index: number) => U): Collection<U> {
        return new Collection(this.items.map(fn));
    }

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
    filter(fn: (item: T, index: number) => boolean): Collection<T> {
        return new Collection(this.items.filter(fn));
    }

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
    reduce(fn: (acc: unknown, item: T, index: number) => unknown, initial?: unknown): unknown {
        if (arguments.length > 1) {
            return (this.items as unknown[]).reduce(fn as (acc: unknown, item: unknown, index: number) => unknown, initial);
        }

        if (this.items.length === 0) {
            throw new Error('Reduce of empty array with no initial value');
        }

        return (this.items as unknown[]).reduce(fn as (acc: unknown, item: unknown, index: number) => unknown);
    }

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
    groupBy(keyOrFn: string | ((item: T) => string | number)): Record<string, T[]> {
        return Arr.groupBy(this.items, keyOrFn);
    }

    /**
     * Get unique items in the collection
     *
     * @returns New Collection with only unique items
     * @example
     * ```typescript
     * new Collection([1, 2, 2, 3, 3]).unique(); // Collection [1, 2, 3]
     * ```
     */
    unique(): Collection<T> {
        return new Collection(Arr.unique(this.items));
    }

    /**
     * Get the values as a plain array
     *
     * @returns Plain array of items
     * @example
     * ```typescript
     * new Collection([1, 2, 3]).values(); // [1, 2, 3]
     * ```
     */
    values(): T[] {
        return this.items;
    }

    /**
     * Convert collection to array
     *
     * @returns Array representation of collection
     * @example
     * ```typescript
     * new Collection([1, 2, 3]).toArray(); // [1, 2, 3]
     * ```
     */
    toArray(): T[] {
        return [...this.items];
    }

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
    [Symbol.iterator](): Iterator<T> {
        return this.items[Symbol.iterator]();
    }
}
