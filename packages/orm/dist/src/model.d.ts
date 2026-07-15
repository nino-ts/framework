import type { Collection } from "./collection";
import type { Connection } from "./connection";
import type { DatabaseManager } from "./database-manager";
import { QueryBuilder } from "./query-builder";
import { BelongsTo } from "./relations/belongs-to";
import { BelongsToMany } from "./relations/belongs-to-many";
import { HasMany } from "./relations/has-many";
import { HasOne } from "./relations/has-one";
import type { ModelConstructor, ModelInstance, PrimaryKey, WhereClauseValue } from "./types";
/**
 * Exception thrown when a model is not found.
 *
 * @example
 * ```typescript
 * const user = await User.findOrFail(999);
 * // throws ModelNotFoundException: No query results for model [User] 999
 * ```
 */
export declare class ModelNotFoundException extends Error {
    constructor(message: string);
}
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
    keyType: "int" | "string";
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
export declare class Model<TAttributes extends object = Record<string, unknown>> implements ModelInstance {
    /**
     * Index signature to satisfy ModelInstance interface.
     * Allows dynamic property access via Proxy.
     */
    [key: string]: unknown;
    protected static resolver: DatabaseManager;
    protected static table: string;
    protected static primaryKey: string;
    protected static keyType: "int" | "string";
    protected static incrementing: boolean;
    /**
     * Mass-assignable attribute names (Laravel `$fillable` equivalent).
     */
    protected static fillable: string[];
    /**
     * Attributes to hide from serialization (toArray/toJSON).
     * Type-safe: only keys of TAttributes are accepted.
     */
    protected static hidden: string[];
    /**
     * Attributes to show in serialization (if set, only these are included).
     * Takes precedence over `hidden`.
     */
    protected static visible: string[];
    /**
     * Attribute cast definitions.
     * Maps attribute names to cast types ('boolean', 'integer', 'float', 'string', 'json', 'array', 'datetime', 'date').
     */
    protected static casts: Record<string, string>;
    protected attributes: Partial<TAttributes>;
    protected original: Partial<TAttributes>;
    exists: boolean;
    protected relations: Map<string, RelationValue>;
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
    constructor(attributes?: Partial<TAttributes>);
    /**
     * Convert snake_case to StudlyCase for accessor/mutator method names
     */
    protected studly(value: string): string;
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
    fill(attributes: Partial<TAttributes>): this;
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
    setAttribute(key: string, value: unknown): void;
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
    getAttribute(key: string): unknown;
    /**
     * Set the connection resolver instance.
     * @param resolver DatabaseManager instance
     */
    static setConnectionResolver(resolver: DatabaseManager): void;
    /**
     * Get the connection resolver instance.
     */
    static getConnectionResolver(): DatabaseManager;
    /**
     * Get the database connection for the model.
     */
    getConnection(): Connection;
    /**
     * Resolve a connection instance.
     * @param name Connection name
     */
    static resolveConnection(name?: string): Connection;
    /**
     * Get the table associated with the model.
     *
     * @returns The table name
     */
    static getTable(this: ModelConstructor<Model>): string;
    /**
     * Get the table associated with the model instance.
     */
    getTable(): string;
    /**
     * Begin querying the model.
     *
     * @returns Query builder instance for this model
     */
    static query<T extends Model>(this: new () => T): QueryBuilder<T>;
    /**
     * newQuery method com tipagem correta.
     *
     * @returns Query builder instance for this model
     */
    newQuery(): QueryBuilder<Model<TAttributes>>;
    /**
     * Begin querying the model with eager loading.
     *
     * @param relations - Relations to eager load
     * @returns Query builder instance
     */
    static with<T extends Model>(this: new () => T, ...relations: string[]): QueryBuilder<T>;
    /**
     * Resolve the model factory registered via `configureModelFactory`.
     *
     * @param count - Optional number of models to generate
     * @returns Factory instance for this model
     */
    static factory<T extends Model>(this: new () => T): import("./factory/factory").Factory<T>;
    static factory<T extends Model, N extends number>(this: new () => T, count: N): import("./factory/factory").Factory<T, Record<string, unknown>, N>;
    /**
     * Get all of the models from the database.
     *
     * @returns Collection of models
     */
    static all<T extends Model>(this: new () => T): Promise<Collection<T>>;
    /**
     * Find a model by its primary key.
     *
     * @param id - Primary key value
     * @returns The model instance or null if not found
     */
    /**
     * Find a model by its primary key.
     *
     * @param id - Primary key value
     * @returns The model instance or null if not found
     */
    static find<T extends Model>(this: new () => T, id: PrimaryKey): Promise<T | null>;
    /**
     * Save a new model and return the instance.
     *
     * @param attributes - Attributes to create the model with
     * @returns The created model instance
     */
    static create<T extends Model>(this: new () => T, attributes: Partial<T["attributes"]>): Promise<T>;
    /**
     * Get the first record matching the attributes or create it.
     *
     * @param attributes - Attributes to find the record
     * @param values - Additional attributes to set if creating
     * @returns The existing or created model instance
     */
    static firstOrCreate<T extends Model>(this: new () => T, attributes: Record<string, WhereClauseValue>, values?: Partial<T["attributes"]>): Promise<T>;
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
    setRelation(name: string, value: RelationValue): this;
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
    getRelation(name: string): RelationValue;
    /**
     * Save the model to the database.
     * @returns True if saved successfully
     */
    save(): Promise<boolean>;
    /**
     * Delete the model from the database.
     *
     * @returns True if deleted successfully
     *
     * @example
     * ```typescript
     * const user = await User.findOrFail(1);
     * await user.delete(); // DELETE FROM users WHERE id = 1
     * ```
     */
    delete(): Promise<boolean>;
    /**
     * Determine if the model or any of the given attributes have been modified.
     *
     * @param keys - Optional attribute keys to check
     * @returns True if the model (or specified keys) has unsaved changes
     *
     * @example
     * ```typescript
     * user.name = 'New Name';
     * user.isDirty();       // true
     * user.isDirty('name'); // true
     * user.isDirty('email'); // false
     * ```
     */
    isDirty(...keys: (keyof TAttributes)[]): boolean;
    /**
     * Determine if the model or any of the given attributes have NOT been modified.
     *
     * @param keys - Optional attribute keys to check
     * @returns True if the model (or specified keys) has no unsaved changes
     */
    isClean(...keys: (keyof TAttributes)[]): boolean;
    /**
     * Get the attributes that have been changed since the last sync.
     *
     * @returns Object containing only the modified attributes
     */
    getDirty(): Partial<TAttributes>;
    /**
     * Sync the original attributes with the current.
     * Called after successful save/hydration.
     *
     * @returns This model instance for chaining
     */
    syncOriginal(): this;
    /**
     * Convert the model to a plain object, respecting `hidden` and `visible`.
     *
     * If `visible` is set, only those keys are included.
     * Otherwise, keys in `hidden` are excluded.
     * Loaded relations are included.
     *
     * @returns Plain object representation
     *
     * @example
     * ```typescript
     * class User extends Model<UserAttributes> {
     *   protected static hidden: (keyof UserAttributes)[] = ['password'];
     * }
     * user.toArray(); // { id: 1, name: 'João', email: '...' } — no password
     * ```
     */
    toArray(): Partial<TAttributes>;
    /**
     * Convert the model to a JSON string.
     * Respects `hidden` and `visible` settings.
     *
     * @returns JSON string representation
     */
    toJSON(): string;
    /**
     * Find a model by its primary key or throw an exception.
     *
     * @param id - Primary key value
     * @returns The model instance
     * @throws ModelNotFoundException if not found
     *
     * @example
     * ```typescript
     * const user = await User.findOrFail(1);
     * // throws ModelNotFoundException if user with id 1 doesn't exist
     * ```
     */
    static findOrFail<T extends Model>(this: new () => T, id: PrimaryKey): Promise<T>;
    /**
     * Create or update a record matching the attributes, and fill it with values.
     *
     * @param attributes - Attributes to match (WHERE clause)
     * @param values - Values to update or set on creation
     * @returns The updated or created model instance
     *
     * @example
     * ```typescript
     * const user = await User.updateOrCreate(
     *   { email: 'joao@ninots.dev' },
     *   { name: 'João', password: hashedPassword },
     * );
     * ```
     */
    static updateOrCreate<T extends Model>(this: new () => T, attributes: Record<string, WhereClauseValue>, values?: Record<string, unknown>): Promise<T>;
    /**
     * Get the first record matching the attributes or instantiate a new model (without persisting).
     *
     * @param attributes - Attributes to search for
     * @param values - Additional attributes for the new instance
     * @returns The existing or new (non-persisted) model instance
     *
     * @example
     * ```typescript
     * const user = await User.firstOrNew(
     *   { email: 'joao@ninots.dev' },
     *   { name: 'João' },
     * );
     * if (!user.exists) {
     *   await user.save(); // only saves if it's a new record
     * }
     * ```
     */
    static firstOrNew<T extends Model>(this: new () => T, attributes: Record<string, WhereClauseValue>, values?: Record<string, unknown>): Promise<T>;
    /**
     * Execute a raw SQL query using tagged templates.
     *
     * This is a TypeScript/JavaScript-native feature that PHP doesn't have.
     * Goes directly to the Bun.sql driver without passing through the Grammar.
     *
     * @template T - The expected row type
     * @returns Array of result rows
     *
     * @example
     * ```typescript
     * const stats = await User.raw`
     *   SELECT role, COUNT(*) as total
     *   FROM users
     *   WHERE active = ${true}
     *   GROUP BY role
     * `;
     * ```
     */
    static raw<T = Record<string, unknown>>(strings: TemplateStringsArray, ...values: unknown[]): Promise<T[]>;
    /**
     * Define a one-to-one relationship.
     * @param related Related model class
     * @param foreignKey Foreign key on related model
     * @param localKey Local key on this model
     */
    hasOne<TRelated extends Model<Record<string, unknown>>>(related: new () => TRelated, foreignKey?: string, localKey?: string): HasOne<TRelated, Model<Record<string, unknown>>>;
    /**
     * Define a one-to-many relationship.
     * @param related Related model class
     * @param foreignKey Foreign key on related model
     * @param localKey Local key on this model
     */
    hasMany<TRelated extends Model<Record<string, unknown>>>(related: new () => TRelated, foreignKey?: string, localKey?: string): HasMany<TRelated, Model<Record<string, unknown>>>;
    /**
     * Define an inverse one-to-one or many-to-one relationship.
     * @param related Related model class
     * @param foreignKey Foreign key on this model
     * @param ownerKey Owner key on related model
     */
    belongsTo<TRelated extends Model<Record<string, unknown>>>(related: new () => TRelated, foreignKey?: string, ownerKey?: string): BelongsTo<TRelated, Model<Record<string, unknown>>>;
    /**
     * Define a many-to-many relationship.
     * @param related Related model class
     * @param table Pivot table name
     * @param foreignPivotKey Foreign key for this model on pivot
     * @param relatedPivotKey Foreign key for related model on pivot
     * @param parentKey Key on this model
     * @param relatedKey Key on related model
     */
    belongsToMany<TRelated extends Model<Record<string, unknown>>>(related: new () => TRelated, table?: string, foreignPivotKey?: string, relatedPivotKey?: string, parentKey?: string, relatedKey?: string): BelongsToMany<TRelated, Model<Record<string, unknown>>>;
    /**
     * Get the default foreign key name for the model.
     *
     * @returns Foreign key column name (e.g., 'user_id')
     */
    getForeignKey(): string;
}
