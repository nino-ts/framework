import { Relation } from '@/relations/relation';
import { QueryBuilder } from '@/query-builder';
import { Model } from '@/model';

/**
 * HasOne relation for one-to-one relationships.
 * Similar to HasMany but returns a single model instead of collection.
 */
export class HasOne<TRelated extends Model = Model, TParent extends Model = Model> extends Relation<TRelated, TParent> {
    /**
     * Create a new HasOne instance.
     * @param query QueryBuilder instance
     * @param parent Parent model instance
     * @param foreignKey Foreign key on the related model
     * @param localKey Local key on the parent model
     */
    constructor(query: QueryBuilder, parent: TParent, public foreignKey: string, public localKey: string) {
        super(query, parent);
        this.addConstraints();
    }

    /**
     * Add the base constraints for the relation query.
     */
    addConstraints(): void {
        const localKeyValue = this.parent.getAttribute(this.localKey);
        if (localKeyValue) {
            this.query.where(this.foreignKey, '=', localKeyValue);
        }
    }
}
