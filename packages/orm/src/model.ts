import type { Collection } from '@/collection';
import type { Connection } from '@/connection';
import type { DatabaseManager } from '@/database-manager';
import { QueryBuilder } from '@/query-builder';
import { BelongsTo } from '@/relations/belongs-to';
import { BelongsToMany } from '@/relations/belongs-to-many';
import { HasMany } from '@/relations/has-many';
import { HasOne } from '@/relations/has-one';
import type { ModelConstructor, ModelInstance, MutationValues, PrimaryKey, WhereClauseValue } from '@/types';

/**
 * Type for column mapping metadata.
 * Maps property names to database column names.
 */
export type ColumnMapping = Record<string, string>;

/**
 * Type for model constructor with metadata.
 */
export interface ModelConstructorWithMetadata<T extends object = object> extends ModelConstructor<T> {
    /**
     * Column mapping for decorated properties.
     */
    __columnMapping?: ColumnMapping;

    /**
     * Primary key column name.
     */
    primaryKey: string;

    /**
     * Primary key type.
     */
    keyType: 'int' | 'string';

    /**
     * Whether the primary key is auto-incrementing.
     */
    incrementing: boolean;

    /**
     * Get the table name associated with the model.
     */
    getTable(): string;
}

/**
 * Type for relation values.
 */
export type RelationValue = Model | Collection<Model> | null | undefined;

/**
 * The Model class represents a database table/record and provides an Active Record implementation.
 * It serves as the base class for all application models.
 *
 * @template TAttributes - The shape of model attributes
 *
 * @example
 * ```typescript
 * interface UserAttributes {
 *     id: number;
 *     name: string;
 *     email: string;
 * }
 *
 * class User extends Model<UserAttributes> {
 *     protected static table = 'users';
 * }
 *
 * const user = new User({ name: 'John', email: 'john@example.com' });
 * await user.save();
 * ```
 */
export class Model<TAttributes extends object = Record<string, unknown>> implements ModelInstance {
    /**
     * Index signature to satisfy ModelInstance interface.
     * Allows dynamic property access via Proxy.
     */
    [key: string]: unknown;

    protected static resolver: DatabaseManager;
    protected static table: string;
    protected static primaryKey: string = 'id';
    protected static keyType: 'int' | 'string' = 'int';
    protected static incrementing: boolean = true;
    protected static fillable: string[] = [];
    protected static guarded: string[] = ['*'];

    protected attributes: Partial<TAttributes> = {};
    protected original: Partial<TAttributes> = {};
    public exists: boolean = false;
    protected relations: Map<string, RelationValue> = new Map();
    protected _modelClass: ModelConstructorWithMetadata<TAttributes>;

    /**
     * Create a new Model instance.
     *
     * @param attributes - Initial attributes
     *
     * @example
     * ```typescript
     * const user = new User({ name: 'John', email: 'john@example.com' });
     * ```
     */
    constructor(attributes: Partial<TAttributes> = {}) {
        // Store class reference BEFORE creating proxy
        this._modelClass = this.constructor as ModelConstructorWithMetadata<TAttributes>;
        this.fill(attributes);

        // Proxy para acesso direto aos atributos
        return new Proxy(this, {
            get(target, prop, receiver): unknown {
                // Allow access to instance methods and properties via Reflect first
                if (Reflect.has(target, prop)) {
                    const value = Reflect.get(target, prop, receiver);
                    // If it's a relation method AND the relation is loaded, return loaded data
                    if (typeof value === 'function' && typeof prop === 'string') {
                        const loadedRelation = target.relations.get(prop);
                        if (loadedRelation !== undefined) {
                            return loadedRelation;
                        }
                    }
                    return value;
                }

                // Check for accessor: get{Attribute}Attribute
                if (typeof prop === 'string') {
                    const accessorName = `get${target.studly(prop)}Attribute`;
                    const accessor = (target as Record<string, unknown>)[accessorName];
                    if (typeof accessor === 'function') {
                        return (accessor as () => unknown).call(target);
                    }
                }

                // Column Mapping Support
                const constructor = target.constructor as ModelConstructorWithMetadata;
                const mapping = constructor.__columnMapping;
                if (mapping && typeof prop === 'string' && mapping[prop]) {
                    const mappedKey = mapping[prop] as keyof TAttributes;
                    return target.attributes[mappedKey];
                }

                if (typeof prop === 'string' && Object.hasOwn(target.attributes, prop)) {
                    return target.attributes[prop as keyof TAttributes];
                }

                return undefined;
            },
            set(target, prop, value, receiver): boolean {
                if (Reflect.has(target, prop)) {
                    return Reflect.set(target, prop, value, receiver);
                }

                // Check for mutator: set{Attribute}Attribute
                if (typeof prop === 'string') {
                    const mutatorName = `set${target.studly(prop)}Attribute`;
                    const mutator = (target as Record<string, unknown>)[mutatorName];
                    if (typeof mutator === 'function') {
                        (mutator as (val: unknown) => void).call(target, value);
                        return true;
                    }
                }

                // Column Mapping Support
                const constructor = target.constructor as ModelConstructorWithMetadata;
                const mapping = constructor.__columnMapping;
                if (mapping && typeof prop === 'string' && mapping[prop]) {
                    target.setAttribute(mapping[prop], value);
                    return true;
                }

                if (typeof prop === 'string') {
                    target.setAttribute(prop, value);
                    return true;
                }
                return false;
            },
        });
    }

