import { Relation } from './Relation';
import { QueryBuilder } from '../QueryBuilder';
import { Model } from '../Model';

export class BelongsTo<TRelated extends Model = Model, TParent extends Model = Model> extends Relation<TRelated, TParent> {
    constructor(query: QueryBuilder, parent: TParent, public foreignKey: string, public ownerKey: string) {
        super(query, parent);
        this.addConstraints();
    }

    addConstraints(): void {
        const foreignKey = this.parent.getAttribute(this.foreignKey);
        if (foreignKey) {
            this.query.where(this.ownerKey, '=', foreignKey);
        }
    }
}
