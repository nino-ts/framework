import { Relation } from './Relation';
import { QueryBuilder } from '../QueryBuilder';
import { Model } from '../Model';

/**
 * HasOne relation for one-to-one relationships.
 * Similar to HasMany but returns a single model instead of collection.
 */
export class HasOne<TRelated extends Model = Model, TParent extends Model = Model> extends Relation<TRelated, TParent> {
    constructor(query: QueryBuilder, parent: TParent, public foreignKey: string, public localKey: string) {
        super(query, parent);
        this.addConstraints();
    }

    addConstraints(): void {
        const localKeyValue = this.parent.getAttribute(this.localKey);
        if (localKeyValue) {
            this.query.where(this.foreignKey, '=', localKeyValue);
        }
    }
}
