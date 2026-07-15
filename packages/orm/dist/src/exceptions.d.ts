import type { PrimaryKey, WhereClauseValue } from "./types";
/**
 * Exception thrown when a model is not found in the database.
 *
 * @example
 * ```typescript
 * const user = await User.findOrFail(999);
 * // Throws: ModelNotFoundException: No query results for model [User] with ids [999].
 * ```
 */
export declare class ModelNotFoundException extends Error {
    /**
     * Create a new ModelNotFoundException instance.
     *
     * @param model - Model class name
     * @param ids - Primary key values that were not found
     */
    constructor(model: string, ids?: readonly PrimaryKey[]);
}
/**
 * Exception thrown when a database query fails.
 *
 * @example
 * ```typescript
 * try {
 *     await query.get();
 * } catch (error) {
 *     if (error instanceof QueryException) {
 *         console.error('SQL:', error.sql);
 *         console.error('Bindings:', error.bindings);
 *     }
 * }
 * ```
 */
export declare class QueryException extends Error {
    sql: string;
    bindings: readonly WhereClauseValue[];
    /**
     * Create a new QueryException instance.
     *
     * @param message - Error message
     * @param sql - SQL query that failed
     * @param bindings - Query bindings/parameters
     */
    constructor(message: string, sql: string, bindings: readonly WhereClauseValue[]);
}
/**
 * Exception thrown when a requested relation is not defined on the model.
 *
 * @example
 * ```typescript
 * const user = await User.find(1);
 * await user.loadRelation('nonExistentRelation');
 * // Throws: RelationNotFoundException: Relation [nonExistentRelation] not found on model [User].
 * ```
 */
export declare class RelationNotFoundException extends Error {
    /**
     * Create a new RelationNotFoundException instance.
     *
     * @param model - Model class name
     * @param relation - Relation name that was not found
     */
    constructor(model: string, relation: string);
}
/**
 * Exception thrown when trying to mass assign attributes that are not in the fillable array.
 *
 * @example
 * ```typescript
 * class User extends Model {
 *     protected static fillable = ['name', 'email'];
 * }
 *
 * const user = new User({ name: 'John', password: 'secret' });
 * // Throws: MassAssignmentException: Add [password] to fillable property to allow mass assignment on [User].
 * ```
 */
export declare class MassAssignmentException extends Error {
    /**
     * Create a new MassAssignmentException instance.
     *
     * @param model - Model class name
     * @param keys - Attribute keys that are not fillable
     */
    constructor(model: string, keys: readonly string[]);
}
