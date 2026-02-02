/**
 * Query Builder for constructing and executing database queries.
 *
 * Provides a fluent interface for building SQL queries type-safely.
 * Zero `any` types - all operations are fully type-checked.
 *
 * @packageDocumentation
 */

import { Collection } from '@/collection';
import { Grammar } from '@/grammar';
import { QueryException } from '@/exceptions';
import type {
    WhereClause,
    WhereClauseValue,
    OrderClause,
    JoinClause,
    BooleanOperator,
    Operator,
    PaginationResult,
    ModelConstructor,
    ModelInstance,
    MutationValues,
    StatementExecutionResult,
    DatabaseRow,
} from '@/types';

/**
 * Interface that represents a database connector capable of running queries.
 */
export interface Connector {
    /**
     * Execute a SELECT query and return the results.
     *
     * @template T - The type of rows returned
     * @param sql - The SQL query string
     * @param bindings - Array of parameter bindings
     * @returns Promise of result rows
     */
    query<T = DatabaseRow>(
        sql: string,
        bindings: readonly WhereClauseValue[]
    ): Promise<T[]>;

    /**
     * Execute an INSERT, UPDATE, or DELETE query.
     *
     * @param sql - The SQL query string
     * @param bindings - Array of parameter bindings
     * @returns Promise of execution result
     */
    run(
        sql: string,
        bindings: readonly WhereClauseValue[]
    ): Promise<StatementExecutionResult>;
}

/**
 * The QueryBuilder class is responsible for building and executing database queries
 * programmatically using a fluent interface.
 *
 * @template TModel - The model type (defaults to DatabaseRow)
 *
 * @example
 * ```typescript
 * const users = await new QueryBuilder<User>(connection)
 *     .table('users')
 *     .where('age', '>', 18)
 *     .orderBy('name', 'asc')
 *     .get();
 * ```
 */
export class QueryBuilder<TModel extends ModelInstance = ModelInstance> {
    /**
     * Columns to select.
     */
    public columns: string[] = [];

    /**
     * Table to query from.
     */
    public fromTable: string = '';

    /**
     * WHERE clauses.
     */
    public wheres: WhereClause[] = [];

    /**
     * ORDER BY clauses.
     */
    public orders: OrderClause[] = [];

    /**
     * LIMIT value.
     */
    public limitValue?: number;

    /**
     * OFFSET value.
     */
    public offsetValue?: number;

    /**
     * JOIN clauses.
     */
    public joins: JoinClause[] = [];

    /**
     * Query parameter bindings.
     */
    public bindings: WhereClauseValue[] = [];

    /**
     * Relations to eager load.
     */
    public eagerRelations: string[] = [];

    /**
     * Model class for hydration.
     */
    protected modelClass?: ModelConstructor<TModel>;

    /**
     * SQL grammar instance.
     */
    protected readonly grammar: Grammar;

    /**
     * Database connection.
     */
    public readonly connection: Connector;

    /**
     * Creates a new QueryBuilder instance.
     *
     * @param connection - Database connector
     * @param grammar - SQL grammar (defaults to generic Grammar)
     */
    constructor(connection: Connector, grammar?: Grammar) {
        this.connection = connection;
        this.grammar = grammar ?? new Grammar();
    }

    /**
     * Set the columns to be selected.
     *
     * @param columns - List of column names
     * @returns This query builder for chaining
     *
     * @example
     * ```typescript
     * builder.select('id', 'name', 'email');
     * ```
     */
    select(...columns: readonly string[]): this {
        this.columns = [...columns];
        return this;
    }

    /**
     * Set the table to query from.
     *
     * @param table - Name of the table
     * @returns This query builder for chaining
     */
    table(table: string): this {
        this.fromTable = table;
        return this;
    }

    /**
     * Alias for table().
     *
     * @param table - Name of the table
     * @returns This query builder for chaining
     */
    from(table: string): this {
        return this.table(table);
    }

