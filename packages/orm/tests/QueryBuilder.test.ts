import { describe, test, expect, beforeEach, mock } from 'bun:test';
import { QueryBuilder } from '@/query-builder';
import { Collection } from '@/collection';

describe('QueryBuilder', () => {
    // Mock Connection
    const mockConnection = {
        query: mock((sql: string, bindings: any[]) => Promise.resolve([])),
        run: mock((sql: string, bindings: any[]) => Promise.resolve({ lastInsertId: 1, changes: 1 })),
    };

    beforeEach(() => {
        mockConnection.query.mockClear();
        mockConnection.run.mockClear();
    });

    test('should build SELECT * query by default', () => {
        const qb = new QueryBuilder(mockConnection as any).from('users');
        expect(qb.toSql()).toBe('SELECT * FROM users');
    });

    test('should build SELECT with specific columns', () => {
        const qb = new QueryBuilder(mockConnection as any).select('id', 'name').from('users');
        expect(qb.toSql()).toBe('SELECT id, name FROM users');
    });

    // Where Clause
    test('should add WHERE clause with = operator', () => {
        const qb = new QueryBuilder(mockConnection as any).from('users').where('id', '=', 1);
        expect(qb.toSql()).toBe('SELECT * FROM users WHERE id = ?');
        expect(qb.getBindings()).toEqual([1]);
    });

    test('should add WHERE clause with implicit =', () => {
        const qb = new QueryBuilder(mockConnection as any).from('users').where('active', true);
        expect(qb.toSql()).toBe('SELECT * FROM users WHERE active = ?');
        expect(qb.getBindings()).toEqual([true]);
    });

    test('should chain multiple WHERE clauses with AND', () => {
        const qb = new QueryBuilder(mockConnection as any)
            .from('users')
            .where('status', '=', 'active')
            .where('age', '>', 18);
        expect(qb.toSql()).toBe('SELECT * FROM users WHERE status = ? AND age > ?');
    });

    test('orWhere should add OR condition', () => {
        const qb = new QueryBuilder(mockConnection as any)
            .from('users')
            .where('id', 1)
            .orWhere('id', 2);
        expect(qb.toSql()).toBe('SELECT * FROM users WHERE id = ? OR id = ?');
    });

    test('whereNull should add IS NULL condition', () => {
        const qb = new QueryBuilder(mockConnection as any).from('users').whereNull('deleted_at');
        expect(qb.toSql()).toBe('SELECT * FROM users WHERE deleted_at IS NULL');
    });

    test('whereIn should add IN condition', () => {
        const qb = new QueryBuilder(mockConnection as any).from('users').whereIn('id', [1, 2, 3]);
        expect(qb.toSql()).toBe('SELECT * FROM users WHERE id IN (?, ?, ?)');
        expect(qb.getBindings()).toEqual([1, 2, 3]);
    });

    // Limit & Offset & Order
    test('should add LIMIT and OFFSET', () => {
        const qb = new QueryBuilder(mockConnection as any).from('users').limit(10).offset(5);
        expect(qb.toSql()).toBe('SELECT * FROM users LIMIT 10 OFFSET 5');
    });

    test('should add ORDER BY', () => {
        const qb = new QueryBuilder(mockConnection as any).from('users').orderBy('created_at', 'desc');
        expect(qb.toSql()).toBe('SELECT * FROM users ORDER BY created_at DESC');
    });

    // Joins
    test('join should add JOIN clause', () => {
        const qb = new QueryBuilder(mockConnection as any)
            .from('users')
            .join('posts', 'users.id', '=', 'posts.user_id');
        expect(qb.toSql()).toBe('SELECT * FROM users INNER JOIN posts ON users.id = posts.user_id');
    });

    test('leftJoin should add LEFT JOIN clause', () => {
        const qb = new QueryBuilder(mockConnection as any)
            .from('users')
            .leftJoin('posts', 'users.id', '=', 'posts.user_id');
        expect(qb.toSql()).toBe('SELECT * FROM users LEFT JOIN posts ON users.id = posts.user_id');
    });

    // Execution
    test('get() should execute query and return collection', async () => {
        const result = [{ id: 1, name: 'John' }];
        mockConnection.query.mockResolvedValue(result as never); // Cast para satisfazer retorno do mock inferido

        const qb = new QueryBuilder(mockConnection as any).from('users');
        const collection = await qb.get();

        expect(mockConnection.query).toHaveBeenCalledWith('SELECT * FROM users', []);
        expect(collection).toBeInstanceOf(Collection);
        expect(collection.first()).toEqual(result[0]);
    });

    test('insert() should execute insert query', async () => {
        const qb = new QueryBuilder(mockConnection as any).from('users');
        await qb.insert({ name: 'John', email: 'john@test.com' });

        expect(mockConnection.run).toHaveBeenCalledTimes(1);
        // Validar SQL simplificado
        const lastCall = mockConnection.run.mock.calls[0];
        expect(lastCall[0]).toContain('INSERT INTO users');
        expect(lastCall[1]).toEqual(['John', 'john@test.com']);
    });

    test('update() should execute update query', async () => {
        const qb = new QueryBuilder(mockConnection as any).from('users').where('id', 1);
        await qb.update({ name: 'Jane' });

        expect(mockConnection.run).toHaveBeenCalledTimes(1);
        expect(mockConnection.run).toHaveBeenCalledWith('UPDATE users SET name = ? WHERE id = ?', ['Jane', 1]);
    });

    test('delete() should execute delete query', async () => {
        const qb = new QueryBuilder(mockConnection as any).from('users').where('id', 1);
        await qb.delete();

        expect(mockConnection.run).toHaveBeenCalledTimes(1);
        expect(mockConnection.run).toHaveBeenCalledWith('DELETE FROM users WHERE id = ?', [1]);
    });
});
