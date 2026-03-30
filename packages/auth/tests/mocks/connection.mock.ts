/**
 * MemoryConnection - Implementação fake de ConnectionInterface para testes.
 *
 * Simula operações de banco de dados em memória usando Map.
 * Suporta operações SQL básicas: CREATE TABLE, INSERT, SELECT, UPDATE, DELETE.
 *
 * @packageDocumentation
 */

import type { ConnectionInterface } from '@/contracts/connection-interface.ts';

/**
 * Representa uma tabela na memória.
 */
interface Table {
  columns: Set<string>;
  rows: Record<string, unknown>[];
}

/**
 * MemoryConnection - Fake database connection for testing.
 *
 * @example
 * ```typescript
 * const conn = new MemoryConnection();
 * await conn.execute('CREATE TABLE users (id, email, name)');
 * await conn.query('INSERT INTO users (id, email, name) VALUES (?, ?, ?)', [1, 'test@example.com', 'Test']);
 * const results = await conn.query('SELECT * FROM users WHERE id = ?', [1]);
 * ```
 */
export class MemoryConnection implements ConnectionInterface {
  private tables: Map<string, Table> = new Map();

  /**
   * Executa uma query SQL e retorna os resultados.
   *
   * @param sql - A query SQL a ser executada
   * @param params - Parâmetros opcionais para a query
   * @returns Array de registros retornados pela query
   */
  async query(sql: string, params?: unknown[]): Promise<Record<string, unknown>[]> {
    const normalizedSql = sql.trim().toUpperCase();

    if (normalizedSql.startsWith('SELECT')) {
      return this.handleSelect(sql, params);
    }

    if (normalizedSql.startsWith('INSERT')) {
      return this.handleInsert(sql, params);
    }

    if (normalizedSql.startsWith('UPDATE')) {
      return this.handleUpdate(sql, params);
    }

    if (normalizedSql.startsWith('DELETE')) {
      return this.handleDelete(sql, params);
    }

    return [];
  }

  /**
   * Executa comandos SQL que não retornam resultados (DDL).
   *
   * @param sql - O comando SQL a ser executado
   */
  async execute(sql: string): Promise<void> {
    const normalizedSql = sql.trim().toUpperCase();

    if (normalizedSql.startsWith('CREATE TABLE')) {
      this.handleCreateTable(sql);
      return;
    }

    if (normalizedSql.startsWith('DROP TABLE')) {
      this.handleDropTable(sql);
      return;
    }

    if (normalizedSql.startsWith('TRUNCATE')) {
      this.handleTruncate(sql);
      return;
    }
  }

  /**
   * Handle CREATE TABLE statement.
   *
   * @param sql - CREATE TABLE statement
   */
  private handleCreateTable(sql: string): void {
    // Parse: CREATE TABLE table_name (col1, col2, col3)
    const match = sql.match(/CREATE\s+TABLE\s+(\w+)\s*\(([^)]+)\)/i);
    if (!match?.[1] || !match[2]) {
      throw new Error(`Invalid CREATE TABLE syntax: ${sql}`);
    }

    const tableName = match[1].toLowerCase();
    const columnsStr = match[2];

    // Parse columns (simple split by comma, trim whitespace)
    const columns = columnsStr.split(',').map((col) => col.trim().toLowerCase());

