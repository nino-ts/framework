export class Collection<T = any> implements Iterable<T> {
    protected items: T[];

    constructor(items: T[] = []) {
        this.items = items;
    }

    [Symbol.iterator](): Iterator<T> {
        return this.items[Symbol.iterator]();
    }

    all(): T[] {
        return this.items;
    }

    count(): number {
        return this.items.length;
    }

    first(): T | null {
        return this.count() > 0 ? (this.items[0] ?? null) : null;
    }

    last(): T | null {
        return this.count() > 0 ? (this.items[this.count() - 1] ?? null) : null;
    }

    map<U>(callback: (item: T, index: number) => U): Collection<U> {
        return new Collection<U>(this.items.map(callback));
    }

    filter(callback: (item: T, index: number) => boolean): Collection<T> {
        return new Collection<T>(this.items.filter(callback));
    }

    pluck<K extends keyof T>(key: K | string): Collection<T[K]> {
        return this.map(item => (item as any)[key]);
    }

    push(...items: T[]): this {
        this.items.push(...items);
        return this;
    }

    pop(): T | undefined {
        return this.items.pop();
    }

    sum(key?: keyof T | string): number {
        return this.items.reduce((sum, item) => {
            const val = key ? (item as any)[key] : item;
            return sum + (Number(val) || 0);
        }, 0);
    }

    avg(key?: keyof T | string): number {
        if (this.isEmpty()) return 0;
        return this.sum(key) / this.count();
    }

    min(key?: keyof T | string): number {
        if (this.isEmpty()) return 0;
        const values = this.items.map(item => key ? (item as any)[key] : item);
        return Math.min(...values as number[]);
    }

    max(key?: keyof T | string): number {
        if (this.isEmpty()) return 0;
        const values = this.items.map(item => key ? (item as any)[key] : item);
        return Math.max(...values as number[]);
    }

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

    isEmpty(): boolean {
        return this.count() === 0;
    }

    isNotEmpty(): boolean {
        return !this.isEmpty();
    }

    // Métodos úteis adicionais

    toArray(): T[] {
        return this.all();
    }

    toJSON(): string {
        return JSON.stringify(this.items);
    }

    /**
     * Lazy eager load relations on a collection of models.
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
