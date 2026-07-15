import type { MutationValues, QueryState, WhereClause } from "./types";
/**
 * Component name for SQL compilation.
 */
type SelectComponent = "aggregate" | "columns" | "from" | "joins" | "wheres" | "groups" | "havings" | "orders" | "limit" | "offset" | "lock";
/**
 * The Grammar class is responsible for compiling QueryBuilder components into SQL strings.
 * It handles the differences between SQL dialects (currently focused on standard SQL).
 *
 * @example
 * ```typescript
 * const grammar = new Grammar();
 * const sql = grammar.compileSelect(queryState);
 * ```
 */
export declare class Grammar {
    protected selectComponents: readonly SelectComponent[];
    /**
     * Compile a SELECT query into SQL.
     *
     * @param query - QueryBuilder state
     * @returns Compiled SQL string
     *
     * @example
     * ```typescript
     * const sql = grammar.compileSelect({
     *     columns: ['id', 'name'],
     *     fromTable: 'users',
     *     wheres: [],
     *     orders: []
     * });
     * ```
     */
    compileSelect(query: QueryState): string;
    /**
     * Compile an INSERT query into SQL.
     *
     * @param query - QueryBuilder state
     * @param values - Values to insert
     * @returns Compiled SQL string
     *
     * @example
     * ```typescript
     * const sql = grammar.compileInsert(query, { name: 'John', email: 'john@example.com' });
     * ```
     */
    compileInsert(query: QueryState, values: MutationValues): string;
    /**
     * Compile an UPDATE query into SQL.
     *
     * @param query - QueryBuilder state
     * @param values - Values to update
     * @returns Compiled SQL string
     *
     * @example
     * ```typescript
     * const sql = grammar.compileUpdate(query, { name: 'Jane' });
     * ```
     */
    compileUpdate(query: QueryState, values: MutationValues): string;
    /**
     * Compile a DELETE query into SQL.
     *
     * @param query - QueryBuilder state
     * @returns Compiled SQL string
     *
     * @example
     * ```typescript
     * const sql = grammar.compileDelete(query);
     * ```
     */
    compileDelete(query: QueryState): string;
    /**
     * Compile all SELECT components into SQL.
     *
     * @param query - QueryBuilder state
     * @returns Compiled SQL string
     */
    protected compileComponents(query: QueryState): string;
    /**
     * Compile the columns portion of the query.
     *
     * @param query - QueryBuilder state
     * @returns Compiled columns clause
     */
    protected compileColumns(query: QueryState): string;
    /**
     * Compile the FROM portion of the query.
     *
     * @param query - QueryBuilder state
     * @returns Compiled FROM clause or null
     */
    protected compileFrom(query: QueryState): string | null;
    /**
     * Compile the WHERE portion of the query.
     *
     * @param query - QueryBuilder state
     * @returns Compiled WHERE clause or null
     */
    protected compileWheres(query: QueryState): string | null;
    /**
     * Convert a WhereClause to SQL string.
     *
     * @param where - WhereClause to convert
     * @returns SQL string representation
     */
    protected whereToString(where: WhereClause): string;
    /**
     * Compile the ORDER BY portion of the query.
     *
     * @param query - QueryBuilder state
     * @returns Compiled ORDER BY clause or null
     */
    protected compileOrders(query: QueryState): string | null;
    /**
     * Compile the LIMIT portion of the query.
     *
     * @param query - QueryBuilder state
     * @returns Compiled LIMIT clause or null
     */
    protected compileLimit(query: QueryState): string | null;
    /**
     * Compile the OFFSET portion of the query.
     *
     * @param query - QueryBuilder state
     * @returns Compiled OFFSET clause or null
     */
    protected compileOffset(query: QueryState): string | null;
    /**
     * Compile the JOIN portion of the query.
     *
     * @param query - QueryBuilder state
     * @returns Compiled JOIN clauses or null
     */
    protected compileJoins(query: QueryState): string | null;
    /**
     * Wrap a value in keyword identifiers.
     * @param value Value to wrap
     */
    wrap(value: string): string;
    /**
     * Wrap a table in identifiers.
     * @param table Table to wrap
     */
    wrapTable(table: string): string;
}
export {};
