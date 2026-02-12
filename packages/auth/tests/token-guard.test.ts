import { beforeEach, describe, expect, it } from 'bun:test';
import type { Authenticatable } from '../src/contracts/authenticatable';
import type { UserProvider } from '../src/contracts/user-provider';
import { TokenGuard } from '../src/guards/token-guard';

function createMockUser(): Authenticatable {
    return {
        getAuthIdentifier: () => 42,
        getAuthIdentifierName: () => 'id',
        getAuthPassword: () => 'hashed',
        getAuthPasswordName: () => 'password',
        getRememberToken: () => null,
        getRememberTokenName: () => 'remember_token',
        setRememberToken: () => {},
    };
}

function createMockProvider(tokenToMatch?: string): UserProvider {
    const user = createMockUser();

    return {
        async retrieveByCredentials(credentials: Record<string, unknown>): Promise<Authenticatable | null> {
            if (tokenToMatch && credentials.api_token === tokenToMatch) {
                return user;
            }
            return null;
        },
        async retrieveById(): Promise<Authenticatable | null> {
            return user;
        },
        async retrieveByToken(): Promise<Authenticatable | null> {
            return null;
        },
        async updateRememberToken(): Promise<void> {},
        async validateCredentials(): Promise<boolean> {
            return false;
        },
    };
}

describe('TokenGuard', () => {
    const validToken = 'my-secret-api-token';
    let provider: UserProvider;

    beforeEach(() => {
        provider = createMockProvider(validToken);
    });

    it('authenticates via Bearer header', async () => {
        const request = new Request('http://localhost/api/test', {
            headers: { Authorization: `Bearer ${validToken}` },
        });

        const guard = new TokenGuard(provider, request);
        const user = await guard.user();

        expect(user).not.toBeNull();
        expect(user?.getAuthIdentifier()).toBe(42);
    });

    it('authenticates via query parameter', async () => {
        const request = new Request(`http://localhost/api/test?api_token=${validToken}`);

        const guard = new TokenGuard(provider, request);
        expect(await guard.check()).toBe(true);
    });

    it('prefers query param over Authorization header', async () => {
        const request = new Request(`http://localhost/api/test?api_token=${validToken}`, {
            headers: { Authorization: 'Bearer wrong-token' },
        });

        const guard = new TokenGuard(provider, request);
        const user = await guard.user();

        expect(user).not.toBeNull();
        expect(user?.getAuthIdentifier()).toBe(42);
    });

    it('returns null user for missing token', async () => {
        const request = new Request('http://localhost/api/test');
        const guard = new TokenGuard(provider, request);

        expect(await guard.user()).toBeNull();
        expect(await guard.check()).toBe(false);
        expect(await guard.guest()).toBe(true);
    });

    it('returns null user for invalid token', async () => {
        const request = new Request('http://localhost/api/test', {
            headers: { Authorization: 'Bearer wrong-token' },
        });

        const guard = new TokenGuard(provider, request);
        expect(await guard.user()).toBeNull();
    });

    it('validate returns true for valid token credentials', async () => {
        const request = new Request('http://localhost/api/test');
        const guard = new TokenGuard(provider, request);

        const result = await guard.validate({ api_token: validToken });
        expect(result).toBe(true);
    });

    it('validate returns false for missing token in credentials', async () => {
        const request = new Request('http://localhost/api/test');
        const guard = new TokenGuard(provider, request);

        const result = await guard.validate({});
        expect(result).toBe(false);
    });

    it('id returns user id when authenticated', async () => {
        const request = new Request('http://localhost/api/test', {
            headers: { Authorization: `Bearer ${validToken}` },
        });

        const guard = new TokenGuard(provider, request);
        expect(await guard.id()).toBe(42);
    });

    it('id returns null when not authenticated', async () => {
        const request = new Request('http://localhost/api/test');
        const guard = new TokenGuard(provider, request);
        expect(await guard.id()).toBeNull();
    });

    it('caches user instance on subsequent calls', async () => {
        const request = new Request('http://localhost/api/test', {
            headers: { Authorization: `Bearer ${validToken}` },
        });

        const guard = new TokenGuard(provider, request);
        const first = await guard.user();
        const second = await guard.user();
        expect(first).toBe(second);
    });

    it('supports custom input and storage keys', async () => {
        const customProvider = createMockProvider('custom-token');
        customProvider.retrieveByCredentials = async (credentials: Record<string, unknown>) => {
            if (credentials.custom_key === 'custom-token') {
                return createMockUser();
            }
            return null;
        };

        const request = new Request('http://localhost/api/test?custom_input=custom-token');

        const guard = new TokenGuard(customProvider, request, 'custom_input', 'custom_key');
        expect(await guard.check()).toBe(true);
    });
});
