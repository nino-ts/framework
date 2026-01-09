export class Grammar {
    protected selectComponents: string[] = [
        'aggregate',
        'columns',
        'from',
        'joins',
        'wheres',
        'groups',
        'havings',
        'orders',
        'limit',
        'offset',
        'lock',
    ];

    compileSelect(query: any): string {
        // Se não houver colunas, assume *
        const originalColumns = query.columns;

        if (!query.columns || query.columns.length === 0) {
            query.columns = ['*'];
        }

        let sql = this.compileComponents(query);

        // Restaura colunas originais
        query.columns = originalColumns;

        return sql;
    }

    compileInsert(query: any, values: Record<string, any>): string {
        const table = this.wrapTable(query.fromTable);
        const columns = Object.keys(values).map(column => this.wrap(column));
        const parameters = Object.keys(values).map(() => '?');

        return `INSERT INTO ${table} (${columns.join(', ')}) VALUES (${parameters.join(', ')})`;
    }

    compileUpdate(query: any, values: Record<string, any>): string {
        const table = this.wrapTable(query.fromTable);
        const columns = Object.keys(values).map(key => `${this.wrap(key)} = ?`).join(', ');
        const where = this.compileWheres(query);

        return `UPDATE ${table} SET ${columns} ${where}`.trim();
    }

    compileDelete(query: any): string {
        const table = this.wrapTable(query.fromTable);
        const where = this.compileWheres(query);

        return `DELETE FROM ${table} ${where}`.trim();
    }

    protected compileComponents(query: any): string {
        const sql: string[] = [];

        for (const component of this.selectComponents) {
            const method = `compile${component.charAt(0).toUpperCase() + component.slice(1)}`;
            if ((this as any)[method]) {
                const part = (this as any)[method](query);
                if (part) sql.push(part);
            }
        }

        return sql.join(' ');
    }

    protected compileColumns(query: any): string {
        if (!query.columns || query.columns.length === 0) return 'SELECT *';
        return `SELECT ${query.columns.map((column: string) => this.wrap(column)).join(', ')}`;
    }

    protected compileFrom(query: any): string | null {
        if (!query.fromTable) return null;
        return `FROM ${this.wrapTable(query.fromTable)}`;
    }

    protected compileWheres(query: any): string | null {
        const wheres = query.wheres;
        if (!wheres || wheres.length === 0) return null;

        const sql = wheres.map((where: any) => {
            const boolean = where.boolean ? where.boolean.toUpperCase() : 'AND';
            return `${boolean} ${this.whereToString(where)}`;
        }).join(' ');

        return `WHERE ${sql.replace(/^(AND|OR) /, '')}`;
    }

    protected whereToString(where: any): string {
        if (where.type === 'Basic') {
            return `${this.wrap(where.column)} ${where.operator} ?`;
        }
        if (where.type === 'Null') {
            return `${this.wrap(where.column)} IS NULL`;
        }
        if (where.type === 'NotNull') {
            return `${this.wrap(where.column)} IS NOT NULL`;
        }
        if (where.type === 'In') {
            const placeholders = where.values.map(() => '?').join(', ');
            return `${this.wrap(where.column)} IN (${placeholders})`;
        }
        return '';
    }

    protected compileOrders(query: any): string | null {
        const orders = query.orders;
        if (!orders || orders.length === 0) return null;
        return 'ORDER BY ' + orders.map((order: any) => `${this.wrap(order.column)} ${order.direction.toUpperCase()}`).join(', ');
    }

    protected compileLimit(query: any): string | null {
        if (query.limitValue === undefined || query.limitValue === null) return null;
        return `LIMIT ${query.limitValue}`;
    }

    protected compileOffset(query: any): string | null {
        if (query.offsetValue === undefined || query.offsetValue === null) return null;
        return `OFFSET ${query.offsetValue}`;
    }

    protected compileJoins(query: any): string | null {
        const joins = query.joins;
        if (!joins || joins.length === 0) return null;

        return joins.map((join: any) => {
            const type = join.type === 'inner' ? 'INNER' : join.type.toUpperCase();
            return `${type} JOIN ${this.wrapTable(join.table)} ON ${this.wrap(join.first)} ${join.operator} ${this.wrap(join.second)}`;
        }).join(' ');
    }

    wrap(value: string): string {
        if (value === '*') return value;
        return value;
    }

    wrapTable(table: string): string {
        return this.wrap(table);
    }
}
