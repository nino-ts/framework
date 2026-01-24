import { Relation } from '@/relations/relation';
import { QueryBuilder } from '@/query-builder';
import { Model } from '@/model';

/**
 * BelongsTo relation for inverse one-to-one or many-to-one relationships.
 */
export class BelongsTo<TRelated extends Model = Model, TParent extends Model = Model> extends Relation<TRelated, TParent> {
    /**
     * Create a new BelongsTo instance.
     * @param query QueryBuilder instance
     * @param parent Parent model instance
     * @param foreignKey Foreign key on the parent model
     * @param ownerKey Primary key on the related model
     */
    constructor(query: QueryBuilder, parent: TParent, public foreignKey: string, public ownerKey: string) {
        super(query, parent);
        this.addConstraints();
    }

    /**
     * Add the base constraints for the relation query.
     */
    addConstraints(): void {
        const foreignKey = this.parent.getAttribute(this.foreignKey);
        if (foreignKey) {
            this.query.where(this.ownerKey, '=', foreignKey);
        }
    }
}
