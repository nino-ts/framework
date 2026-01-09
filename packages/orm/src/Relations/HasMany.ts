import { Relation } from './Relation';
import { QueryBuilder } from '../QueryBuilder';
import { Model } from '../Model';

export class HasMany<TRelated extends Model = Model, TParent extends Model = Model> extends Relation<TRelated, TParent> {
    constructor(query: QueryBuilder, parent: TParent, protected foreignKey: string, protected localKey: string) {
        super(query, parent);
        this.addConstraints();
    }

    addConstraints(): void {
        if (this.parent.getAttribute(this.localKey)) {
            this.query.where(this.foreignKey, '=', this.parent.getAttribute(this.localKey));
        }
    }
}
