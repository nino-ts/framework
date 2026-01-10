import { QueryBuilder } from '@/query-builder';
import { Collection } from '@/collection';
import { DatabaseManager } from '@/database-manager';
import { Connection } from '@/connection';
import { HasOne } from '@/relations/has-one';
import { HasMany } from '@/relations/has-many';
import { BelongsTo } from '@/relations/belongs-to';
import { BelongsToMany } from '@/relations/belongs-to-many';

/**
 * The Model class represents a database table/record and provides an Active Record implementation.
 * It serves as the base class for all application models.
 */
export class Model {
    protected static resolver: DatabaseManager;
    protected static table: string;
    protected static primaryKey: string = 'id';
    protected static fillable: string[] = [];
    protected static guarded: string[] = ['*'];

    protected attributes: Record<string, any> = {};
    protected original: Record<string, any> = {};
    protected exists: boolean = false;
    protected relations: Record<string, any> = {}; // Stores loaded relations
    protected _modelClass: typeof Model; // Store reference to actual class

    /**
     * Create a new Model instance.
     * @param attributes Initial attributes
     */
    constructor(attributes: Record<string, any> = {}) {
        // Store class reference BEFORE creating proxy
        this._modelClass = this.constructor as typeof Model;
        this.fill(attributes);

        // Proxy para acesso direto aos atributos
        return new Proxy(this, {
            get(target, prop, receiver) {
                // Allow access to instance methods and properties via Reflect first
                if (Reflect.has(target, prop)) {
                    const value = Reflect.get(target, prop, receiver);
                    // If it's a relation method AND the relation is loaded, return loaded data
                    if (typeof value === 'function' && typeof prop === 'string' && prop in target.relations) {
                        return target.relations[prop];
                    }
                    return value;
                }

                // Check for accessor: get{Attribute}Attribute
                if (typeof prop === 'string') {
                    const accessorName = `get${target.studly(prop)}Attribute`;
                    if (typeof (target as any)[accessorName] === 'function') {
                        return (target as any)[accessorName]();
                    }
                }

                // Column Mapping Support
                const mapping = (target.constructor as any).__columnMapping;
                if (mapping && typeof prop === 'string' && mapping[prop]) {
                    return target.attributes[mapping[prop]];
                }

                if (typeof prop === 'string' && prop in target.attributes) {
                    return target.attributes[prop];
                }

                return undefined;
            },
            set(target, prop, value, receiver) {
                if (Reflect.has(target, prop)) {
                    return Reflect.set(target, prop, value, receiver);
                }

                // Check for mutator: set{Attribute}Attribute
                if (typeof prop === 'string') {
                    const mutatorName = `set${target.studly(prop)}Attribute`;
                    if (typeof (target as any)[mutatorName] === 'function') {
                        (target as any)[mutatorName](value);
                        return true;
                    }
                }

                // Column Mapping Support
                const mapping = (target.constructor as any).__columnMapping;
                if (mapping && typeof prop === 'string' && mapping[prop]) {
                    target.setAttribute(mapping[prop], value);
                    return true;
                }

                if (typeof prop === 'string') {
                    target.setAttribute(prop, value);
                    return true;
                }
                return false;
            }
        });
    }

    /**
     * Convert snake_case to StudlyCase for accessor/mutator method names
     */
    protected studly(value: string): string {
        return value
            .split('_')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
            .join('');
    }

    /**
     * Fill the model with an array of attributes.
     * @param attributes Key-value pairs of attributes
     */
    fill(attributes: Record<string, any>): this {
        // Implementar lógica de fillable/guarded aqui
        // Por simplificação:
        for (const key in attributes) {
            this.setAttribute(key, attributes[key]);
        }
        return this;
    }

    /**
     * Set a given attribute on the model.
     * @param key Attribute name
     * @param value Attribute value
     */
    setAttribute(key: string, value: any): void {
        this.attributes[key] = value;
    }

    /**
     * Get an attribute from the model.
     * @param key Attribute name
     */
    getAttribute(key: string): any {
        return this.attributes[key];
    }

    /**
     * Set the connection resolver instance.
     * @param resolver DatabaseManager instance
     */
    static setConnectionResolver(resolver: DatabaseManager) {
        this.resolver = resolver;
    }

    /**
     * Get the connection resolver instance.
     */
    static getConnectionResolver(): DatabaseManager {
        return this.resolver;
    }

    /**
     * Get the database connection for the model.
     */
    getConnection(): Connection {
        return Model.resolver.connection();
    }

    /**
     * Resolve a connection instance.
     * @param name Connection name
     */
    static resolveConnection(name?: string): Connection {
        return Model.resolver.connection(name);
    }

    /**
     * Get the table associated with the model.
     */
    static getTable(): string {
        if (this.table) {
            return this.table;
        }
        // Simple pluralizer fallback if no helper
        // snake_case class name + s
        const name = this.name.replace(/([a-z])([A-Z])/g, '$1_$2').toLowerCase();
        return name + 's';
    }

    /**
     * Get the table associated with the model instance.
     */
    getTable(): string {
        return this._modelClass.getTable();
    }

    /**
     * Begin querying the model.
     */
    static query(): QueryBuilder {
        return (new this()).newQuery();
    }