    this.tables.set(tableName, {
      columns: new Set(columns),
      rows: [],
    });
  }

  /**
   * Handle DROP TABLE statement.
   *
   * @param sql - DROP TABLE statement
   */
  private handleDropTable(sql: string): void {
    // Parse: DROP TABLE table_name
    const match = sql.match(/DROP\s+TABLE\s+(\w+)/i);
    if (!match?.[1]) {
      throw new Error(`Invalid DROP TABLE syntax: ${sql}`);
    }

    const tableName = match[1].toLowerCase();
    this.tables.delete(tableName);
  }

  /**
   * Handle TRUNCATE statement.
   *
   * @param sql - TRUNCATE statement
   */
  private handleTruncate(sql: string): void {
    // Parse: TRUNCATE TABLE table_name or TRUNCATE table_name
    const match = sql.match(/TRUNCATE\s+(?:TABLE\s+)?(\w+)/i);
    if (!match?.[1]) {
      throw new Error(`Invalid TRUNCATE syntax: ${sql}`);
    }

    const tableName = match[1].toLowerCase();
    const table = this.tables.get(tableName);
    if (table) {
      table.rows = [];
    }
  }

  /**
   * Handle SELECT statement.
   *
   * @param sql - SELECT statement
   * @param params - Query parameters
   * @returns Selected rows
   */
  private handleSelect(sql: string, params?: unknown[]): Record<string, unknown>[] {
    // Parse: SELECT * FROM table_name WHERE col = ?
    const selectMatch = sql.match(/SELECT\s+([^;]+)\s+FROM\s+(\w+)(?:\s+WHERE\s+(.+))?/i);
    if (!selectMatch?.[2]) {
      throw new Error(`Invalid SELECT syntax: ${sql}`);
    }

    const tableName = selectMatch[2].toLowerCase();
    const table = this.tables.get(tableName);

    if (!table) {
      throw new Error(`Table not found: ${tableName}`);
    }

    let results = [...table.rows];

    // Handle WHERE clause
    const whereClause = selectMatch[3];
    if (whereClause && params && params.length > 0) {
      results = this.applyWhereClause(results, whereClause, params);
    }

    return results;
  }

  /**
   * Handle INSERT statement.
   *
   * @param sql - INSERT statement
   * @param params - Query parameters
   * @returns Empty array (INSERT doesn't return rows)
   */
  private handleInsert(sql: string, params?: unknown[]): Record<string, unknown>[] {
    // Parse: INSERT INTO table_name (col1, col2) VALUES (?, ?)
    const insertMatch = sql.match(/INSERT\s+INTO\s+(\w+)\s*\(([^)]+)\)\s*VALUES\s*\(([^)]+)\)/i);
    if (!insertMatch?.[1] || !insertMatch[2] || !insertMatch[3]) {
      throw new Error(`Invalid INSERT syntax: ${sql}`);
    }

    const tableName = insertMatch[1].toLowerCase();
    const columnsStr = insertMatch[2];
    const valuesStr = insertMatch[3];

    const table = this.tables.get(tableName);
    if (!table) {
      throw new Error(`Table not found: ${tableName}`);
    }

    const columns = columnsStr.split(',').map((col) => col.trim().toLowerCase());
    const placeholders = valuesStr.split(',').map((p) => p.trim());

    // Build row from params
    const row: Record<string, unknown> = {};
    columns.forEach((col, index) => {
      if (placeholders[index] === '?' && params && params[index] !== undefined) {
        row[col] = params[index];
      } else {
        // Handle literal values (simple case: strings in quotes, numbers)
        const literal = placeholders[index]?.replace(/['"]/g, '') ?? '';
        row[col] = Number.isNaN(Number(literal)) ? literal : Number(literal);
      }
    });

    table.rows.push(row);
    return [];
  }

  /**
   * Handle UPDATE statement.
   *
   * @param sql - UPDATE statement
   * @param params - Query parameters
   * @returns Empty array (UPDATE doesn't return rows)
   */
  private handleUpdate(sql: string, params?: unknown[]): Record<string, unknown>[] {
    // Parse: UPDATE table_name SET col1 = ?, col2 = ? WHERE condition
    const updateMatch = sql.match(/UPDATE\s+(\w+)\s+SET\s+([^;]+?)(?:\s+WHERE\s+(.+))?/i);
    if (!updateMatch?.[1] || !updateMatch[2]) {
      throw new Error(`Invalid UPDATE syntax: ${sql}`);
    }

    const tableName = updateMatch[1].toLowerCase();
    const setClause = updateMatch[2];
    const whereClause = updateMatch[3];

    const table = this.tables.get(tableName);
    if (!table) {
      throw new Error(`Table not found: ${tableName}`);
    }

    // Parse SET clause
    const setPairs = setClause.split(',').map((pair) => pair.trim());
    const setColumns: string[] = [];
    setPairs.forEach((pair) => {
      const eqIndex = pair.indexOf('=');
      if (eqIndex > 0) {
        const col = pair.substring(0, eqIndex).trim().toLowerCase();
        setColumns.push(col);
      }
    });

    // Find rows to update (WHERE clause)
    let rowsToUpdate: Record<string, unknown>[] = table.rows;
    if (whereClause && params && params.length > setColumns.length) {
      const whereParams = params.slice(setColumns.length);
      rowsToUpdate = this.applyWhereClause(table.rows, whereClause, whereParams);
    }

    // Update rows
    rowsToUpdate.forEach((row) => {
      setColumns.forEach((col, index) => {
        if (params && params[index] !== undefined) {
          row[col] = params[index];
        }
      });
    });

    return [];
  }

  /**
   * Handle DELETE statement.
   *
   * @param sql - DELETE statement
   * @param params - Query parameters
   * @returns Empty array (DELETE doesn't return rows)
   */
  private handleDelete(sql: string, params?: unknown[]): Record<string, unknown>[] {
    // Parse: DELETE FROM table_name WHERE condition
    const deleteMatch = sql.match(/DELETE\s+FROM\s+(\w+)(?:\s+WHERE\s+(.+))?/i);
    if (!deleteMatch?.[1]) {
      throw new Error(`Invalid DELETE syntax: ${sql}`);
    }

    const tableName = deleteMatch[1].toLowerCase();
    const whereClause = deleteMatch[2];

    const table = this.tables.get(tableName);
    if (!table) {
      throw new Error(`Table not found: ${tableName}`);
    }

    if (!whereClause) {
      // DELETE without WHERE = truncate
      table.rows = [];
      return [];
    }

    // Filter out rows that match WHERE clause
    if (params && params.length > 0) {
      const matchingIndices: number[] = [];
      table.rows.forEach((row, index) => {
        if (this.matchesWhereClause(row, whereClause, params)) {
          matchingIndices.push(index);
        }
      });

      // Remove matching rows (in reverse order to preserve indices)
      for (let i = matchingIndices.length - 1; i >= 0; i--) {
        const index = matchingIndices[i];
        if (index !== undefined) {
          table.rows.splice(index, 1);
        }
      }
    }

    return [];
  }

  /**
   * Apply WHERE clause to filter rows.
   *
   * @param rows - Rows to filter
   * @param whereClause - WHERE clause (without 'WHERE' keyword)
   * @param params - Query parameters
   * @returns Filtered rows
   */
  private applyWhereClause(
    rows: Record<string, unknown>[],
    whereClause: string,
    params: unknown[],
  ): Record<string, unknown>[] {
    return rows.filter((row) => this.matchesWhereClause(row, whereClause, params));
  }

  /**
   * Check if a row matches the WHERE clause.
   *
   * @param row - Row to check
   * @param whereClause - WHERE clause (without 'WHERE' keyword)
   * @param params - Query parameters
   * @returns True if row matches
   */
  private matchesWhereClause(row: Record<string, unknown>, whereClause: string, params: unknown[]): boolean {
    // Simple WHERE parsing: col = ? AND col2 = ?
    // Split by AND (case insensitive)
    const conditions = whereClause.split(/\s+AND\s+/i);
    let paramIndex = 0;

    for (const condition of conditions) {
      const match = condition.match(/(\w+)\s*=\s*\?/i);
      if (match?.[1]) {
        const col = match[1].toLowerCase();
        const paramValue = params[paramIndex];

        if (row[col] !== paramValue) {
          return false;
        }
        paramIndex++;
      }
    }

    return true;
  }

  /**
   * Get all rows from a table (for testing purposes).
   *
   * @param tableName - Name of the table
   * @returns All rows in the table
   */
  getTableRows(tableName: string): Record<string, unknown>[] {
    const table = this.tables.get(tableName.toLowerCase());
    return table ? [...table.rows] : [];
  }

  /**
   * Check if a table exists.
   *
   * @param tableName - Name of the table
   * @returns True if table exists
   */
  hasTable(tableName: string): boolean {
    return this.tables.has(tableName.toLowerCase());
  }

  /**
   * Clear all tables (for test cleanup).
   */
  clear(): void {
    this.tables.clear();
  }
}

/**
 * Factory function to create a MemoryConnection instance.
 *
 * @returns A new MemoryConnection instance
 */
export function createMemoryConnection(): MemoryConnection {
  return new MemoryConnection();
}
