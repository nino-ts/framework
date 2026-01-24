import { Relation } from '@/relations/relation';
import { QueryBuilder } from '@/query-builder';
import { Model } from '@/model';

/**
 * BelongsToMany relation for many-to-many relationships via pivot table.
 */
export class BelongsToMany<TRelated extends Model = Model, TParent extends Model = Model> extends Relation<TRelated, TParent> {
    /**
     * Create a new BelongsToMany instance.
     * @param query QueryBuilder instance
     * @param parent Parent model instance
     * @param table Pivot table name
     * @param foreignPivotKey Foreign key for the parent model on the pivot table
     * @param relatedPivotKey Foreign key for the related model on the pivot table
     * @param parentKey Key on the parent model
     * @param relatedKey Key on the related model
     */
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

    /**
     * Add the base constraints for the relation query.
     */
    addConstraints(): void {
        const parentKeyValue = this.parent.getAttribute(this.parentKey);
        if (parentKeyValue) {
            // Join pivot table and filter
            this.query
                .join(this.table, `${this.getRelatedTable()}.${this.relatedKey}`, '=', `${this.table}.${this.relatedPivotKey}`)
                .where(`${this.table}.${this.foreignPivotKey}`, '=', parentKeyValue);
        }
    }

    /**
     * Get the related table name.
     */
    protected getRelatedTable(): string {
        // Get table from the query's fromTable
        return this.query.fromTable;
    }
}
