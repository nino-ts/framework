/**
 * MorphMany - Polymorphic One-to-Many Relationship.
 *
 * Handles polymorphic one-to-many relationships where a model can have
 * multiple related models through a single association.
 *
 * @packageDocumentation
 */
import { Collection } from "../collection";
import { Model } from "../model";
import type { QueryBuilder } from "../query-builder";
import { Relation } from "./relation";
/**
 * MorphMany relationship for polymorphic one-to-many associations.
 *
 * @template TRelated - The related model type
 * @template TParent - The parent model type
 *
 * @example
 * ```typescript
 * class Video extends Model {
 *     comments() {
 *         return this.morphMany(Comment, 'commentable');
 *     }
 * }
 *
 * class Post extends Model {
 *     comments() {
 *         return this.morphMany(Comment, 'commentable');
 *     }
 * }
 *
 * class Comment extends Model {
 *     commentable() {
 *         return this.morphTo(Commentable, 'commentable_type', 'commentable_id');
 *     }
 * }
 * ```
 */
export declare class MorphMany<TRelated extends Model = Model, TParent extends Model = Model> extends Relation<TRelated, TParent> {
    /**
     * The foreign key type column name (e.g., 'commentable_type').
     */
    morphType: string;
    /**
     * The foreign key ID column name (e.g., 'commentable_id').
     */
    morphId: string;
    /**
     * The local key on the parent model.
     */
    localKey: string;
    /**
     * Create a new MorphMany instance.
     *
     * @param query - QueryBuilder instance
     * @param parent - Parent model instance
     * @param morphType - Morph type column name
     * @param morphId - Morph ID column name
     * @param localKey - Local key on parent model
     */
    constructor(query: QueryBuilder<TRelated>, parent: TParent, morphType: string, morphId: string, localKey: string);
    /**
     * Add the constraints for the relationship query.
     */
    addConstraints(): void;
    /**
     * Add the constraints for eager loading.
     *
     * @param models - Array of parent models
     * @returns QueryBuilder for eager loading
     */
    addEagerConstraints(models: Model[]): QueryBuilder<TRelated>;
    /**
     * Initialize the relation on an array of parent models.
     *
     * @param models - Parent models
     * @param relation - Relation name
     * @returns Array of parent models with relations set
     */
    initRelation(models: Model[], relation: string): Model[];
    /**
     * Match the eagerly loaded results to their parent models.
     *
     * @param models - Parent models
     * @param results - Related models from eager load
     * @param relation - Relation name
     * @returns Array of parent models with relations matched
     */
    match(models: Model[], results: Collection<TRelated>, relation: string): Model[];
    /**
     * Get the results of the relationship.
     *
     * @returns Promise resolving to a Collection of related models
     */
    getResults(): Promise<Collection<TRelated>>;
    /**
     * Create a new related model instance associated with this parent.
     *
     * @param attributes - Attributes for the new related model
     * @returns The created related model
     */
    create(attributes: Partial<Record<string, unknown>>): Promise<TRelated>;
    /**
     * Get the results of the relationship.
     *
     * @returns Promise resolving to a Collection of related models
     */
    get(): Promise<Collection<TRelated>>;
}
