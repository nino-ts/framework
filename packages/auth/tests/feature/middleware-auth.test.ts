import { beforeEach, describe, expect, it } from 'bun:test';
import type { Authenticatable } from '@/contracts/authenticatable';
import type { SessionInterface } from '@/contracts/session-interface';
import type { UserProvider } from '@/contracts/user-provider';
import { SessionGuard } from '@/guards/session-guard';
import { BcryptHasher } from '@/hashing/bcrypt-hasher';

/**
 * Integration tests for auth middleware
 */

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

function createMockUser(id: number, email: string, passwordHash: string): Authenticatable {
    const attrs: Record<string, unknown> = {
        email,
        id,
        password: passwordHash,
        remember_token: null,
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

function createMiddlewareFixture() {
    const users = new Map<number, Authenticatable>();
    const hasher = new BcryptHasher();
    let nextUserId = 1;

    const provider: UserProvider = {
        async retrieveByCredentials(credentials: Record<string, unknown>): Promise<Authenticatable | null> {
            for (const user of users.values()) {
                const email = (user as any).email;
                if (email === credentials.email) {
                    return user;
                }
            }
            return null;
        },
        async retrieveById(id: string | number): Promise<Authenticatable | null> {
            return users.get(id as number) ?? null;
        },
        async retrieveByToken(): Promise<Authenticatable | null> {
            return null;
        },
        async updateRememberToken(): Promise<void> {
            // no-op
        },
        async validateCredentials(user: Authenticatable, credentials: Record<string, unknown>): Promise<boolean> {
            const passwordHash = user.getAuthPassword();
            const providedPassword = credentials.password as string;

            try {
                return await hasher.check(providedPassword, passwordHash);
            } catch {
                return false;
            }
        },
    };

    const session = createMockSession();
    const guard = new SessionGuard('web', provider, session);

    async function createUser(email: string, password: string): Promise<Authenticatable> {
        const passwordHash = await hasher.make(password);
        const user = createMockUser(nextUserId++, email, passwordHash);
        (user as any).email = email;
        users.set(user.getAuthIdentifier() as number, user);
        return user;
    }

    return {
        createUser,
        guard,
        hasher,
        provider,
        session,
        users,
    };
}

describe('Auth Middleware Integration', () => {
    let fixture: ReturnType<typeof createMiddlewareFixture>;

    beforeEach(() => {
        fixture = createMiddlewareFixture();
    });

    describe('authenticate middleware', () => {
        it('should identify unauthenticated requests', async () => {
            // When guest, authentication should fail
            expect(await fixture.guard.guest()).toBe(true);
            expect(await fixture.guard.check()).toBe(false);
        });

        it('should allow authenticated requests', async () => {
            const user = await fixture.createUser('alice@example.com', 'password123');
            await fixture.guard.login(user);

            // After login, guard.check() should return true
            expect(await fixture.guard.check()).toBe(true);
            expect(await fixture.guard.guest()).toBe(false);
        });

        it('should maintain authentication across multiple checks', async () => {
            const user = await fixture.createUser('bob@example.com', 'password123');
            await fixture.guard.login(user);

            // Multiple checks should all return true
            expect(await fixture.guard.check()).toBe(true);
            expect(await fixture.guard.check()).toBe(true);
            expect(await fixture.guard.id()).toBe(user.getAuthIdentifier());
        });
    });

    describe('guest middleware', () => {
        it('should allow request when guest (not authenticated)', async () => {
            // Guest middleware should allow access when user is not authenticated
            expect(await fixture.guard.guest()).toBe(true);
            expect(await fixture.guard.check()).toBe(false);
        });

        it('should potentially reject when authenticated (depending on implementation)', async () => {
            const user = await fixture.createUser('charlie@example.com', 'password123');
            await fixture.guard.login(user);

            // Guest middleware would typically reject authenticated users
            expect(await fixture.guard.guest()).toBe(false);
            expect(await fixture.guard.check()).toBe(true);
        });
    });

    describe('Guarded endpoints simulation', () => {
        it('should handle logout on protected route', async () => {
            const user = await fixture.createUser('diana@example.com', 'password123');
            await fixture.guard.login(user);

            // Verify authenticated
            expect(await fixture.guard.check()).toBe(true);

            // Logout
            await fixture.guard.logout();

            // Verify guest again
            expect(await fixture.guard.check()).toBe(false);
            expect(await fixture.guard.guest()).toBe(true);
        });

        it('should track user identity through request lifecycle', async () => {
            const user = await fixture.createUser('eve@example.com', 'password123');

            // Attempt login (simulating form submission)
            const loginResult = await fixture.guard.attempt(
                { email: 'eve@example.com', password: 'password123' },
                false
            );

            expect(loginResult).toBe(true);

            // Check user is authenticated
            expect(await fixture.guard.check()).toBe(true);
            const authUser = await fixture.guard.user();
            expect(authUser?.getAuthIdentifier()).toBe(user.getAuthIdentifier());

            // Logout
            await fixture.guard.logout();
            expect(await fixture.guard.check()).toBe(false);
        });
    });
});
