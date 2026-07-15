import type { Model } from "../model";
import type { QueryBuilder } from "../query-builder";
import { Relation } from "./relation";
/**
 * BelongsToMany relation for many-to-many relationships via pivot table.
 *
 * @template TRelated - The related model type
 * @template TParent - The parent model type
 *
 * @example
 * ```typescript
 * class User extends Model {
 *     roles() {
 *         return this.belongsToMany(
 *             Role,
 *             'user_roles',
 *             'user_id',
 *             'role_id',
 *             'id',
 *             'id'
 *         );
 *     }
 * }
 *
 * const roles = await user.roles().get();
 * ```
 */
export declare class BelongsToMany<TRelated extends Model = Model, TParent extends Model = Model> extends Relation<TRelated, TParent> {
    table: string;
    foreignPivotKey: string;
    relatedPivotKey: string;
    parentKey: string;
    relatedKey: string;
    /**
     * Create a new BelongsToMany instance.
     *
     * @param query - QueryBuilder instance
     * @param parent - Parent model instance
     * @param table - Pivot table name
     * @param foreignPivotKey - Foreign key for the parent model on the pivot table
     * @param relatedPivotKey - Foreign key for the related model on the pivot table
     * @param parentKey - Key on the parent model
     * @param relatedKey - Key on the related model
     */
    constructor(query: QueryBuilder<TRelated>, parent: TParent, table: string, foreignPivotKey: string, relatedPivotKey: string, parentKey: string, relatedKey: string);
    /**
     * Add the base constraints for the relation query.
     */
    addConstraints(): void;
    /**
     * Get the related table name.
     *
     * @returns Table name from the query
     */
    protected getRelatedTable(): string;
}