    /**
     * Convert snake_case to StudlyCase for accessor/mutator method names
     */
    protected studly(value: string): string {
        return value
            .split('_')
            .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
            .join('');
    }

    /**
     * Fill the model with an array of attributes.
     *
     * @param attributes - Key-value pairs of attributes
     * @returns This model instance for chaining
     *
     * @example
     * ```typescript
     * user.fill({ name: 'Jane', email: 'jane@example.com' });
     * ```
     */
    fill(attributes: Partial<TAttributes>): this {
        // Implementar lógica de fillable/guarded aqui
        // Por simplificação:
        for (const key in attributes) {
            if (Object.hasOwn(attributes, key)) {
                this.setAttribute(key, attributes[key]);
            }
        }
        return this;
    }

    /**
     * Set a given attribute on the model.
     *
     * @param key - Attribute name
     * @param value - Attribute value
     *
     * @example
     * ```typescript
     * user.setAttribute('name', 'John');
     * ```
     */
    setAttribute(key: string, value: unknown): void {
        this.attributes[key as keyof TAttributes] = value as TAttributes[keyof TAttributes];
    }

    /**
     * Get an attribute from the model.
     *
     * @param key - Attribute name
     * @returns The attribute value or undefined
     *
     * @example
     * ```typescript
     * const name = user.getAttribute('name');
     * ```
     */
    getAttribute(key: string): unknown {
        return this.attributes[key as keyof TAttributes];
    }

    /**
     * Set the connection resolver instance.
     * @param resolver DatabaseManager instance
     */
    static setConnectionResolver(resolver: DatabaseManager) {
        Model.resolver = resolver;
    }

    /**
     * Get the connection resolver instance.
     */
    static getConnectionResolver(): DatabaseManager {
        return Model.resolver;
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
        if (Model.table) {
            return Model.table;
        }
        // Simple pluralizer fallback if no helper
        // snake_case class name + s
        const name = Model.name.replace(/([a-z])([A-Z])/g, '$1_$2').toLowerCase();
        return `${name}s`;
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
        return new Model().newQuery();
    }

    /**
     * newQuery method com tipagem correta.
     *
     * @returns Query builder instance for this model
     */
    newQuery(): QueryBuilder<Model<TAttributes>> {
        const builder = new QueryBuilder<Model<TAttributes>>(this.getConnection());
        builder.from(this.getTable());
        builder.setModel(this._modelClass as unknown as ModelConstructor<Model<TAttributes>>);
        return builder;
    }

    /**
     * Begin querying the model with eager loading.
     * @param relations Relations to eager load
     */
    static with(...relations: string[]): QueryBuilder {
        const builder = Model.query();
        builder.with(...relations);
        return builder;
    }

    /**
     * Get all of the models from the database.
     */
    static async all(): Promise<Collection<Model>> {
        return Model.query().get();
    }

    /**
     * Find a model by its primary key.
     *
     * @param id - Primary key value
     * @returns The model instance or null if not found
     */
    static async find<T extends Model>(this: new () => T, id: PrimaryKey): Promise<T | null> {
        const instance = new Model();
        return instance
            .newQuery()
            .where((instance.constructor as typeof Model).primaryKey, id)
            .first() as Promise<T | null>;
    }

    /**
     * Save a new model and return the instance.
     *
     * @param attributes - Attributes to create the model with
     * @returns The created model instance
     */
    static async create<T extends Model>(this: new () => T, attributes: Partial<T['attributes']>): Promise<T> {
        const instance = new this();
        instance.fill(attributes);
        await instance.save();
        return instance;
    }

    /**
     * Get the first record matching the attributes or create it.
     *
     * @param attributes - Attributes to find the record
     * @param values - Additional attributes to set if creating
     * @returns The existing or created model instance
     */
    static async firstOrCreate<T extends Model>(
        this: new () => T,
        attributes: Record<string, WhereClauseValue>,
        values: Partial<T['attributes']> = {}
    ): Promise<T> {
        const instance = new this();
        const existing = (await instance.newQuery().where(attributes).first()) as T | null;

        if (existing) {
            return existing;
        }

        const newInstance = new this();
        newInstance.fill({ ...attributes, ...values } as Partial<T['attributes']>);
        await newInstance.save();
        return newInstance;
    }

    /**
     * Set the specific relationship in the model.
     *
     * @param name - Relation name
     * @param value - Relation value (Model, Collection, or null)
     * @returns This model instance for chaining
     *
     * @example
     * ```typescript
     * user.setRelation('posts', postCollection);
     * ```
     */
    setRelation(name: string, value: RelationValue): this {
        this.relations.set(name, value);
        return this;
    }

