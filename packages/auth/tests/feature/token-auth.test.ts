import { beforeEach, describe, expect, it } from 'bun:test';
import type { Authenticatable } from '@/contracts/authenticatable';
import type { UserProvider } from '@/contracts/user-provider';
import { TokenGuard } from '@/guards/token-guard';
import { BcryptHasher } from '@/hashing/bcrypt-hasher';

/**
 * Integration tests for Bearer token authentication
 */

function createMockUser(id: number, email: string, passwordHash: string): Authenticatable {
    const attrs: Record<string, unknown> = {
        api_token: `token_${id}`,
        email,
        id,
        password: passwordHash,
    };

    return {
        getAuthIdentifier: () => attrs.id as number,
        getAuthIdentifierName: () => 'id',
        getAuthPassword: () => attrs.password as string,
        getAuthPasswordName: () => 'password',
        getRememberToken: () => null,
        getRememberTokenName: () => 'remember_token',
        setRememberToken: (_value: string | null) => {
            // no-op
        },
    };
}

function createTokenAuthFixture() {
    const users = new Map<string, Authenticatable>();
    const hasher = new BcryptHasher();

    const provider: UserProvider = {
        async retrieveByCredentials(credentials: Record<string, unknown>): Promise<Authenticatable | null> {
            // Search by api_token
            const token = credentials.api_token as string | undefined;
            if (token && users.has(token)) {
                return users.get(token) ?? null;
            }
            return null;
        },
        async retrieveById(id: string | number): Promise<Authenticatable | null> {
            for (const user of users.values()) {
                if (user.getAuthIdentifier() === id) {
                    return user;
                }
            }
            return null;
        },
        async retrieveByToken(): Promise<Authenticatable | null> {
            return null;
        },
        async updateRememberToken(): Promise<void> {
            // no-op
        },
        async validateCredentials(): Promise<boolean> {
            return false;
        },
    };

    let nextId = 1;

    async function createUser(email: string, token: string): Promise<Authenticatable> {
        const passwordHash = await hasher.make('password123');
        const id = nextId++;
        const user = createMockUser(id, email, passwordHash);
        (user as any).api_token = token;
        // Store by token for lookup
        users.set(token, user);
        return user;
    }

    function createGuardForRequest(request: Request): TokenGuard {
        return new TokenGuard(provider, request);
    }

    return {
        createGuardForRequest,
        createUser,
        provider,
        users,
    };
}

describe('TokenGuard — Bearer Token Auth', () => {
    let fixture: ReturnType<typeof createTokenAuthFixture>;

    beforeEach(() => {
        fixture = createTokenAuthFixture();
    });

    describe('Token validation', () => {
        it('should authenticate with valid Bearer token in Authorization header', async () => {
            const token = 'alice_token_secret';
            const user = await fixture.createUser('alice@example.com', token);

            const request = new Request('http://localhost/api/profile', {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            const guard = fixture.createGuardForRequest(request);
            const authenticatedUser = await guard.user();

            expect(authenticatedUser).not.toBeNull();
            expect(authenticatedUser?.getAuthIdentifier()).toBe(user.getAuthIdentifier());
        });

        it('should return null without Authorization header', async () => {
            const request = new Request('http://localhost/api/profile', {
                headers: {},
            });

            const guard = fixture.createGuardForRequest(request);
            const user = await guard.user();

            expect(user).toBeNull();
        });

        it('should return null with invalid token', async () => {
            const request = new Request('http://localhost/api/profile', {
                headers: {
                    Authorization: 'Bearer invalid_token_12345',
                },
            });

            const guard = fixture.createGuardForRequest(request);
            const user = await guard.user();

            expect(user).toBeNull();
        });

        it('should return null with malformed Authorization header', async () => {
            const request = new Request('http://localhost/api/profile', {
                headers: {
                    Authorization: 'InvalidFormat some_token',
                },
            });

            const guard = fixture.createGuardForRequest(request);
            const user = await guard.user();

            expect(user).toBeNull();
        });

        it('should check() return true with valid token', async () => {
            const token = 'bob_token_secret';
            const _user = await fixture.createUser('bob@example.com', token);

            const request = new Request('http://localhost/api/profile', {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            const guard = fixture.createGuardForRequest(request);
            const isAuthenticated = await guard.check();

            expect(isAuthenticated).toBe(true);
        });

        it('should check() return false without token', async () => {
            const request = new Request('http://localhost/api/profile', {
                headers: {},
            });

            const guard = fixture.createGuardForRequest(request);
            const isAuthenticated = await guard.check();

            expect(isAuthenticated).toBe(false);
        });

        it('should guest() return true without token', async () => {
            const request = new Request('http://localhost/api/profile', {
                headers: {},
            });

            const guard = fixture.createGuardForRequest(request);
            const isGuest = await guard.guest();

            expect(isGuest).toBe(true);
        });

        it('should guest() return false with valid token', async () => {
            const token = 'charlie_token_secret';
            const _user = await fixture.createUser('charlie@example.com', token);

            const request = new Request('http://localhost/api/profile', {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            const guard = fixture.createGuardForRequest(request);
            const isGuest = await guard.guest();

            expect(isGuest).toBe(false);
        });

        it('should return user id from Authorization header', async () => {
            const token = 'diana_token_secret';
            const user = await fixture.createUser('diana@example.com', token);

            const request = new Request('http://localhost/api/profile', {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            const guard = fixture.createGuardForRequest(request);
            const id = await guard.id();

            expect(id).toBe(user.getAuthIdentifier());
        });

        it('should return null id without Authorization header', async () => {
            const request = new Request('http://localhost/api/profile', {
                headers: {},
            });

            const guard = fixture.createGuardForRequest(request);
            const id = await guard.id();

            expect(id).toBeNull();
        });
    });

    describe('Multiple tokens', () => {
        it('should authenticate different users with different tokens', async () => {
            const token1 = 'user1_token';
            const token2 = 'user2_token';

            const user1 = await fixture.createUser('user1@example.com', token1);
            const user2 = await fixture.createUser('user2@example.com', token2);

            const request1 = new Request('http://localhost/api/profile', {
                headers: { Authorization: `Bearer ${token1}` },
            });

            const request2 = new Request('http://localhost/api/profile', {
                headers: { Authorization: `Bearer ${token2}` },
            });

            const guard1 = fixture.createGuardForRequest(request1);
            const guard2 = fixture.createGuardForRequest(request2);

            const auth1 = await guard1.user();
            const auth2 = await guard2.user();

            expect(auth1?.getAuthIdentifier()).toBe(user1.getAuthIdentifier());
            expect(auth2?.getAuthIdentifier()).toBe(user2.getAuthIdentifier());
            expect(auth1?.getAuthIdentifier()).not.toBe(auth2?.getAuthIdentifier());
        });
    });
});
