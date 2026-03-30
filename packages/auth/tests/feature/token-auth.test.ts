import { beforeEach, describe, expect, it } from 'bun:test';
import type { Authenticatable } from '@/contracts/authenticatable.ts';
import type { UserProvider } from '@/contracts/user-provider.ts';
import { TokenGuard } from '@/guards/token-guard.ts';
import { BcryptHasher } from '@/hashing/bcrypt-hasher.ts';

/**
 * Integration tests for Bearer token authentication
 */

function createMockUser(id: number, email: string, passwordHash: string): Authenticatable {
  const attrs: Record<string, unknown> = {
    token: `token_${id}`,
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
      // Search by token
      const token = credentials.token as string | undefined;
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
    async retrieveByTokenOnly(token: string): Promise<Authenticatable | null> {
      if (users.has(token)) {
        return users.get(token) ?? null;
      }
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
    const passwordHash = await hasher.hash('password123');
    const id = nextId++;
    const user = createMockUser(id, email, passwordHash);
    (user as unknown as Record<string, unknown>).token = token;
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

  it('should authenticate with valid Bearer token', async () => {
    const { createUser, createGuardForRequest } = fixture;

    const user = await createUser('alice@example.com', 'my_secret_token');

    const request = new Request('http://example.com/api/protected', {
      headers: {
        Authorization: 'Bearer my_secret_token',
      },
    });

    const guard = createGuardForRequest(request);
    const authenticated = await guard.check();

    expect(authenticated).toBe(true);
    const authenticatedUser = await guard.user();
    expect(authenticatedUser?.getAuthIdentifier()).toBe(user.getAuthIdentifier());
  });

  it('should reject request without Authorization header', async () => {
    const { createGuardForRequest } = fixture;

    const request = new Request('http://example.com/api/protected');
    const guard = createGuardForRequest(request);

    const authenticated = await guard.check();
    expect(authenticated).toBe(false);
  });

  it('should reject invalid Bearer token', async () => {
    const { createGuardForRequest } = fixture;

    const request = new Request('http://example.com/api/protected', {
      headers: {
        Authorization: 'Bearer invalid_token',
      },
    });

    const guard = createGuardForRequest(request);
    const authenticated = await guard.check();
    expect(authenticated).toBe(false);
  });

  it('should reject malformed Authorization header', async () => {
    const { createGuardForRequest } = fixture;

    const request = new Request('http://example.com/api/protected', {
      headers: {
        Authorization: 'InvalidFormat',
      },
    });

    const guard = createGuardForRequest(request);
    const authenticated = await guard.check();
    expect(authenticated).toBe(false);
  });

  it('should handle multiple requests with different tokens', async () => {
    const { createUser, createGuardForRequest } = fixture;

    const user1 = await createUser('user1@example.com', 'token_1');
    const user2 = await createUser('user2@example.com', 'token_2');

    const request1 = new Request('http://example.com/api/protected', {
      headers: {
        Authorization: 'Bearer token_1',
      },
    });

    const request2 = new Request('http://example.com/api/protected', {
      headers: {
        Authorization: 'Bearer token_2',
      },
    });

    const guard1 = createGuardForRequest(request1);
    const guard2 = createGuardForRequest(request2);

    expect(await guard1.check()).toBe(true);
    expect(await guard2.check()).toBe(true);
    expect((await guard1.user())?.getAuthIdentifier()).toBe(user1.getAuthIdentifier());
    expect((await guard2.user())?.getAuthIdentifier()).toBe(user2.getAuthIdentifier());
  });
});
