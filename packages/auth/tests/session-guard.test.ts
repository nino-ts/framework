import { beforeEach, describe, expect, it } from 'bun:test';
import type { Authenticatable } from '../src/contracts/authenticatable';
import type { SessionInterface } from '../src/contracts/session-interface';
import type { UserProvider } from '../src/contracts/user-provider';
import { SessionGuard } from '../src/guards/session-guard';

function createMockUser(overrides: Partial<Record<string, unknown>> = {}): Authenticatable {
    const attrs: Record<string, unknown> = {
        email: 'john@example.com',
        id: 1,
        password: '$2b$10$hashedpassword',
        remember_token: null,
        ...overrides,
    };

    return {
        getAuthIdentifier: () => attrs.id as number,
        getAuthIdentifierName: () => 'id',
        getAuthPassword: () => attrs.password as string,
        getAuthPasswordName: () => 'password',
        getRememberToken: () => attrs.remember_token as string | null,
        getRememberTokenName: () => 'remember_token',
        setRememberToken: (value: string | null) => {
            attrs.remember_token = value;
        },
    };
}

function createMockSession(): SessionInterface & { store: Map<string, unknown> } {
    const store = new Map<string, unknown>();

    return {
        flush(): void {
            store.clear();
        },
        forget(key: string): void {
            store.delete(key);
        },
        get(key: string, defaultValue?: unknown): unknown {
            return store.has(key) ? store.get(key) : defaultValue;
        },
        put(key: string, value: unknown): void {
            store.set(key, value);
        },
        async regenerate(): Promise<boolean> {
            return true;
        },
        store,
    };
}

function createMockProvider(users: Authenticatable[] = []): UserProvider {
    return {
        async retrieveByCredentials(credentials: Record<string, unknown>): Promise<Authenticatable | null> {
            return (
                users.find((_u) => {
                    for (const [key, value] of Object.entries(credentials)) {
                        if (key.includes('password')) continue;
                        if (key === 'email' && value !== 'john@example.com') return false;
                    }
                    return true;
                }) ?? null
            );
        },
        async retrieveById(id: string | number): Promise<Authenticatable | null> {
            return users.find((u) => u.getAuthIdentifier() === id) ?? null;
        },
        async retrieveByToken(id: string | number, token: string): Promise<Authenticatable | null> {
            return users.find((u) => u.getAuthIdentifier() === id && u.getRememberToken() === token) ?? null;
        },
        async updateRememberToken(user: Authenticatable, token: string): Promise<void> {
            user.setRememberToken(token);
        },
        async validateCredentials(_user: Authenticatable, credentials: Record<string, unknown>): Promise<boolean> {
            return credentials.password === 'correct-password';
        },
    };
}

describe('SessionGuard', () => {
    let guard: SessionGuard;
    let session: ReturnType<typeof createMockSession>;
    let provider: UserProvider;
    let user: Authenticatable;

    beforeEach(() => {
        user = createMockUser();
        provider = createMockProvider([user]);
        session = createMockSession();
        guard = new SessionGuard('web', provider, session);
    });

    it('guest returns true when no user is logged in', async () => {
        expect(await guard.guest()).toBe(true);
    });

    it('check returns false when no user is logged in', async () => {
        expect(await guard.check()).toBe(false);
    });

    it('user returns null when no user is logged in', async () => {
        expect(await guard.user()).toBeNull();
    });

    it('id returns null when no user is logged in', async () => {
        expect(await guard.id()).toBeNull();
    });

    it('attempt succeeds with correct credentials', async () => {
        const result = await guard.attempt({ email: 'john@example.com', password: 'correct-password' }, false);
        expect(result).toBe(true);
    });

    it('attempt fails with incorrect password', async () => {
        const result = await guard.attempt({ email: 'john@example.com', password: 'wrong-password' }, false);
        expect(result).toBe(false);
    });

    it('attempt fails with non-existent user', async () => {
        const result = await guard.attempt({ email: 'unknown@example.com', password: 'any' }, false);
        expect(result).toBe(false);
    });

    it('login sets user and stores session', async () => {
        await guard.login(user);

        expect(await guard.check()).toBe(true);
        expect(await guard.guest()).toBe(false);

        const loggedInUser = await guard.user();
        expect(loggedInUser).not.toBeNull();
        expect(loggedInUser?.getAuthIdentifier()).toBe(1);
    });

    it('login stores user id in session', async () => {
        await guard.login(user);

        // The session should contain the user's ID under the guard's name key
        expect(session.store.size).toBeGreaterThan(0);
    });

    it('logout clears user and session', async () => {
        await guard.login(user);
        expect(await guard.check()).toBe(true);

        await guard.logout();
        expect(await guard.check()).toBe(false);
        expect(await guard.user()).toBeNull();
    });

    it('loginUsingId retrieves and logs in user', async () => {
        const result = await guard.loginUsingId(1);
        expect(result).not.toBe(false);
        expect((result as Authenticatable).getAuthIdentifier()).toBe(1);
        expect(await guard.check()).toBe(true);
    });

    it('loginUsingId returns false for unknown id', async () => {
        const result = await guard.loginUsingId(999);
        expect(result).toBe(false);
    });

    it('validate checks credentials without logging in', async () => {
        const valid = await guard.validate({
            email: 'john@example.com',
            password: 'correct-password',
        });
        expect(valid).toBe(true);

        // Should NOT be logged in
        expect(await guard.check()).toBe(false);
    });

    it('validate returns false for invalid credentials', async () => {
        const valid = await guard.validate({
            email: 'john@example.com',
            password: 'wrong',
        });
        expect(valid).toBe(false);
    });

    it('user returns cached instance on subsequent calls', async () => {
        await guard.login(user);

        const first = await guard.user();
        const second = await guard.user();

        expect(first).toBe(second);
    });

    it('attempt with valid credentials sets check to true', async () => {
        await guard.attempt({
            email: 'john@example.com',
            password: 'correct-password',
        });

        expect(await guard.check()).toBe(true);
        const loggedUser = await guard.user();
        expect(loggedUser?.getAuthIdentifier()).toBe(1);
    });
});
