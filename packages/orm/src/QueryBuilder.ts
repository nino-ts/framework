import { Collection } from './Collection';
import { Grammar } from './Grammar';
import { QueryException } from './Exceptions';

export interface Connector {
    query(sql: string, bindings: any[]): Promise<any[]>;
    run(sql: string, bindings: any[]): Promise<any>;
}

export class QueryBuilder {
    public columns: string[] = [];
    public fromTable: string = '';
    public wheres: any[] = [];
    public orders: any[] = [];
    public limitValue?: number;
    public offsetValue?: number;
    public joins: any[] = [];
    public bindings: any[] = [];
    public eagerRelations: string[] = [];
    protected modelClass?: any;

    protected grammar: Grammar;

    constructor(public connection: Connector, grammar?: Grammar) {
        this.grammar = grammar || new Grammar();
    }

    select(...columns: string[]): this {
        this.columns = columns;
        return this;
    }

    table(table: string): this {
        this.fromTable = table;
        return this;
    }

    // Alias para table()
    from(table: string): this {
        return this.table(table);
    }

    where(column: string | Record<string, any>, operator?: string | any, value?: any, boolean: string = 'and'): this {
        if (typeof column === 'object') {
            // Handle object syntax
            for (const key in column) {
                this.where(key, '=', column[key], boolean);
            }
            return this;
        }

        // Se apenas 2 args, assume =
        if (value === undefined) {
            value = operator;
            operator = '=';
        }

        this.wheres.push({ type: 'Basic', column, operator, value, boolean });
        this.bindings.push(value);

        return this;
    }

    orWhere(column: string, operator?: string | any, value?: any): this {
        return this.where(column, operator, value, 'or');
    }

    whereNull(column: string, boolean: string = 'and'): this {
        this.wheres.push({ type: 'Null', column, boolean });
        return this;
    }

    whereIn(column: string, values: any[], boolean: string = 'and'): this {
        this.wheres.push({ type: 'In', column, values, boolean });
        this.bindings.push(...values);
        return this;
    }

    orderBy(column: string, direction: 'asc' | 'desc' = 'asc'): this {
        this.orders.push({ column, direction });
        return this;
    }

    limit(value: number): this {
        this.limitValue = value;
        return this;
    }

    offset(value: number): this {
        this.offsetValue = value;
        return this;
    }

    join(table: string, first: string, operator: string, second: string, type: string = 'inner'): this {
        this.joins.push({ table, first, operator, second, type });
        return this;
    }

    leftJoin(table: string, first: string, operator: string, second: string): this {
        return this.join(table, first, operator, second, 'left');
    }

    rightJoin(table: string, first: string, operator: string, second: string): this {
        return this.join(table, first, operator, second, 'right');
    }

    toSql(): string {
        return this.grammar.compileSelect(this);
    }

    getBindings(): any[] {
        return this.bindings;
    }

    async get<T = any>(): Promise<Collection<T>> {
        const sql = this.toSql();
        const bindings = this.getBindings();

        try {
            const results = await this.connection.query(sql, bindings);

            // Hydrate models if we have a model class
            let items: T[];
            if (this.modelClass) {
                items = results.map((row: any) => {
                    const model = new this.modelClass();
                    model.fill(row);
                    model.exists = true;
                    return model as T;
                });
            } else {
                items = results;
            }

            const collection = new Collection<T>(items);

            // Eager load relations
            if (this.eagerRelations.length > 0 && this.modelClass) {
                await this.eagerLoadRelations(collection);
            }

            return collection;
        } catch (error: any) {
            throw new QueryException(error.message, sql, bindings);
        }
    }

    setModel(model: any): this {
        this.modelClass = model;
        return this;
    }

    with(...relations: string[]): this {
        this.eagerRelations.push(...relations);
        return this;
    }