    /**
     * Add a basic WHERE clause to the query.
     *
     * Supports multiple signatures:
     * - where('column', 'value') - implicit '=' operator
     * - where('column', '>', 'value') - explicit operator
     * - where({ col: 'val', col2: 'val2' }) - object syntax
     *
     * @param column - Column name or object of key-value pairs
     * @param operator - Operator (e.g., '=', '>', '<') or value (if implicit '=')
     * @param value - Value to compare against
     * @param boolean - Boolean operator ('and' or 'or')
     * @returns This query builder for chaining
     *
     * @example
     * ```typescript
     * builder.where('age', '>', 18);
     * builder.where('status', 'active');
     * builder.where({ age: 18, active: true });
     * ```
     */
    where(
        column: string | Record<string, WhereClauseValue>,
        operator?: Operator | WhereClauseValue,
        value?: WhereClauseValue,
        boolean: BooleanOperator = 'and'
    ): this {
        if (typeof column === 'object') {
            // Handle object syntax
            for (const [key, val] of Object.entries(column)) {
                this.where(key, '=', val, boolean);
            }
            return this;
        }

        // If only 2 args, assume '=' operator
        if (value === undefined) {
            value = operator as WhereClauseValue;
            operator = '=';
        }

        this.wheres.push({
            type: 'Basic',
            column,
            operator: operator as Operator,
            value,
            boolean,
        });
        this.bindings.push(value);

        return this;
    }

    /**
     * Add an OR WHERE clause to the query.
     *
     * @param column - Column name
     * @param operator - Operator or value
     * @param value - Value (optional)
     * @returns This query builder for chaining
     */
    orWhere(
        column: string,
        operator?: Operator | WhereClauseValue,
        value?: WhereClauseValue
    ): this {
        return this.where(column, operator, value, 'or');
    }

    /**
     * Add a WHERE NULL clause to the query.
     *
     * @param column - Column name
     * @param boolean - Boolean operator ('and' or 'or')
     * @returns This query builder for chaining
     */
    whereNull(column: string, boolean: BooleanOperator = 'and'): this {
        this.wheres.push({ type: 'Null', column, boolean });
        return this;
    }

    /**
     * Add a WHERE IN clause to the query.
     *
     * @param column - Column name
     * @param values - Array of values
     * @param boolean - Boolean operator ('and' or 'or')
     * @returns This query builder for chaining
     *
     * @example
     * ```typescript
     * builder.whereIn('status', ['active', 'pending']);
     * ```
     */
    whereIn(
        column: string,
        values: readonly WhereClauseValue[],
        boolean: BooleanOperator = 'and'
    ): this {
        this.wheres.push({ type: 'In', column, values, boolean });
        this.bindings.push(...values);
        return this;
    }

    /**
     * Add an ORDER BY clause to the query.
     *
     * @param column - Column name
     * @param direction - Sort direction ('asc' or 'desc')
     * @returns This query builder for chaining
     */
    orderBy(column: string, direction: 'asc' | 'desc' = 'asc'): this {
        this.orders.push({ column, direction });
        return this;
    }

    /**
     * Set the limit for the query results.
     *
     * @param value - Number of records to return
     * @returns This query builder for chaining
     */
    limit(value: number): this {
        this.limitValue = value;
        return this;
    }

    /**
     * Set the offset for the query results.
     *
     * @param value - Number of records to skip
     * @returns This query builder for chaining
     */
    offset(value: number): this {
        this.offsetValue = value;
        return this;
    }

    /**
     * Add a JOIN clause to the query.
     *
     * @param table - Table to join
     * @param first - Column on the first table
     * @param operator - Operator
     * @param second - Column on the second table
     * @param type - Join type ('inner', 'left', etc.)
     * @returns This query builder for chaining
     */
    join(
        table: string,
        first: string,
        operator: string,
        second: string,
        type: 'inner' | 'left' | 'right' | 'cross' = 'inner'
    ): this {
        this.joins.push({ table, first, operator, second, type });
        return this;
    }

    /**
     * Add a LEFT JOIN clause to the query.
     *
     * @param table - Table to join
     * @param first - Column on the first table
     * @param operator - Operator
     * @param second - Column on the second table
     * @returns This query builder for chaining
     */
    leftJoin(table: string, first: string, operator: string, second: string): this {
        return this.join(table, first, operator, second, 'left');
    }

    /**
     * Add a RIGHT JOIN clause to the query.
     *
     * @param table - Table to join
     * @param first - Column on the first table
     * @param operator - Operator
     * @param second - Column on the second table
     * @returns This query builder for chaining
     */
    rightJoin(table: string, first: string, operator: string, second: string): this {
        return this.join(table, first, operator, second, 'right');
    }

    /**
     * Compile the current query into SQL.
     *
     * @returns SQL query string
     */
    toSql(): string {
        return this.grammar.compileSelect(this);
    }