    /**
     * Get the specified relationship.
     *
     * @param name - Relation name
     * @returns The loaded relation or undefined if not loaded
     *
     * @example
     * ```typescript
     * const posts = user.getRelation('posts');
     * ```
     */
    getRelation(name: string): RelationValue {
        return this.relations.get(name);
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
                await query.where(pk, '=', id as WhereClauseValue).update(this.attributes as unknown as MutationValues);
            }
            return true;
        } else {
            // Insert
            const result = await query.insert(this.attributes as unknown as MutationValues);
            this.exists = true;

            // Only update ID if auto-incrementing
            if (this._modelClass.incrementing && result && result.lastInsertId) {
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
    hasOne<TRelated extends Model<Record<string, unknown>>>(
        related: new () => TRelated,
        foreignKey?: string,
        localKey?: string
    ): HasOne<TRelated, Model<Record<string, unknown>>> {
        const instance = new related();

        foreignKey = foreignKey || this.getForeignKey();
        localKey = localKey || this._modelClass.primaryKey;

        return new HasOne(
            instance.newQuery() as unknown as QueryBuilder<TRelated>,
            this as unknown as Model<Record<string, unknown>>,
            foreignKey,
            localKey
        );
    }

    /**
     * Define a one-to-many relationship.
     * @param related Related model class
     * @param foreignKey Foreign key on related model
     * @param localKey Local key on this model
     */
    hasMany<TRelated extends Model<Record<string, unknown>>>(
        related: new () => TRelated,
        foreignKey?: string,
        localKey?: string
    ): HasMany<TRelated, Model<Record<string, unknown>>> {
        const instance = new related();

        foreignKey = foreignKey || this.getForeignKey();
        localKey = localKey || this._modelClass.primaryKey;

        return new HasMany(
            instance.newQuery() as unknown as QueryBuilder<TRelated>,
            this as unknown as Model<Record<string, unknown>>,
            foreignKey,
            localKey
        );
    }

    /**
     * Define an inverse one-to-one or many-to-one relationship.
     * @param related Related model class
     * @param foreignKey Foreign key on this model
     * @param ownerKey Owner key on related model
     */
    belongsTo<TRelated extends Model<Record<string, unknown>>>(
        related: new () => TRelated,
        foreignKey?: string,
        ownerKey?: string
    ): BelongsTo<TRelated, Model<Record<string, unknown>>> {
        const instance = new related();

        // Foreign key is typically on this model pointing to parent
        // Default foreign key name logic: str_singular(related_table) + _id? No, usually related method name but simpler:
        // snake_case(related class name) + _id
        if (!foreignKey) {
            foreignKey = `${(instance.constructor as typeof Model).name.replace(/([a-z])([A-Z])/g, '$1_$2').toLowerCase()}_id`;
        }
        ownerKey = ownerKey || (instance.constructor as typeof Model).primaryKey;

        return new BelongsTo(
            instance.newQuery() as unknown as QueryBuilder<TRelated>,
            this as unknown as Model<Record<string, unknown>>,
            foreignKey,
            ownerKey
        );
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
    belongsToMany<TRelated extends Model<Record<string, unknown>>>(
        related: new () => TRelated,
        table?: string,
        foreignPivotKey?: string,
        relatedPivotKey?: string,
        parentKey?: string,
        relatedKey?: string
    ): BelongsToMany<TRelated, Model<Record<string, unknown>>> {
        const instance = new related();

        // Default pivot table name: alphabetical order of table names joined by underscore
        const relatedTable = instance.getTable();
        const parentTable = this.getTable();
        if (!table) {
            const tables = [parentTable, relatedTable].sort();
            // Simple singular: remove trailing 's' (basic)
            table = `${tables.map((t) => t.replace(/s$/, '')).join('_')}s`;
        }

        foreignPivotKey = foreignPivotKey || this.getForeignKey();
        relatedPivotKey =
            relatedPivotKey ||
            `${(instance.constructor as typeof Model).name.replace(/([a-z])([A-Z])/g, '$1_$2').toLowerCase()}_id`;
        parentKey = parentKey || (this.constructor as typeof Model).primaryKey;
        relatedKey = relatedKey || (instance.constructor as typeof Model).primaryKey;

        return new BelongsToMany(
            instance.newQuery() as unknown as QueryBuilder<TRelated>,
            this as unknown as Model<Record<string, unknown>>,
            table,
            foreignPivotKey,
            relatedPivotKey,
            parentKey,
            relatedKey
        );
    }

    /**
     * Get the default foreign key name for the model.
     *
     * @returns Foreign key column name (e.g., 'user_id')
     */
    getForeignKey(): string {
        return `${(this.constructor as typeof Model).name.replace(/([a-z])([A-Z])/g, '$1_$2').toLowerCase()}_id`;
    }
}
