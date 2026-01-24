import { QueryBuilder } from '@/query-builder';
import { Model } from '@/model';
import { Collection } from '@/collection';

/**
 * Base abstract class for all database relationships.
 */
export abstract class Relation<TRelated extends Model = Model, TParent extends Model = Model> {
    protected query: QueryBuilder;
    protected parent: TParent;
    protected related: TRelated;

    /**
     * Create a new Relation instance.
     * @param query QueryBuilder instance for the related model
     * @param parent Parent model instance
     */
    constructor(query: QueryBuilder, parent: TParent) {
        this.query = query;
        this.parent = parent;
        this.related = (query as any)._model; // Assuming query has reference or we pass related model class
    }

    /**
     * Add the constraints for the relationship query.
     */
    abstract addConstraints(): void;

    /**
     * Get the query builder for the relationship.
     */
    getQuery(): QueryBuilder {
        return this.query;
    }

    /**
     * Get a fresh query builder for eager loading (without parent constraints).
     */
    getBaseQuery(): QueryBuilder {
        const qb = new QueryBuilder(this.query.connection);
        qb.from(this.query.fromTable);
        if (this.query['modelClass']) {
            qb.setModel(this.query['modelClass']);
        }
        return qb;
    }

    /**
     * Execute the query and get the results as a Collection.
     */
    async get(): Promise<Collection<TRelated>> {
        return this.query.get<TRelated>();
    }

    /**
     * Execute the query and get the first result.
     */
    async first(): Promise<TRelated | null> {
        return this.query.first<TRelated>();
    }
}
