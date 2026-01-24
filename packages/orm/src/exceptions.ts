/**
 * Exception thrown when a model is not found in the database.
 */
export class ModelNotFoundException extends Error {
    constructor(model: string, ids: any[] = []) {
        super(`No query results for model [${model}] ${ids.length > 0 ? 'with ids ' + JSON.stringify(ids) : ''}.`);
        this.name = 'ModelNotFoundException';
    }
}

/**
 * Exception thrown when a database query fails.
 */
export class QueryException extends Error {
    constructor(message: string, public sql: string, public bindings: any[]) {
        super(message);
        this.name = 'QueryException';
    }
}

/**
 * Exception thrown when a requested relation is not defined on the model.
 */
export class RelationNotFoundException extends Error {
    constructor(model: string, relation: string) {
        super(`Relation [${relation}] not found on model [${model}].`);
        this.name = 'RelationNotFoundException';
    }
}

/**
 * Exception thrown when trying to mass assign attributes that are not in the fillable array.
 */
export class MassAssignmentException extends Error {
    constructor(model: string, keys: string[]) {
        super(`Add [${keys.join(', ')}] to fillable property to allow mass assignment on [${model}].`);
        this.name = 'MassAssignmentException';
    }
}
