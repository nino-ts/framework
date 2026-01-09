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

    async get(): Promise<Collection<TRelated>> {
        return this.query.get<TRelated>();
    }

    async first(): Promise<TRelated | null> {
        return this.query.first<TRelated>();
    }
}
