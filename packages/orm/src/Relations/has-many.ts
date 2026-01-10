import { Relation } from '@/relations/relation';
import { QueryBuilder } from '@/query-builder';
import { Model } from '@/model';

/**
 * HasMany relation for one-to-many relationships.
 */
export class HasMany<TRelated extends Model = Model, TParent extends Model = Model> extends Relation<TRelated, TParent> {
    /**
     * Create a new HasMany instance.
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
        if (this.parent.getAttribute(this.localKey)) {
            this.query.where(this.foreignKey, '=', this.parent.getAttribute(this.localKey));
        }
    }
}
