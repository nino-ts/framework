/**
 * Query Builder - Enhanced with Advanced Where Clauses, Grouping, and More.
 *
 * Extended QueryBuilder class with comprehensive SQL building capabilities
 * including between clauses, date filters, column comparisons, grouping,
 * and exists checks.
 *
 * @packageDocumentation
 */
import { Collection } from "./collection";
import { Grammar } from "./grammar";
import type { BooleanOperator, DatabaseRow, JoinClause, ModelConstructor, ModelInstance, MutationValues, Operator, OrderClause, PaginationResult, StatementExecutionResult, WhereClause, WhereClauseValue } from "./types";
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
    query<T = DatabaseRow>(sql: string, bindings: readonly WhereClauseValue[]): Promise<T[]>;
    /**
     * Execute an INSERT, UPDATE, or DELETE query.
     *
     * @param sql - The SQL query string
     * @param bindings - Array of parameter bindings
     * @returns Promise of execution result
     */
    run(sql: string, bindings: readonly WhereClauseValue[]): Promise<StatementExecutionResult>;
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
export declare class QueryBuilder<TModel extends ModelInstance = ModelInstance> {
    /**
     * Columns to select.
     */
    columns: string[];
    /**
     * Table to query from.
     */
    fromTable: string;
    /**
     * WHERE clauses.
     */
    wheres: WhereClause[];
    /**
     * ORDER BY clauses.
     */
    orders: OrderClause[];
    /**
     * LIMIT value.
     */
    limitValue?: number;
    /**
     * OFFSET value.
     */
    offsetValue?: number;
    /**
     * JOIN clauses.
     */
    joins: JoinClause[];
    /**
     * Query parameter bindings.
     */
    bindings: WhereClauseValue[];
    /**
     * Relations to eager load.
     */
    eagerRelations: string[];
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
    readonly connection: Connector;
    /**
     * GROUP BY columns.
     */
    groups: string[];
    /**
     * HAVING clauses.
     */
    havings: Array<{
        type: "Basic" | "Null";
        column?: string;
        operator?: Operator;
        value?: WhereClauseValue;
        boolean: BooleanOperator;
    }>;
    /**
     * Whether to use DISTINCT.
     */
    useDistinct: boolean;
    /**
     * Creates a new QueryBuilder instance.
     *
     * @param connection - Database connector
     * @param grammar - SQL grammar (defaults to generic Grammar)
     */
    constructor(connection: Connector, grammar?: Grammar);
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
    select(...columns: readonly string[]): this;
    /**
     * Add a new column to be selected.
     *
     * @param column - Column name
     * @returns This query builder for chaining
     */
    addSelect(column: string): this;
    /**
     * Set the table to query from.
     *
     * @param table - Name of the table
     * @returns This query builder for chaining
     */
    table(table: string): this;
    /**
     * Alias for table().
     *
     * @param table - Name of the table
     * @returns This query builder for chaining
     */
    from(table: string): this;
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
    where(column: string | Record<string, WhereClauseValue>, operator?: Operator | WhereClauseValue, value?: WhereClauseValue, boolean?: BooleanOperator): this;
    /**
     * Add an OR WHERE clause to the query.
     *
     * @param column - Column name
     * @param operator - Operator or value
     * @param value - Value (optional)
     * @returns This query builder for chaining
     */
    orWhere(column: string, operator?: Operator | WhereClauseValue, value?: WhereClauseValue): this;
    /**
     * Add a WHERE NULL clause to the query.
     *
     * @param column - Column name
     * @param boolean - Boolean operator ('and' or 'or')
     * @returns This query builder for chaining
     */
    whereNull(column: string, boolean?: BooleanOperator): this;
    /**
     * Add a WHERE NOT NULL clause to the query.
     *
     * @param column - Column name
     * @param boolean - Boolean operator ('and' or 'or')
     * @returns This query builder for chaining
     */
    whereNotNull(column: string, boolean?: BooleanOperator): this;
    /**
     * Add an OR WHERE NULL clause to the query.
     *
     * @param column - Column name
     * @returns This query builder for chaining
     */
    orWhereNull(column: string): this;
    /**
     * Add an OR WHERE NOT NULL clause to the query.
     *
     * @param column - Column name
     * @returns This query builder for chaining
     */
    orWhereNotNull(column: string): this;
    /**
     * Add a WHERE IN clause to the query.
     *
     * @param column - Column name
     * @param values - Array of values
     * @param boolean - Boolean operator ('and' or 'or')
     * @param not - Whether this is a NOT IN clause
     * @returns This query builder for chaining
     *
     * @example
     * ```typescript
     * builder.whereIn('status', ['active', 'pending']);
     * ```
     */
    whereIn(column: string, values: readonly WhereClauseValue[], boolean?: BooleanOperator, not?: boolean): this;
    /**
     * Add a WHERE NOT IN clause to the query.
     *
     * @param column - Column name
     * @param values - Array of values
     * @param boolean - Boolean operator ('and' or 'or')
     * @returns This query builder for chaining
     */
    whereNotIn(column: string, values: readonly WhereClauseValue[], boolean?: BooleanOperator): this;
    /**
     * Add an OR WHERE IN clause to the query.
     *
     * @param column - Column name
     * @param values - Array of values
     * @returns This query builder for chaining
     */
    orWhereIn(column: string, values: readonly WhereClauseValue[]): this;
    /**
     * Add an OR WHERE NOT IN clause to the query.
     *
     * @param column - Column name
     * @param values - Array of values
     * @returns This query builder for chaining
     */
    orWhereNotIn(column: string, values: readonly WhereClauseValue[]): this;
    /**
     * Add a WHERE BETWEEN clause to the query.
     *
     * @param column - Column name
     * @param min - Minimum value
     * @param max - Maximum value
     * @param boolean - Boolean operator ('and' or 'or')
     * @param not - Whether this is a NOT BETWEEN clause
     * @returns This query builder for chaining
     *
     * @example
     * ```typescript
     * builder.whereBetween('age', 18, 65);
     * ```
     */
    whereBetween(column: string, min: WhereClauseValue, max: WhereClauseValue, boolean?: BooleanOperator, not?: boolean): this;
    /**
     * Add a WHERE NOT BETWEEN clause to the query.
     *
     * @param column - Column name
     * @param min - Minimum value
     * @param max - Maximum value
     * @param boolean - Boolean operator ('and' or 'or')
     * @returns This query builder for chaining
     */
    whereNotBetween(column: string, min: WhereClauseValue, max: WhereClauseValue, boolean?: BooleanOperator): this;
    /**
     * Add an OR WHERE BETWEEN clause to the query.
     *
     * @param column - Column name
     * @param min - Minimum value
     * @param max - Maximum value
     * @returns This query builder for chaining
     */
    orWhereBetween(column: string, min: WhereClauseValue, max: WhereClauseValue): this;
    /**
     * Add an OR WHERE NOT BETWEEN clause to the query.
     *
     * @param column - Column name
     * @param min - Minimum value
     * @param max - Maximum value
     * @returns This query builder for chaining
     */
    orWhereNotBetween(column: string, min: WhereClauseValue, max: WhereClauseValue): this;
    /**
     * Add a WHERE DATE clause to the query.
     *
     * @param column - Column name
     * @param operator - Operator
     * @param value - Date value
     * @param boolean - Boolean operator ('and' or 'or')
     * @returns This query builder for chaining
     *
     * @example
     * ```typescript
     * builder.whereDate('created_at', '=', '2024-01-15');
     * ```
     */
    whereDate(column: string, operator: Operator | WhereClauseValue, value?: WhereClauseValue, boolean?: BooleanOperator): this;
    /**
     * Add a WHERE YEAR clause to the query.
     *
     * @param column - Column name
     * @param operator - Operator
     * @param value - Year value
     * @param boolean - Boolean operator ('and' or 'or')
     * @returns This query builder for chaining
     */
    whereYear(column: string, operator: Operator | WhereClauseValue, value?: WhereClauseValue, boolean?: BooleanOperator): this;
    /**
     * Add a WHERE MONTH clause to the query.
     *
     * @param column - Column name
     * @param operator - Operator
     * @param value - Month value
     * @param boolean - Boolean operator ('and' or 'or')
     * @returns This query builder for chaining
     */
    whereMonth(column: string, operator: Operator | WhereClauseValue, value?: WhereClauseValue, boolean?: BooleanOperator): this;
    /**
     * Add a WHERE DAY clause to the query.
     *
     * @param column - Column name
     * @param operator - Operator
     * @param value - Day value
     * @param boolean - Boolean operator ('and' or 'or')
     * @returns This query builder for chaining
     */
    whereDay(column: string, operator: Operator | WhereClauseValue, value?: WhereClauseValue, boolean?: BooleanOperator): this;
    /**
     * Add a WHERE COLUMN clause to the query (column to column comparison).
     *
     * @param first - First column name
     * @param operator - Operator
     * @param second - Second column name
     * @param boolean - Boolean operator ('and' or 'or')
     * @returns This query builder for chaining
     *
     * @example
     * ```typescript
     * builder.whereColumn('users.created_at', '=', 'posts.published_at');
     * ```
     */
    whereColumn(first: string, operator: Operator, second: string, boolean?: BooleanOperator): this;
    /**
     * Add an OR WHERE COLUMN clause to the query.
     *
     * @param first - First column name
     * @param operator - Operator
     * @param second - Second column name
     * @returns This query builder for chaining
     */
    orWhereColumn(first: string, operator: Operator, second: string): this;
    /**
     * Add a WHERE EXISTS clause to the query.
     *
     * @param callback - Callback that builds the subquery
     * @param boolean - Boolean operator ('and' or 'or')
     * @param not - Whether this is a NOT EXISTS clause
     * @returns This query builder for chaining
     *
     * @example
     * ```typescript
     * builder.whereExists((query) => {
     *     query.select('id').from('posts').whereColumn('users.id', '=', 'posts.user_id');
     * });
     * ```
     */
    whereExists(callback: (query: QueryBuilder<TModel>) => void, boolean?: BooleanOperator, not?: boolean): this;
    /**
     * Add a WHERE NOT EXISTS clause to the query.
     *
     * @param callback - Callback that builds the subquery
     * @param boolean - Boolean operator ('and' or 'or')
     * @returns This query builder for chaining
     */
    whereNotExists(callback: (query: QueryBuilder<TModel>) => void, boolean?: BooleanOperator): this;
    /**
     * Add an OR WHERE EXISTS clause to the query.
     *
     * @param callback - Callback that builds the subquery
     * @returns This query builder for chaining
     */
    orWhereExists(callback: (query: QueryBuilder<TModel>) => void): this;
    /**
     * Add an OR WHERE NOT EXISTS clause to the query.
     *
     * @param callback - Callback that builds the subquery
     * @returns This query builder for chaining
     */
    orWhereNotExists(callback: (query: QueryBuilder<TModel>) => void): this;
    /**
     * Add an ORDER BY clause to the query.
     *
     * @param column - Column name
     * @param direction - Sort direction ('asc' or 'desc')
     * @returns This query builder for chaining
     */
    orderBy(column: string, direction?: "asc" | "desc"): this;
    /**
     * Add an ORDER BY DESC clause to the query.
     *
     * @param column - Column name
     * @returns This query builder for chaining
     */
    orderByDesc(column: string): this;
    /**
     * Set the limit for the query results.
     *
     * @param value - Number of records to return
     * @returns This query builder for chaining
     */
    limit(value: number): this;
    /**
     * Set the offset for the query results.
     *
     * @param value - Number of records to skip
     * @returns This query builder for chaining
     */
    offset(value: number): this;
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
    join(table: string, first: string, operator: string, second: string, type?: "inner" | "left" | "right" | "cross"): this;
    /**
     * Add a LEFT JOIN clause to the query.
     *
     * @param table - Table to join
     * @param first - Column on the first table
     * @param operator - Operator
     * @param second - Column on the second table
     * @returns This query builder for chaining
     */
    leftJoin(table: string, first: string, operator: string, second: string): this;
    /**
     * Add a RIGHT JOIN clause to the query.
     *
     * @param table - Table to join
     * @param first - Column on the first table
     * @param operator - Operator
     * @param second - Column on the second table
     * @returns This query builder for chaining
     */
    rightJoin(table: string, first: string, operator: string, second: string): this;
    /**
     * Add a CROSS JOIN clause to the query.
     *
     * @param table - Table to join
     * @returns This query builder for chaining
     */
    crossJoin(table: string): this;
    /**
     * Set the GROUP BY clause.
     *
     * @param columns - Columns to group by
     * @returns This query builder for chaining
     *
     * @example
     * ```typescript
     * builder.groupBy('department');
     * builder.groupBy('department', 'role');
     * ```
     */
    groupBy(...columns: readonly string[]): this;
    /**
     * Add a HAVING clause to the query.
     *
     * @param column - Column name
     * @param operator - Operator
     * @param value - Value to compare against
     * @param boolean - Boolean operator ('and' or 'or')
     * @returns This query builder for chaining
     *
     * @example
     * ```typescript
     * builder.having('count', '>', 5);
     * ```
     */
    having(column: string, operator?: Operator | WhereClauseValue, value?: WhereClauseValue, boolean?: BooleanOperator): this;
    /**
     * Add an OR HAVING clause to the query.
     *
     * @param column - Column name
     * @param operator - Operator or value
     * @param value - Value (optional)
     * @returns This query builder for chaining
     */
    orHaving(column: string, operator?: Operator | WhereClauseValue, value?: WhereClauseValue): this;
    /**
     * Set DISTINCT on the query.
     *
     * @param value - Whether to use distinct (default: true)
     * @returns This query builder for chaining
     *
     * @example
     * ```typescript
     * builder.distinct();
     * builder.distinct(true);
     * ```
     */
    distinct(value?: boolean): this;
    /**
     * Apply a callback to the query when a given condition is truthy.
     *
     * @template V - The type of the condition value
     * @param condition - The condition to evaluate
     * @param callback - Callback to apply when condition is truthy
     * @param fallback - Optional callback when condition is falsy
     * @returns This query builder for chaining
     *
     * @example
     * ```typescript
     * const users = await User.query()
     *   .when(searchTerm, (q, term) => q.where('name', 'like', `%${term}%`))
     *   .when(isAdmin, (q) => q.where('role', 'admin'))
     *   .get();
     * ```
     */
    when<V>(condition: V | null | undefined | false | 0 | "", callback: (builder: this, value: NonNullable<V>) => this, fallback?: (builder: this) => this): this;
    /**
     * Apply a callback to the query when a given condition is falsy.
     * Inverse of `when()`.
     *
     * @template V - The type of the condition value
     * @param condition - The condition to evaluate
     * @param callback - Callback to apply when condition is falsy
     * @param fallback - Optional callback when condition is truthy
     * @returns This query builder for chaining
     */
    unless<V>(condition: V | null | undefined | false | 0 | "", callback: (builder: this) => this, fallback?: (builder: this) => this): this;
    /**
     * Compile the current query into SQL.
     *
     * @returns SQL query string
     */
    toSql(): string;
    /**
     * Get the current query bindings.
     *
     * @returns Array of query bindings
     */
    getBindings(): readonly WhereClauseValue[];
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
    get<T extends ModelInstance = TModel>(): Promise<Collection<T>>;
    /**
     * Set the model class for hydration.
     *
     * @param model - Model constructor
     * @returns This query builder for chaining
     */
    setModel(model: ModelConstructor<TModel>): this;
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
    with(...relations: readonly string[]): this;
    /**
     * Eager load relations on a collection of models.
     *
     * @template T - Model type
     * @param collection - Collection of models
     */
    protected eagerLoadRelations<T extends ModelInstance>(collection: Collection<T>): Promise<void>;
    /**
     * Execute the query and return the first result.
     *
     * @template T - The type of item to return
     * @returns Promise of first result or null
     */
    first<T extends ModelInstance = TModel>(): Promise<T | null>;
    /**
     * Execute the query and return the first result or throw.
     *
     * @template T - The type of item to return
     * @returns Promise of first result
     * @throws Error if no result found
     */
    firstOrFail<T extends ModelInstance = TModel>(): Promise<T>;
    /**
     * Get a single column value from the first result.
     *
     * @param column - Column name
     * @returns Promise of column value or null
     */
    value(column: string): Promise<WhereClauseValue | null>;
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
    insert(values: MutationValues): Promise<StatementExecutionResult>;
    /**
     * Insert multiple records into the database.
     *
     * @param values - Array of records to insert
     * @returns Promise of execution result
     */
    insertMany(values: MutationValues[]): Promise<StatementExecutionResult>;
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
    update(values: MutationValues): Promise<StatementExecutionResult>;
    /**
     * Increment a column's value.
     *
     * @param column - Column to increment
     * @param amount - Amount to increment by
     * @param extra - Extra attributes to update
     * @returns Promise of execution result
     */
    increment(column: string, amount?: number, extra?: MutationValues): Promise<StatementExecutionResult>;
    /**
     * Decrement a column's value.
     *
     * @param column - Column to decrement
     * @param amount - Amount to decrement by
     * @param extra - Extra attributes to update
     * @returns Promise of execution result
     */
    decrement(column: string, amount?: number, extra?: MutationValues): Promise<StatementExecutionResult>;
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
    delete(): Promise<StatementExecutionResult>;
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
    paginate<T extends ModelInstance = TModel>(perPage?: number, page?: number): Promise<PaginationResult<T>>;
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
    chunk<T extends ModelInstance = TModel>(size: number, callback: (items: Collection<T>) => void | Promise<void>): Promise<void>;
    /**
     * Get the count of records matching the query.
     *
     * @param column - Column to count (default: '*')
     * @returns Promise of count
     *
     * @example
     * ```typescript
     * const activeUsers = await User.query().where('active', true).count();
     * ```
     */
    count(column?: string): Promise<number>;
    /**
     * Get the minimum value of a column.
     *
     * @param column - Column name
     * @returns Promise of minimum value
     */
    min(column: string): Promise<number | null>;
    /**
     * Get the maximum value of a column.
     *
     * @param column - Column name
     * @returns Promise of maximum value
     */
    max(column: string): Promise<number | null>;
    /**
     * Get the sum of a column.
     *
     * @param column - Column name
     * @returns Promise of sum
     */
    sum(column: string): Promise<number | null>;
    /**
     * Get the average value of a column.
     *
     * @param column - Column name
     * @returns Promise of average
     */
    avg(column: string): Promise<number | null>;
    /**
     * Execute the query and return all results as an array.
     *
     * @template T - The type of items to return
     * @returns Promise of array
     */
    pluck<T extends ModelInstance = TModel>(column: string): Promise<Collection<unknown>>;
    /**
     * Determine if any records exist matching the query.
     *
     * @returns Promise of boolean
     */
    exists(): Promise<boolean>;
    /**
     * Determine if no records exist matching the query.
     *
     * @returns Promise of boolean
     */
    doesntExist(): Promise<boolean>;
}
