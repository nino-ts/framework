export class ModelNotFoundException extends Error {
    constructor(model: string, ids: any[] = []) {
        super(`No query results for model [${model}] ${ids.length > 0 ? 'with ids ' + JSON.stringify(ids) : ''}.`);
        this.name = 'ModelNotFoundException';
    }
}

export class QueryException extends Error {
    constructor(message: string, public sql: string, public bindings: any[]) {
        super(message);
        this.name = 'QueryException';
    }
}

export class RelationNotFoundException extends Error {
    constructor(model: string, relation: string) {
        super(`Relation [${relation}] not found on model [${model}].`);
        this.name = 'RelationNotFoundException';
    }
}

export class MassAssignmentException extends Error {
    constructor(model: string, keys: string[]) {
        super(`Add [${keys.join(', ')}] to fillable property to allow mass assignment on [${model}].`);
        this.name = 'MassAssignmentException';
    }
}
