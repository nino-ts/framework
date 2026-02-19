import { afterEach, beforeEach, describe, expect, test } from 'bun:test';
import { DatabaseManager } from '@/database-manager';
import { Model } from '@/model';
import { Transaction } from '@/transaction';

class _Account extends Model {
    protected static override table = 'accounts';
}

describe('Transaction', () => {
    let db: DatabaseManager;

    beforeEach(async () => {
        db = new DatabaseManager();
        db.addConnection('default', { driver: 'sqlite', url: ':memory:', database: ':memory:' });
        db.setDefaultConnection('default');
        Model.setConnectionResolver(db);

        const conn = db.connection();
        await conn.run('CREATE TABLE accounts (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, balance INTEGER)');
        await conn.run('INSERT INTO accounts (name, balance) VALUES (?, ?)', ['Alice', 1000]);
        await conn.run('INSERT INTO accounts (name, balance) VALUES (?, ?)', ['Bob', 500]);
    });

    afterEach(async () => {
        await db.closeALl();
    });

    test('transaction should commit changes', async () => {
        const conn = db.connection();
        const tx = await Transaction.begin(conn);

        await conn.run('UPDATE accounts SET balance = balance - 100 WHERE name = ?', ['Alice']);
        await conn.run('UPDATE accounts SET balance = balance + 100 WHERE name = ?', ['Bob']);

        await tx.commit();

        const alice = await conn.query('SELECT balance FROM accounts WHERE name = ?', ['Alice']);
        const bob = await conn.query('SELECT balance FROM accounts WHERE name = ?', ['Bob']);

        expect((alice[0] as any).balance).toBe(900);
        expect((bob[0] as any).balance).toBe(600);
    });

    test('transaction should rollback changes', async () => {
        const conn = db.connection();
        const tx = await Transaction.begin(conn);

        await conn.run('UPDATE accounts SET balance = balance - 100 WHERE name = ?', ['Alice']);

        await tx.rollback();

        const alice = await conn.query('SELECT balance FROM accounts WHERE name = ?', ['Alice']);
        expect((alice[0] as any).balance).toBe(1000); // Should be unchanged
    });

    test('transaction should auto-rollback on dispose if not committed', async () => {
        const conn = db.connection();

        {
            const tx = await Transaction.begin(conn);
            await conn.run('UPDATE accounts SET balance = balance - 100 WHERE name = ?', ['Alice']);
            // Don't commit - should auto-rollback when tx goes out of scope
            await tx[Symbol.asyncDispose]();
        }

        const alice = await conn.query('SELECT balance FROM accounts WHERE name = ?', ['Alice']);
        expect((alice[0] as any).balance).toBe(1000); // Should be unchanged due to rollback
    });
});