    /**
     * Get a new query builder for the model's table.
     */
    newQuery(): QueryBuilder {
        const builder = new QueryBuilder(this.getConnection());
        builder.from(this.getTable());
        builder.setModel(this._modelClass);
        return builder;
    }

    /**
     * Begin querying the model with eager loading.
     * @param relations Relations to eager load
     */
    static with(...relations: string[]): QueryBuilder {
        const builder = this.query();
        builder.with(...relations);
        return builder;
    }

    /**
     * Get all of the models from the database.
     */
    static async all(): Promise<Collection<Model>> {
        return this.query().get();
    }

    /**
     * Set the specific relationship in the model.
     * @param name Relation name
     * @param value Relation value (Model or Collection)
     */
    setRelation(name: string, value: any): this {
        this.relations[name] = value;
        return this;
    }

    /**
     * Get the specified relationship.
     * @param name Relation name
     */
    getRelation(name: string): any {
        return this.relations[name];
    }

    /**
     * Save the model to the database.
     * @returns True if saved successfully
     */
    async save(): Promise<boolean> {
        const query = this.newQuery();

        if (this.exists) {
            // Update - need to use base query without scopes for update
            const pk = this._modelClass.primaryKey;
            const id = this.getAttribute(pk);
            if (id) {
                await query.where(pk, '=', id).update(this.attributes);
            }
            return true;
        } else {
            // Insert
            const result = await query.insert(this.attributes);
            this.exists = true;
            if (result && result.lastInsertId) {
                this.setAttribute(this._modelClass.primaryKey, result.lastInsertId);
            }
            return true;
        }
    }

    /**
     * Define a one-to-one relationship.
     * @param related Related model class
     * @param foreignKey Foreign key on related model
     * @param localKey Local key on this model
     */
    hasOne<TRelated extends Model>(related: new () => TRelated, foreignKey?: string, localKey?: string): HasOne<TRelated, this> {
        const instance = new related();

        foreignKey = foreignKey || this.getForeignKey();
        localKey = localKey || this._modelClass.primaryKey;

        return new HasOne(instance.newQuery(), this, foreignKey, localKey);
    }

    /**
     * Define a one-to-many relationship.
     * @param related Related model class
     * @param foreignKey Foreign key on related model
     * @param localKey Local key on this model
     */
    hasMany<TRelated extends Model>(related: new () => TRelated, foreignKey?: string, localKey?: string): HasMany<TRelated, this> {
        const instance = new related();

        foreignKey = foreignKey || this.getForeignKey();
        localKey = localKey || this._modelClass.primaryKey;

        return new HasMany(instance.newQuery(), this, foreignKey, localKey);
    }

    /**
     * Define an inverse one-to-one or many-to-one relationship.
     * @param related Related model class
     * @param foreignKey Foreign key on this model
     * @param ownerKey Owner key on related model
     */
    belongsTo<TRelated extends Model>(related: new () => TRelated, foreignKey?: string, ownerKey?: string): BelongsTo<TRelated, this> {
        const instance = new related();

        // Foreign key is typically on this model pointing to parent
        // Default foreign key name logic: str_singular(related_table) + _id? No, usually related method name but simpler: 
        // snake_case(related class name) + _id
        if (!foreignKey) {
            foreignKey = (instance.constructor as typeof Model).name.replace(/([a-z])([A-Z])/g, '$1_$2').toLowerCase() + '_id';
        }
        ownerKey = ownerKey || (instance.constructor as typeof Model).primaryKey;

        return new BelongsTo(instance.newQuery(), this, foreignKey, ownerKey);
    }

    /**
     * Define a many-to-many relationship.
     * @param related Related model class
     * @param table Pivot table name
     * @param foreignPivotKey Foreign key for this model on pivot
     * @param relatedPivotKey Foreign key for related model on pivot
     * @param parentKey Key on this model
     * @param relatedKey Key on related model
     */
    belongsToMany<TRelated extends Model>(
        related: new () => TRelated,
        table?: string,
        foreignPivotKey?: string,
        relatedPivotKey?: string,
        parentKey?: string,
        relatedKey?: string
    ): BelongsToMany<TRelated, this> {
        const instance = new related();

        // Default pivot table name: alphabetical order of table names joined by underscore
        const relatedTable = instance.getTable();
        const parentTable = this.getTable();
        if (!table) {
            const tables = [parentTable, relatedTable].sort();
            // Simple singular: remove trailing 's' (basic)
            table = tables.map(t => t.replace(/s$/, '')).join('_') + 's';
        }

        foreignPivotKey = foreignPivotKey || this.getForeignKey();
        relatedPivotKey = relatedPivotKey || (instance.constructor as typeof Model).name.replace(/([a-z])([A-Z])/g, '$1_$2').toLowerCase() + '_id';
        parentKey = parentKey || (this.constructor as typeof Model).primaryKey;
        relatedKey = relatedKey || (instance.constructor as typeof Model).primaryKey;

        return new BelongsToMany(instance.newQuery(), this, table, foreignPivotKey, relatedPivotKey, parentKey, relatedKey);
    }

    /**
     * Get the default foreign key name for the model.
     */
    getForeignKey(): string {
        return (this.constructor as typeof Model).name.replace(/([a-z])([A-Z])/g, '$1_$2').toLowerCase() + '_id';
    }

    // Typings for dynamic access
    [key: string]: any;
}
