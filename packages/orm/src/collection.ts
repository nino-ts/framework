/**
 * Fluent wrapper for working with arrays of data.
 * Provides methods for filtering, mapping, and transforming data.
 */
export class Collection<T = any> implements Iterable<T> {
    protected items: T[];

    /**
     * Create a new Collection instance.
     * @param items Initial array of items
     */
    constructor(items: T[] = []) {
        this.items = items;
    }

    /**
     * Get the iterator for the collection items.
     */
    [Symbol.iterator](): Iterator<T> {
        return this.items[Symbol.iterator]();
    }

    /**
     * Get all items in the collection.
     */
    all(): T[] {
        return this.items;
    }

    /**
     * Get the number of items in the collection.
     */
    count(): number {
        return this.items.length;
    }

    /**
     * Get the first item in the collection, or null if empty.
     */
    first(): T | null {
        return this.count() > 0 ? (this.items[0] ?? null) : null;
    }

    /**
     * Get the last item in the collection, or null if empty.
     */
    last(): T | null {
        return this.count() > 0 ? (this.items[this.count() - 1] ?? null) : null;
    }

    /**
     * Map over the collection and return a new Collection.
     * @param callback Mapping function
     */
    map<U>(callback: (item: T, index: number) => U): Collection<U> {
        return new Collection<U>(this.items.map(callback));
    }

    /**
     * Filter the collection and return a new Collection.
     * @param callback Filter predicate
     */
    filter(callback: (item: T, index: number) => boolean): Collection<T> {
        return new Collection<T>(this.items.filter(callback));
    }

    /**
     * Pluck a specific key from all items in the collection.
     * @param key Key to pluck
     */
    pluck<K extends keyof T>(key: K | string): Collection<T[K]> {
        return this.map(item => (item as any)[key]);
    }

    /**
     * Push items onto the end of the collection.
     * @param items Items to push
     */
    push(...items: T[]): this {
        this.items.push(...items);
        return this;
    }

    /**
     * Remove and return the last item from the collection.
     */
    pop(): T | undefined {
        return this.items.pop();
    }

    /**
     * Calculate both the sum of a given key (if objects) or the items themselves (if numbers).
     * @param key Optional key to sum by
     */
    sum(key?: keyof T | string): number {
        return this.items.reduce((sum, item) => {
            const val = key ? (item as any)[key] : item;
            return sum + (Number(val) || 0);
        }, 0);
    }

    /**
     * Calculate the average of a given key or the items themselves.
     * @param key Optional key to average by
     */
    avg(key?: keyof T | string): number {
        if (this.isEmpty()) return 0;
        return this.sum(key) / this.count();
    }

    /**
     * Get the minimum value.
     * @param key Optional key to inspect
     */
    min(key?: keyof T | string): number {
        if (this.isEmpty()) return 0;
        const values = this.items.map(item => key ? (item as any)[key] : item);
        return Math.min(...values as number[]);
    }

    /**
     * Get the maximum value.
     * @param key Optional key to inspect
     */
    max(key?: keyof T | string): number {
        if (this.isEmpty()) return 0;
        const values = this.items.map(item => key ? (item as any)[key] : item);
        return Math.max(...values as number[]);
    }

    /**
     * Return unique items in the collection.
     * @param key Optional key to ensure uniqueness by
     */
    unique(key?: keyof T | string): Collection<T> {
        if (!key) {
            return new Collection<T>([...new Set(this.items)]);
        }

        const seen = new Set();
        return this.filter(item => {
            const val = (item as any)[key];
            if (seen.has(val)) return false;
            seen.add(val);
            return true;
        });
    }

    /**
     * Determine if the collection is empty.
     */
    isEmpty(): boolean {
        return this.count() === 0;
    }

    /**
     * Determine if the collection is not empty.
     */
    isNotEmpty(): boolean {
        return !this.isEmpty();
    }

    /**
     * Convert the collection to a plain array.
     */
    toArray(): T[] {
        return this.all();
    }

    /**
     * Convert the collection to a JSON string.
     */
    toJSON(): string {
        return JSON.stringify(this.items);
    }

    /**
     * Lazy eager load relations on a collection of models.
     * @param relations List of relation names to load
     */
    async load(...relations: string[]): Promise<this> {
        if (this.isEmpty()) return this;

        for (const relationName of relations) {
            const firstModel = this.items[0] as any;
            if (typeof firstModel[relationName] !== 'function') continue;

            const relation = firstModel[relationName]();
            const relationType = relation.constructor.name;

            if (relationType === 'HasMany') {
                const parentIds = this.items.map((m: any) => m.id).filter(Boolean);
                if (parentIds.length === 0) continue;

                const relatedModels = await relation.getQuery()
                    .whereIn(relation.foreignKey, parentIds)
                    .get();

                for (const model of this.items as any[]) {
                    const related = relatedModels.filter((r: any) =>
                        r[relation.foreignKey] === model.id
                    );
                    model.setRelation(relationName, new Collection(related.all()));
                }
            } else if (relationType === 'BelongsTo') {
                const foreignKeyValues = this.items.map((m: any) => m[relation.foreignKey]).filter(Boolean);
                if (foreignKeyValues.length === 0) continue;

                const parentModels = await relation.getQuery()
                    .whereIn(relation.ownerKey, foreignKeyValues)
                    .get();

                for (const model of this.items as any[]) {
                    const parent = parentModels.filter((p: any) =>
                        p[relation.ownerKey] === model[relation.foreignKey]
                    ).first();
                    model.setRelation(relationName, parent || null);
                }
            }
        }

        return this;
    }
}
