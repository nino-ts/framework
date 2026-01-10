import { Relation } from './Relation';
import { QueryBuilder } from '../QueryBuilder';
import { Model } from '../Model';

/**
 * BelongsToMany relation for many-to-many relationships via pivot table.
 */
export class BelongsToMany<TRelated extends Model = Model, TParent extends Model = Model> extends Relation<TRelated, TParent> {
    constructor(
        query: QueryBuilder,
        parent: TParent,
        public table: string,
        public foreignPivotKey: string,
        public relatedPivotKey: string,
        public parentKey: string,
        public relatedKey: string
    ) {
        super(query, parent);
        this.addConstraints();
    }

    addConstraints(): void {
        const parentKeyValue = this.parent.getAttribute(this.parentKey);
        if (parentKeyValue) {
            // Join pivot table and filter
            this.query
                .join(this.table, `${this.getRelatedTable()}.${this.relatedKey}`, '=', `${this.table}.${this.relatedPivotKey}`)
                .where(`${this.table}.${this.foreignPivotKey}`, '=', parentKeyValue);
        }
    }

    protected getRelatedTable(): string {
        // Get table from the query's fromTable
        return this.query.fromTable;
    }
}