    /**
     * Get the current query bindings.
     *
     * @returns Array of query bindings
     */
    getBindings(): readonly WhereClauseValue[] {
        return Object.freeze([...this.bindings]);
    }

    /**
     * Execute the query and return a Collection of results.
     *
     * @template T - The type of items to return (defaults to TModel)
     * @returns Promise of Collection with results
     *
     * @example
     * ```typescript
     * const users = await builder.get<User>();
     * ```
     */
    async get<T extends ModelInstance = TModel>(): Promise<Collection<T>> {
        const sql = this.toSql();
        const bindings = [...this.bindings];

        try {
            const results = await this.connection.query<DatabaseRow>(sql, bindings);

            // Hydrate models if we have a model class
            let items: T[];
            if (this.modelClass) {
                items = results.map((row: DatabaseRow): T => {
                    const model = new this.modelClass!() as unknown as T;
                    model.fill(row);
                    model.exists = true;
                    return model;
                });
            } else {
                items = results as unknown as T[];
            }

            const collection = new Collection<T>(items);

            // Eager load relations
            if (this.eagerRelations.length > 0 && this.modelClass) {
                await this.eagerLoadRelations(collection);
            }

            return collection;
        } catch (error) {
            if (error instanceof Error) {
                throw new QueryException(error.message, sql, bindings);
            }
            throw new QueryException('Unknown query error', sql, bindings);
        }
    }

    /**
     * Set the model class for hydration.
     *
     * @param model - Model constructor
     * @returns This query builder for chaining
     */
    setModel(model: ModelConstructor<TModel>): this {
        this.modelClass = model;
        return this;
    }

    /**
     * Set relations to eager load.
     *
     * @param relations - Relation names
     * @returns This query builder for chaining
     *
     * @example
     * ```typescript
     * const users = await User.query().with('posts', 'comments').get();
     * ```
     */
    with(...relations: readonly string[]): this {
        this.eagerRelations.push(...relations);
        return this;
    }

    /**
     * Eager load relations on a collection of models.
     *
     * @template T - Model type
     * @param collection - Collection of models
     */
    protected async eagerLoadRelations<T extends ModelInstance>(
        collection: Collection<T>
    ): Promise<void> {
        for (const relationName of this.eagerRelations) {
            const models = collection.all();
            if (models.length === 0) continue;

            // Get the first model to access the relation definition
            const firstModel = models[0];
            if (!firstModel) continue;

            // Check if relation method exists
            const relationMethod = (firstModel as Record<string, unknown>)[relationName];
            if (typeof relationMethod !== 'function') continue;

            // Get relation instance
            const relation = relationMethod.call(firstModel) as {
                constructor: { name: string };
                foreignKey: string;
                ownerKey: string;
                getBaseQuery: () => QueryBuilder;
            };
            const relationType = relation.constructor.name;

            if (relationType === 'HasMany') {
                // Collect parent IDs
                const parentIds = models
                    .map((m: T): WhereClauseValue => (m as Record<string, unknown>).id as WhereClauseValue)
                    .filter((id): id is NonNullable<WhereClauseValue> => id !== null && id !== undefined);

                if (parentIds.length === 0) continue;

                // Fetch all related models
                const relatedModels = await relation
                    .getBaseQuery()
                    .whereIn(relation.foreignKey, parentIds)
                    .get();

                // Group by foreign key and assign
                for (const model of models) {
                    const related = relatedModels.filter((r: ModelInstance): boolean => {
                        const fkValue = (r as Record<string, unknown>)[relation.foreignKey];
                        const modelId = (model as Record<string, unknown>).id;
                        return fkValue === modelId;
                    });
                    if (model.setRelation) {
                        model.setRelation(relationName, new Collection([...related]));
                    }
                }
            } else if (relationType === 'BelongsTo') {
                // Collect foreign key values
                const foreignKeyValues = models
                    .map((m: T): WhereClauseValue =>
                        (m as Record<string, unknown>)[relation.foreignKey] as WhereClauseValue
                    )
                    .filter((val): val is NonNullable<WhereClauseValue> => val !== null && val !== undefined);

                if (foreignKeyValues.length === 0) continue;

                // Fetch all parent models
                const parentModels = await relation
                    .getBaseQuery()
                    .whereIn(relation.ownerKey, foreignKeyValues)
                    .get();

                // Assign to each model
                for (const model of models) {
                    const fkValue = (model as Record<string, unknown>)[relation.foreignKey];
                    const parent = parentModels.all().find((p: ModelInstance): boolean => {
                        const ownerValue = (p as Record<string, unknown>)[relation.ownerKey];
                        return ownerValue === fkValue;
                    });
                    if (model.setRelation) {
                        model.setRelation(relationName, parent ?? null);
                    }
                }
            }
        }
    }

