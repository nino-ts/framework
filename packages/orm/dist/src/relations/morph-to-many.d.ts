/**
 * MorphToMany - Polymorphic Many-to-Many Relationship.
 *
 * Handles polymorphic many-to-many relationships where a model can belong to
 * multiple models of different types through a pivot table.
 *
 * @packageDocumentation
 */
import { Collection } from "../collection";
import type { Model } from "../model";
import { QueryBuilder } from "../query-builder";
import { Relation } from "./relation";
import type { WhereClauseValue } from "../types";
/**
 * MorphToMany relationship for polymorphic many-to-many associations.
 *
 * @template TRelated - The related model type
 * @template TParent - The parent model type
 *
 * @example
 * ```typescript
 * class Post extends Model {
 *     tags() {
 *         return this.morphToMany(Tag, 'taggable', 'taggables');
 *     }
 * }
 *
 * class Video extends Model {
 *     tags() {
 *         return this.morphToMany(Tag, 'taggable', 'taggables');
 *     }
 * }
 *
 * class Tag extends Model {
 *     posts() {
 *         return this.morphedByMany(Post, 'taggable', 'taggables');
 *     }
 * }
 * ```
 */
export declare class MorphToMany<TRelated extends Model = Model, TParent extends Model = Model> extends Relation<TRelated, TParent> {
    /**
     * The pivot table name.
     */
    table: string;
    /**
     * The foreign key type column name on pivot (e.g., 'taggable_type').
     */
    morphType: string;
    /**
     * The foreign key ID column name on pivot (e.g., 'taggable_id').
     */
    morphId: string;
    /**
     * The related key on the pivot table.
     */
    relatedId: string;
    /**
     * The local key on the parent model.
     */
    parentKey: string;
    /**
     * The related key on the related model.
     */
    relatedKey: string;
    /**
     * Whether this is the inverse (morphedByMany) relation.
     */
    inverse: boolean;
    /**
     * Create a new MorphToMany instance.
     *
     * @param query - QueryBuilder instance
     * @param parent - Parent model instance
     * @param table - Pivot table name
     * @param morphType - Morph type column name
     * @param morphId - Morph ID column name
     * @param relatedId - Related ID column name on pivot
     * @param parentKey - Parent key
     * @param relatedKey - Related key
     * @param inverse - Whether this is inverse relation
     */
    constructor(query: QueryBuilder<TRelated>, parent: TParent, table: string, morphType: string, morphId: string, relatedId: string, parentKey: string, relatedKey: string, inverse?: boolean);
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
     * Attach a model to the relationship.
     *
     * @param id - Related model ID
     * @param attributes - Additional pivot attributes
     * @returns Promise of execution result
     */
    attach(id: WhereClauseValue, attributes?: Record<string, unknown>): Promise<void>;
    /**
     * Detach a model from the relationship.
     *
     * @param id - Related model ID (optional, detaches all if not provided)
     * @returns Number of detached records
     */
    detach(id?: WhereClauseValue): Promise<number>;
    /**
     * Sync the relationship with the given IDs.
     *
     * @param ids - Array or object of IDs to sync
     * @param detaching - Whether to detach missing IDs
     * @returns Object with attached, detached, and updated IDs
     */
    sync(ids: WhereClauseValue[] | Record<string, unknown>, detaching?: boolean): Promise<{
        attached: WhereClauseValue[];
        detached: WhereClauseValue[];
        updated: WhereClauseValue[];
    }>;
    /**
     * Get the results of the relationship.
     *
     * @returns Promise resolving to a Collection of related models
     */
    get(): Promise<Collection<TRelated>>;
}
