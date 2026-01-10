import { QueryBuilder } from '../QueryBuilder';
import { Model } from '../Model';
import { Collection } from '../Collection';

export abstract class Relation<TRelated extends Model = Model, TParent extends Model = Model> {
    protected query: QueryBuilder;
    protected parent: TParent;
    protected related: TRelated;

    constructor(query: QueryBuilder, parent: TParent) {
        this.query = query;
        this.parent = parent;
        this.related = (query as any)._model; // Assuming query has reference or we pass related model class
    }

    abstract addConstraints(): void;

    getQuery(): QueryBuilder {
        return this.query;
    }

    /**
     * Get a fresh query builder for eager loading (without parent constraints)
     */
    getBaseQuery(): QueryBuilder {
        const qb = new QueryBuilder(this.query.connection);
        qb.from(this.query.fromTable);
        if (this.query['modelClass']) {
            qb.setModel(this.query['modelClass']);
        }
        return qb;
    }

    async get(): Promise<Collection<TRelated>> {
        return this.query.get<TRelated>();
    }

    async first(): Promise<TRelated | null> {
        return this.query.first<TRelated>();
    }
}
