export interface ConnectionConfig {
    driver: 'sqlite' | 'postgres' | 'postgresql' | 'mysql';
    url?: string;
    host?: string;
    port?: number;
    database?: string;
    username?: string;
    password?: string;
    socket?: string;
    // Opções específicas do Bun SQL podem ser adicionadas aqui
}

export interface ModelAttributes {
    [key: string]: any;
}

export type Operator = '=' | '<' | '>' | '<=' | '>=' | '<>' | '!=' | 'like' | 'not like' | 'in' | 'not in' | 'between' | 'not between' | 'is null' | 'is not null';

export interface QueryOptions {
    limit?: number;
    offset?: number;
    orderBy?: { column: string; direction: 'asc' | 'desc' }[];
    groupBy?: string[];
}

export type CastType = 'string' | 'integer' | 'float' | 'boolean' | 'date' | 'datetime' | 'timestamp' | 'json' | 'array';

export interface PaginationResult<T> {
    data: T[];
    total: number;
    perPage: number;
    currentPage: number;
    lastPage: number;
    from: number;
    to: number;
}
