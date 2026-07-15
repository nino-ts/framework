/**
 * Fluent wrapper for working with arrays of data.
 *
 * Provides Laravel-style collection methods for filtering, mapping, and
 * transforming data with full type safety.
 *
 * @template T - The type of items in the collection (must be specified, no default)
 *
 * @packageDocumentation
 */
/**
 * Type-safe fluent collection for working with arrays of data.
 *
 * Zero `any` types - all operations are fully type-checked.
 *
 * @example
 * ```typescript
 * interface User {
 *     id: number;
 *     name: string;
 *     age: number;
 * }
 *
 * const users = new Collection<User>([
 *     { id: 1, name: 'Alice', age: 25 },
 *     { id: 2, name: 'Bob', age: 30 },
 * ]);
 *
 * const names = users.pluck('name'); // Collection<string>
 * const avgAge = users.avg('age'); // number
 * ```
 */
export declare class Collection<T> implements Iterable<T> {
    /**
     * Internal items array.
     */
    protected readonly items: readonly T[];
    /**
     * Create a new Collection instance.
     *
     * @param items - Initial array of items
     */
    constructor(items?: readonly T[]);
    /**
     * Get the iterator for the collection items.
     *
     * Enables `for...of` loops and spread operator.
     *
     * @returns Iterator over collection items
     */
    [Symbol.iterator](): Iterator<T>;
    /**
     * Get all items in the collection as an array.
     *
     * @returns Array copy of collection items
     */
    all(): T[];
    /**
     * Get the number of items in the collection.
     *
     * @returns Item count
     */
    count(): number;
    /**
     * Get the number of items (alias for count).
     *
     * @returns Item count
     */
    length(): number;
    /**
     * Get the first item in the collection, or null if empty.
     *
     * @returns First item or null
     */
    first(): T | null;
    /**
     * Get the first item or throw if collection is empty.
     *
     * @returns First item
     * @throws Error if collection is empty
     */
    firstOrFail(): T;
    /**
     * Get the last item in the collection, or undefined if empty.
     *
     * @returns Last item or undefined
     */
    last(): T | undefined;
    /**
     * Get the last item or throw if collection is empty.
     *
     * @returns Last item
     * @throws Error if collection is empty
     */
    lastOrFail(): T;
    /**
     * Map over the collection and return a new Collection.
     *
     * @template U - The type of items in the new collection
     * @param callback - Mapping function
     * @returns New Collection with mapped items
     *
     * @example
     * ```typescript
     * const numbers = new Collection([1, 2, 3]);
     * const doubled = numbers.map(n => n * 2); // Collection<number>
     * ```
     */
    map<U>(callback: (item: T, index: number) => U): Collection<U>;
    /**
     * Filter the collection and return a new Collection.
     *
     * @param callback - Filter predicate
     * @returns New Collection with filtered items
     *
     * @example
     * ```typescript
     * const users = new Collection([{ age: 20 }, { age: 30 }]);
     * const adults = users.filter(u => u.age >= 25); // Collection<User>
     * ```
     */
    filter(callback: (item: T, index: number) => boolean): Collection<T>;
    /**
     * Pluck a specific key from all items in the collection.
     *
     * Type-safe version that ensures the key exists on items.
     *
     * @template K - The key type to pluck
     * @param key - Key to pluck from each item
     * @returns New Collection with plucked values
     *
     * @example
     * ```typescript
     * const users = new Collection([{ id: 1, name: 'Alice' }]);
     * const names = users.pluck('name'); // Collection<string>
     * ```
     */
    pluck<K extends keyof T>(key: K): Collection<T[K]>;
    /**
     * Push items onto the end of the collection (returns new collection).
     *
     * Note: Returns a new Collection to maintain immutability.
     *
     * @param items - Items to add
     * @returns New Collection with added items
     */
    push(...items: readonly T[]): Collection<T>;
    /**
     * Remove and return the last item from the collection (returns new collection).
     *
     * Note: Returns both the item and new Collection to maintain immutability.
     *
     * @returns Tuple of [popped item, new collection]
     */
    pop(): readonly [T | undefined, Collection<T>];
    /**
     * Calculate the sum of a given key (if objects) or the items themselves (if numbers).
     *
     * @param key - Optional key to sum by
     * @returns Sum of values
     *
     * @example
     * ```typescript
     * const orders = new Collection([{ total: 100 }, { total: 200 }]);
     * const totalRevenue = orders.sum('total'); // 300
     * ```
     */
    sum(key?: keyof T): number;
    /**
     * Calculate the average of a given key or the items themselves.
     *
     * @param key - Optional key to average by
     * @returns Average value
     */
    avg(key?: keyof T): number;
    /**
     * Get the minimum value.
     *
     * @param key - Optional key to inspect
     * @returns Minimum value
     */
    min(key?: keyof T): number;
    /**
     * Get the maximum value.
     *
     * @param key - Optional key to inspect
     * @returns Maximum value
     */
    max(key?: keyof T): number;
    /**
     * Return unique items in the collection.
     *
     * @param key - Optional key to ensure uniqueness by
     * @returns New Collection with unique items
     *
     * @example
     * ```typescript
     * const users = new Collection([
     *     { id: 1, name: 'Alice' },
     *     { id: 2, name: 'Bob' },
     *     { id: 1, name: 'Alice' },
     * ]);
     * const uniqueUsers = users.unique('id'); // 2 items
     * ```
     */
    unique(key?: keyof T): Collection<T>;
    /**
     * Sort the collection by a key or callback.
     *
     * @param keyOrCallback - Key to sort by or custom comparator
     * @param direction - Sort direction ('asc' or 'desc')
     * @returns New sorted Collection
     *
     * @example
     * ```typescript
     * const users = new Collection([{ age: 30 }, { age: 20 }]);
     * const sorted = users.sortBy('age'); // [{ age: 20 }, { age: 30 }]
     * ```
     */
    sortBy(keyOrCallback: keyof T | ((a: T, b: T) => number), direction?: "asc" | "desc"): Collection<T>;
    /**
     * Chunk the collection into smaller collections of a given size.
     *
     * @param size - Chunk size
     * @returns Collection of chunked collections
     *
     * @example
     * ```typescript
     * const numbers = new Collection([1, 2, 3, 4, 5]);
     * const chunks = numbers.chunk(2); // [[1, 2], [3, 4], [5]]
     * ```
     */
    chunk(size: number): Collection<Collection<T>>;
    /**
     * Take the first N items from the collection.
     *
     * @param count - Number of items to take
     * @returns New Collection with first N items
     */
    take(count: number): Collection<T>;
    /**
     * Skip the first N items and return the rest.
     *
     * @param count - Number of items to skip
     * @returns New Collection with remaining items
     */
    skip(count: number): Collection<T>;
    /**
     * Determine if the collection is empty.
     *
     * @returns True if collection has no items
     */
    isEmpty(): boolean;
    /**
     * Determine if the collection is not empty.
     *
     * @returns True if collection has items
     */
    isNotEmpty(): boolean;
    /**
     * Convert the collection to a plain array.
     *
     * @returns Array of items
     */
    toArray(): T[];
    /**
     * Convert the collection to a JSON string.
     *
     * @returns JSON string representation
     */
    toJSON(): string;
    /**
     * Reduce the collection to a single value.
     *
     * @template U - The type of the accumulated value
     * @param callback - Reducer function
     * @param initialValue - Initial value for accumulator
     * @returns Reduced value
     *
     * @example
     * ```typescript
     * const numbers = new Collection([1, 2, 3]);
     * const sum = numbers.reduce((acc, n) => acc + n, 0); // 6
     * ```
     */
    reduce<U>(callback: (accumulator: U, item: T, index: number) => U, initialValue: U): U;
    /**
     * Check if the collection contains an item.
     *
     * @param valueOrCallback - Value to find or predicate function
     * @returns True if item is found
     */
    contains(valueOrCallback: T | ((item: T) => boolean)): boolean;
    /**
     * Lazy eager load relations on all models in the collection.
     *
     * @param relations - Relation names to load
     * @returns This collection for chaining
     *
     * @example
     * ```typescript
     * const users = await User.all();
     * await users.load('posts', 'profile');
     * ```
     */
    load(...relations: readonly string[]): Promise<this>;
    /**
     * Execute a callback for each item in the collection.
     *
     * @param callback - Callback function
     * @returns This collection for chaining
     */
    each(callback: (item: T, index: number) => undefined | boolean): this;
}
