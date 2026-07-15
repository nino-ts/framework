/**
 * MorphTo - Polymorphic BelongsTo Relationship.
 *
 * Handles the inverse side of polymorphic relationships where a model
 * can belong to different types of models.
 *
 * @packageDocumentation
 */
import type { Model } from "../model";
import type { QueryBuilder } from "../query-builder";
import { Relation } from "./relation";
import type { ModelConstructor, PrimaryKey } from "../types";
/**
 * Type mapping for morph types to model classes.
 */
export type MorphTypeMap = Record<string, ModelConstructor<Model>>;
/**
 * MorphTo relationship for polymorphic belongsTo associations.
 *
 * @template TParent - The parent model type
 *
 * @example
 * ```typescript
 * class Comment extends Model {
 *     commentable() {
 *         return this.morphTo(Commentable, 'commentable_type', 'commentable_id');
 *     }
 * }
 *
 * const comment = await Comment.find(1);
 * const commentable = await comment.commentable().get(); // Returns User or Post
 * ```
 */
export declare class MorphTo<TParent extends Model = Model> extends Relation<Model, TParent> {
    /**
     * The foreign key type column name (e.g., 'commentable_type').
     */
    morphType: string;
    /**
     * The foreign key ID column name (e.g., 'commentable_id').
     */
    morphId: string;
    /**
     * The owner key on the related model.
     */
    ownerKey: string;
    /**
     * Map of morph types to model classes.
     */
    protected morphMap: MorphTypeMap;
    /**
     * Create a new MorphTo instance.
     *
     * @param query - QueryBuilder instance
     * @param parent - Parent model instance
     * @param morphType - Morph type column name
     * @param morphId - Morph ID column name
     * @param ownerKey - Owner key on related model
     * @param morphMap - Optional map of morph types to model classes
     */
    constructor(query: QueryBuilder<Model>, parent: TParent, morphType: string, morphId: string, ownerKey: string, morphMap?: MorphTypeMap);
    /**
     * Add the constraints for the relationship query.
     */
    addConstraints(): void;
    /**
     * Get the model class for a given morph type.
     *
     * @param type - Morph type value
     * @returns Model constructor or null
     */
    getModelForType(type: string): ModelConstructor<Model> | null;
    /**
     * Get the results of the relationship.
     *
     * @returns Promise resolving to the related model or null
     */
    getResults(): Promise<Model | null>;
    /**
     * Associate the parent with a related model.
     *
     * @param model - Related model instance or null
     * @returns This relation for chaining
     */
    associate(model: Model | null): this;
    /**
     * Dissociate the parent from any related model.
     *
     * @returns This relation for chaining
     */
    dissociate(): this;
    /**
     * Get the foreign key value for the relationship.
     *
     * @returns Foreign key value
     */
    getForeignKeyValue(): PrimaryKey | null;
    /**
     * Get the morph type value for the relationship.
     *
     * @returns Morph type value
     */
    getMorphTypeValue(): string | null;
}