    /**
     * Execute the query and return the first result.
     *
     * @template T - The type of item to return
     * @returns Promise of first result or undefined
     */
    async first<T extends ModelInstance = TModel>(): Promise<T | undefined> {
        const results = await this.limit(1).get<T>();
        return results.first();
    }

    /**
     * Insert a new record into the database.
     *
     * @param values - Record of values to insert
     * @returns Promise of execution result
     *
     * @example
     * ```typescript
     * await builder.table('users').insert({ name: 'Alice', email: 'alice@example.com' });
     * ```
     */
    async insert(values: MutationValues): Promise<StatementExecutionResult> {
        const sql = this.grammar.compileInsert(this, values);
        const bindings = Object.values(values);

        return this.connection.run(sql, bindings);
    }

    /**
     * Update records in the database.
     *
     * @param values - Record of values to update
     * @returns Promise of execution result
     *
     * @example
     * ```typescript
     * await builder.table('users').where('id', 1).update({ name: 'Bob' });
     * ```
     */
    async update(values: MutationValues): Promise<StatementExecutionResult> {
        const sql = this.grammar.compileUpdate(this, values);
        const updateBindings = Object.values(values);
        // Bindings = update values + where bindings
        const bindings = [...updateBindings, ...this.bindings];

        return this.connection.run(sql, bindings);
    }

    /**
     * Delete records from the database.
     *
     * @returns Promise of execution result
     *
     * @example
     * ```typescript
     * await builder.table('users').where('active', false).delete();
     * ```
     */
    async delete(): Promise<StatementExecutionResult> {
        const sql = this.grammar.compileDelete(this);
        return this.connection.run(sql, this.bindings);
    }

    /**
     * Paginate results.
     *
     * @template T - The type of items in pagination result
     * @param perPage - Items per page (default: 15)
     * @param page - Page number (default: 1)
     * @returns Promise of pagination result
     *
     * @example
     * ```typescript
     * const result = await User.query().paginate(20, 2);
     * console.log(`Page ${result.currentPage} of ${result.lastPage}`);
     * ```
     */
    async paginate<T extends ModelInstance = TModel>(
        perPage: number = 15,
        page: number = 1
    ): Promise<PaginationResult<T>> {
        // Get total count
        const countQuery = new QueryBuilder<T>(this.connection);
        countQuery.from(this.fromTable);
        countQuery.wheres = [...this.wheres];
        countQuery.bindings = [...this.bindings];

        const total = await countQuery.count();

        // Get page data
        const offset = (page - 1) * perPage;
        const items = await this.limit(perPage).offset(offset).get<T>();

        const from = offset + 1;
        const to = Math.min(offset + perPage, total);

        return {
            data: items.all(),
            currentPage: page,
            perPage,
            total,
            lastPage: Math.ceil(total / perPage),
            from,
            to,
        };
    }

    /**
     * Process results in chunks.
     *
     * @template T - The type of items to process
     * @param size - Chunk size
     * @param callback - Function to process each chunk
     * @returns Promise that resolves when all chunks are processed
     *
     * @example
     * ```typescript
     * await User.query().chunk(100, async (users) => {
     *     await processUsers(users);
     * });
     * ```
     */
    async chunk<T extends ModelInstance = TModel>(
        size: number,
        callback: (items: Collection<T>) => void | Promise<void>
    ): Promise<void> {
        let page = 1;

        while (true) {
            const result = await this.paginate<T>(size, page);

            if (result.data.length === 0) {
                break;
            }

            await callback(new Collection(result.data));

            if (page >= result.lastPage) {
                break;
            }

            page++;
        }
    }

    /**
     * Get the count of records matching the query.
     *
     * @returns Promise of count
     *
     * @example
     * ```typescript
     * const activeUsers = await User.query().where('active', true).count();
     * ```
     */
    async count(): Promise<number> {
        const original = this.columns;
        this.columns = ['COUNT(*) as count'];

        const sql = this.toSql();
        const result = await this.connection.query<{ count: number }>(sql, this.bindings);

        this.columns = original;

        const firstRow = result[0];
        return firstRow?.count ?? 0;
    }
}
