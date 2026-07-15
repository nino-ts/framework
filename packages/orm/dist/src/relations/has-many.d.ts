import type { Model } from "../model";
import type { QueryBuilder } from "../query-builder";
import { Relation } from "./relation";
/**
 * HasMany relation for one-to-many relationships.
 *
 * @template TRelated - The related model type
 * @template TParent - The parent model type
 *
 * @example
 * ```typescript
 * class User extends Model {
 *     posts() {
 *         return this.hasMany(Post, 'user_id', 'id');
 *     }
 * }
 *
 * const posts = await user.posts().get();
 * ```
 */
export declare class HasMany<TRelated extends Model = Model, TParent extends Model = Model> extends Relation<TRelated, TParent> {
    foreignKey: string;
    localKey: string;
    /**
     * Create a new HasMany instance.
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
