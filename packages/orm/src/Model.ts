import { QueryBuilder } from './QueryBuilder';
import { Collection } from './Collection';
import { DatabaseManager } from './DatabaseManager';
import { Connection } from './Connection';
import { HasMany } from './Relations/HasMany';
import { BelongsTo } from './Relations/BelongsTo';
import { plural } from './support/Str'; // Vou precisar criar helper ou usar simples

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

    constructor(attributes: Record<string, any> = {}) {
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

    fill(attributes: Record<string, any>): this {
        // Implementar lógica de fillable/guarded aqui
        // Por simplificação:
        for (const key in attributes) {
            this.setAttribute(key, attributes[key]);
        }
        return this;
    }

    setAttribute(key: string, value: any): void {
        this.attributes[key] = value;
    }

    getAttribute(key: string): any {
        return this.attributes[key];
    }

    static setConnectionResolver(resolver: DatabaseManager) {
        this.resolver = resolver;
    }

    static getConnectionResolver(): DatabaseManager {
        return this.resolver;
    }

    getConnection(): Connection {
        return Model.resolver.connection();
    }

    static resolveConnection(name?: string): Connection {
        return Model.resolver.connection(name);
    }

    static getTable(): string {
        if (this.table) {
            return this.table;
        }
        // Simple pluralizer fallback if no helper
        // snake_case class name + s
        const name = this.name.replace(/([a-z])([A-Z])/g, '$1_$2').toLowerCase();
        return name + 's';
    }

    getTable(): string {
        return (this.constructor as typeof Model).getTable();
    }

    static query(): QueryBuilder {
        return (new this()).newQuery();
    }

    newQuery(): QueryBuilder {
        const builder = new QueryBuilder(this.getConnection());
        builder.from(this.getTable());
        builder.setModel(this.constructor as typeof Model);
        return builder;
    }

    static with(...relations: string[]): QueryBuilder {
        const builder = this.query();
        builder.with(...relations);
        return builder;
    }

    static async all(): Promise<Collection<Model>> {
        return this.query().get();
    }

    setRelation(name: string, value: any): this {
        this.relations[name] = value;
        return this;
    }

    getRelation(name: string): any {
        return this.relations[name];
    }

    async save(): Promise<boolean> {
        const query = this.newQuery();

        if (this.exists) {
            // Update
            // await query.where(this.getKeyName(), this.getKey()).update(this.attributes);
            return true;
        } else {
            // Insert
            const result = await query.insert(this.attributes);
            this.exists = true;
            if (result && result.lastInsertId) {
                this.setAttribute((this.constructor as typeof Model).primaryKey, result.lastInsertId);
            }
            return true;
        }
    }

    hasMany<TRelated extends Model>(related: new () => TRelated, foreignKey?: string, localKey?: string): HasMany<TRelated, this> {
        const instance = new related();

        foreignKey = foreignKey || this.getForeignKey();
        localKey = localKey || (this.constructor as typeof Model).primaryKey;

        return new HasMany(instance.newQuery(), this, foreignKey, localKey);
    }

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

    getForeignKey(): string {
        return (this.constructor as typeof Model).name.replace(/([a-z])([A-Z])/g, '$1_$2').toLowerCase() + '_id';
    }

    // Typings for dynamic access
    [key: string]: any;
}
