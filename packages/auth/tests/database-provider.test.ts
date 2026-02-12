import { describe, expect, it } from 'bun:test';
import type { ConnectionInterface } from '../src/contracts/connection-interface';
import type { Hasher } from '../src/contracts/hasher';
import { DatabaseUserProvider } from '../src/providers/database-provider';

function createMockConnection(rows: Record<string, unknown>[]): ConnectionInterface {
    return {
        async query(_sql: string, _params?: unknown[]): Promise<Record<string, unknown>[]> {
            return rows;
        },
    };
}

function createMockHasher(shouldMatch: boolean = true): Hasher {
    return {
        async check(_value: string, _hashedValue: string): Promise<boolean> {
            return shouldMatch;
        },
        async make(value: string): Promise<string> {
            return `hashed_${value}`;
        },
        needsRehash(): boolean {
            return false;
        },
    };
}

const sampleRow = {
    email: 'john@example.com',
    id: 1,
    password: 'hashed_password',
    remember_token: 'abc123',
};

describe('DatabaseUserProvider', () => {
    it('retrieveById returns user when found', async () => {
        const connection = createMockConnection([sampleRow]);
        const hasher = createMockHasher();
        const provider = new DatabaseUserProvider(connection, hasher, 'users');

        const user = await provider.retrieveById(1);
        expect(user).not.toBeNull();
        expect(user?.getAuthIdentifier()).toBe(1);
        expect(user?.getAuthPassword()).toBe('hashed_password');
    });

    it('retrieveById returns null when not found', async () => {
        const connection = createMockConnection([]);
        const hasher = createMockHasher();
        const provider = new DatabaseUserProvider(connection, hasher, 'users');

        const user = await provider.retrieveById(999);
        expect(user).toBeNull();
    });

    it('retrieveByToken returns user when id and token match', async () => {
        const connection = createMockConnection([sampleRow]);
        const hasher = createMockHasher();
        const provider = new DatabaseUserProvider(connection, hasher, 'users');

        const user = await provider.retrieveByToken(1, 'abc123');
        expect(user).not.toBeNull();
        expect(user?.getRememberToken()).toBe('abc123');
    });

    it('retrieveByToken returns null when not found', async () => {
        const connection = createMockConnection([]);
        const hasher = createMockHasher();
        const provider = new DatabaseUserProvider(connection, hasher, 'users');

        const user = await provider.retrieveByToken(1, 'wrong-token');
        expect(user).toBeNull();
    });

    it('retrieveByCredentials finds user by non-password fields', async () => {
        const connection = createMockConnection([sampleRow]);
        const hasher = createMockHasher();
        const provider = new DatabaseUserProvider(connection, hasher, 'users');

        const user = await provider.retrieveByCredentials({
            email: 'john@example.com',
            password: 'secret',
        });
        expect(user).not.toBeNull();
        expect(user?.getAuthIdentifier()).toBe(1);
    });

    it('retrieveByCredentials returns null with no non-password criteria', async () => {
        const connection = createMockConnection([]);
        const hasher = createMockHasher();
        const provider = new DatabaseUserProvider(connection, hasher, 'users');

        const user = await provider.retrieveByCredentials({ password: 'secret' });
        expect(user).toBeNull();
    });

    it('validateCredentials returns true when password matches', async () => {
        const connection = createMockConnection([sampleRow]);
        const hasher = createMockHasher(true);
        const provider = new DatabaseUserProvider(connection, hasher, 'users');

        const user = (await provider.retrieveById(1))!;
        const result = await provider.validateCredentials(user, {
            password: 'correct',
        });
        expect(result).toBe(true);
    });

    it('validateCredentials returns false when password does not match', async () => {
        const connection = createMockConnection([sampleRow]);
        const hasher = createMockHasher(false);
        const provider = new DatabaseUserProvider(connection, hasher, 'users');

        const user = (await provider.retrieveById(1))!;
        const result = await provider.validateCredentials(user, {
            password: 'wrong',
        });
        expect(result).toBe(false);
    });

    it('updateRememberToken updates token on user', async () => {
        const connection = createMockConnection([sampleRow]);
        const hasher = createMockHasher();
        const provider = new DatabaseUserProvider(connection, hasher, 'users');

        const user = (await provider.retrieveById(1))!;
        await provider.updateRememberToken(user, 'new-token');
        expect(user.getRememberToken()).toBe('new-token');
    });

    it('GenericUser exposes correct attribute names', async () => {
        const connection = createMockConnection([sampleRow]);
        const hasher = createMockHasher();
        const provider = new DatabaseUserProvider(connection, hasher, 'users');

        const user = (await provider.retrieveById(1))!;
        expect(user.getAuthIdentifierName()).toBe('id');
        expect(user.getAuthPasswordName()).toBe('password');
        expect(user.getRememberTokenName()).toBe('remember_token');
    });
});