    protected async eagerLoadRelations<T>(collection: Collection<T>): Promise<void> {
        for (const relationName of this.eagerRelations) {
            const models = collection.all();
            if (models.length === 0) continue;

            // Get the first model to access the relation definition
            const firstModel = models[0] as any;
            if (typeof firstModel[relationName] !== 'function') continue;

            // Get foreign keys from all models
            const relation = firstModel[relationName]();
            const relationType = relation.constructor.name;

            if (relationType === 'HasMany') {
                // Collect parent IDs
                const parentIds = models.map((m: any) => m.id).filter(Boolean);
                if (parentIds.length === 0) continue;

                // Fetch all related models using base query (without parent constraint)
                const relatedModels = await relation.getBaseQuery()
                    .whereIn(relation.foreignKey, parentIds)
                    .get();

                // Group by foreign key and assign
                for (const model of models as any[]) {
                    const related = relatedModels.filter((r: any) =>
                        r[relation.foreignKey] === model.id
                    );
                    model.setRelation(relationName, new Collection(related.all()));
                }
            } else if (relationType === 'BelongsTo') {
                // Collect foreign key values
                const foreignKeyValues = models.map((m: any) => m[relation.foreignKey]).filter(Boolean);
                if (foreignKeyValues.length === 0) continue;

                // Fetch all parent models using base query
                const parentModels = await relation.getBaseQuery()
                    .whereIn(relation.ownerKey, foreignKeyValues)
                    .get();

                // Assign to each model
                for (const model of models as any[]) {
                    const parent = parentModels.first((p: any) =>
                        p[relation.ownerKey] === model[relation.foreignKey]
                    );
                    model.setRelation(relationName, parent || null);
                }
            }
        }
    }

    async first<T = any>(): Promise<T | null> {
        const results = await this.limit(1).get<T>();
        return results.first();
    }

    async insert(values: Record<string, any>): Promise<any> {
        // Nota: Insert simples por enquanto, não suporta batch perfeitamente na grammar ainda
        // Bindings para insert não estão sendo acumulados em this.bindings (são passados direto pro run)
        // Ajuste ideal: adicionar bindings de insert ao this.bindings e compilar placeholder

        const sql = this.grammar.compileInsert(this, values);
        // Extrair valores na ordem das chaves
        const bindings = Object.values(values);

        return this.connection.run(sql, bindings);
    }

    async update(values: Record<string, any>): Promise<any> {
        const sql = this.grammar.compileUpdate(this, values);
        const updateBindings = Object.values(values);
        // Bindings = update values + where bindings
        const bindings = [...updateBindings, ...this.getBindings()];

        return this.connection.run(sql, bindings);
    }

    async delete(): Promise<any> {
        const sql = this.grammar.compileDelete(this);
        return this.connection.run(sql, this.getBindings());
    }

    /**
     * Paginate results
     */
    async paginate<T = any>(perPage: number = 15, page: number = 1): Promise<PaginationResult<T>> {
        // Get total count
        const countQuery = new QueryBuilder(this.connection);
        countQuery.from(this.fromTable);
        countQuery.wheres = [...this.wheres];
        countQuery.bindings = [...this.bindings];

        const countResult = await countQuery.count();
        const total = countResult;

        // Get page data
        const offset = (page - 1) * perPage;
        const data = await this.limit(perPage).offset(offset).get<T>();

        return {
            data,
            currentPage: page,
            perPage,
            total,
            lastPage: Math.ceil(total / perPage),
        };
    }

    /**
     * Process results in chunks
     */
    async chunk<T = any>(size: number, callback: (items: Collection<T>) => void | Promise<void>): Promise<void> {
        let page = 1;

        while (true) {
            const result = await this.paginate<T>(size, page);

            if (result.data.isEmpty()) {
                break;
            }

            await callback(result.data);

            if (page >= result.lastPage) {
                break;
            }

            page++;
        }
    }

    /**
     * Get count of results
     */
    async count(): Promise<number> {
        const original = this.columns;
        this.columns = ['COUNT(*) as count'];

        const sql = this.toSql();
        const result = await this.connection.query(sql, this.getBindings());

        this.columns = original;
        return result[0]?.count || 0;
    }
}

export interface PaginationResult<T> {
    data: Collection<T>;
    currentPage: number;
    perPage: number;
    total: number;
    lastPage: number;
}

