import type { Model } from "../model";
import type { QueryBuilder } from "../query-builder";
import { Relation } from "./relation";
/**
 * HasOne relation for one-to-one relationships.
 * Similar to HasMany but returns a single model instead of collection.
 *
 * @template TRelated - The related model type
 * @template TParent - The parent model type
 *
 * @example
 * ```typescript
 * class User extends Model {
 *     profile() {
 *         return this.hasOne(Profile, 'user_id', 'id');
 *     }
 * }
 *
 * const profile = await user.profile().first();
 * ```
 */
export declare class HasOne<TRelated extends Model = Model, TParent extends Model = Model> extends Relation<TRelated, TParent> {
    foreignKey: string;
    localKey: string;
    /**
     * Create a new HasOne instance.
     *
     * @param query - QueryBuilder instance
     * @param parent - Parent model instance
     * @param foreignKey - Foreign key on the related model
     * @param localKey - Local key on the parent model
     */
    constructor(query: QueryBuilder<TRelated>, parent: TParent, foreignKey: string, localKey: string);
    /**
     * Add the base constraints for the relation query.
     */
    addConstraints(): void;
}
