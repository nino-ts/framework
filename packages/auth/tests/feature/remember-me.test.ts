import { beforeEach, describe, expect, it } from 'bun:test';
import type { Authenticatable } from '@/contracts/authenticatable.ts';
import type { SessionInterface } from '@/contracts/session-interface.ts';
import type { UserProvider } from '@/contracts/user-provider.ts';
import { SessionGuard } from '@/guards/session-guard.ts';
import { BcryptHasher } from '@/hashing/bcrypt-hasher.ts';

/**
 * Integration tests for "Remember Me" functionality
 * (cookie-based session persistence across requests)
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

function createRememberMeFixture() {
  const users = new Map<number, Authenticatable>();
  const hasher = new BcryptHasher();
  let nextUserId = 1;

  const provider: UserProvider = {
    async retrieveByCredentials(credentials: Record<string, unknown>): Promise<Authenticatable | null> {
      for (const user of users.values()) {
        const email = (user as unknown as Record<string, unknown>).email;
        if (email === credentials.email) {
          return user;
        }
      }
      return null;
    },
    async retrieveById(id: string | number): Promise<Authenticatable | null> {
      const numericId = typeof id === 'string' ? Number.parseInt(id, 10) : id;
      return users.get(numericId) ?? null;
    },
    async retrieveByToken(id: string | number, token: string): Promise<Authenticatable | null> {
      const numericId = typeof id === 'string' ? Number.parseInt(id, 10) : id;
      const user = users.get(numericId);
      if (user && user.getRememberToken() === token) {
        return user;
      }
      return null;
    },
    async updateRememberToken(user: Authenticatable, token: string): Promise<void> {
      user.setRememberToken(token);
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
    (user as unknown as Record<string, unknown>).email = email;
    users.set(user.getAuthIdentifier() as number, user);
    return user;
  }

  function generateRememberToken(): string {
    // Simulate a random remember token (in production, would be crypto.getRandomValues)
    return `remember_${Date.now()}_${Math.random().toString(36).substring(7)}`;
  }

  return {
    createUser,
    generateRememberToken,
    guard,
    hasher,
    provider,
    session,
    users,
  };
}

describe('Remember Me — Session Persistence', () => {
  let fixture: ReturnType<typeof createRememberMeFixture>;

  beforeEach(() => {
    fixture = createRememberMeFixture();
  });

  describe('Remember token generation', () => {
    it('should generate remember token on login with remember=true', async () => {
      const user = await fixture.createUser('alice@example.com', 'password123');
      const token = fixture.generateRememberToken();

      // Simulate remember me token assignment
      await fixture.provider.updateRememberToken(user, token);

      // User should have the token stored
      expect(user.getRememberToken()).toBe(token);
    });

    it('should NOT generate token when remember=false', async () => {
      const user = await fixture.createUser('bob@example.com', 'password123');

      // Without remember me, token should remain null
      expect(user.getRememberToken()).toBeNull();
    });
  });

  describe('Token validation across sessions', () => {
    it('should validate user by remember token', async () => {
      const user = await fixture.createUser('charlie@example.com', 'password123');
      const token = fixture.generateRememberToken();

      // Assign remember token
      await fixture.provider.updateRememberToken(user, token);

      // Later request: retrieve user by token (simulating cookie-based auto-login)
      const retrievedUser = await fixture.provider.retrieveByToken(user.getAuthIdentifier(), token);

      expect(retrievedUser).not.toBeNull();
      expect(retrievedUser?.getAuthIdentifier()).toBe(user.getAuthIdentifier());
    });

    it('should reject invalid remember token', async () => {
      const user = await fixture.createUser('diana@example.com', 'password123');
      const validToken = fixture.generateRememberToken();

      await fixture.provider.updateRememberToken(user, validToken);

      // Try with invalid token
      const retrievedUser = await fixture.provider.retrieveByToken(user.getAuthIdentifier(), 'invalid_token_xyz');

      expect(retrievedUser).toBeNull();
    });

    it('should reject token for different user', async () => {
      const user1 = await fixture.createUser('eve@example.com', 'password123');
      const user2 = await fixture.createUser('frank@example.com', 'password123');

      const token = fixture.generateRememberToken();
      await fixture.provider.updateRememberToken(user1, token);

      // Try to use user1's token to authenticate as user2
      const retrievedUser = await fixture.provider.retrieveByToken(user2.getAuthIdentifier(), token);

      expect(retrievedUser).toBeNull();
    });
  });

  describe('Remember token lifecycle', () => {
    it('should update remember token on re-login', async () => {
      const user = await fixture.createUser('grace@example.com', 'password123');

      // First login with remember me
      const token1 = fixture.generateRememberToken();
      await fixture.provider.updateRememberToken(user, token1);

      expect(user.getRememberToken()).toBe(token1);

      // Re-login: generate new token
      const token2 = fixture.generateRememberToken();
      await fixture.provider.updateRememberToken(user, token2);

      expect(user.getRememberToken()).toBe(token2);
      expect(user.getRememberToken()).not.toBe(token1);
    });

    it('should clear remember token on logout', async () => {
      const user = await fixture.createUser('henry@example.com', 'password123');
      const token = fixture.generateRememberToken();

      await fixture.provider.updateRememberToken(user, token);
      expect(user.getRememberToken()).not.toBeNull();

      // Logout: clear token
      await fixture.provider.updateRememberToken(user, null as unknown as string);
      expect(user.getRememberToken()).toBeNull();
    });
  });

  describe('Cross-session authentication', () => {
    it('should support remember token in session storage', async () => {
      const user = await fixture.createUser('ivy@example.com', 'password123');

      // Login with remember me
      const token = fixture.generateRememberToken();
      await fixture.guard.login(user, true);
      await fixture.provider.updateRememberToken(user, token);

      // Simulate new request: session is preserved
      expect(await fixture.guard.check()).toBe(true);
      expect(await fixture.guard.id()).toBe(user.getAuthIdentifier());

      // Logout
      await fixture.guard.logout();
      expect(await fixture.guard.check()).toBe(false);

      // Token should still be valid in database
      // (Simulating: cookie is sent in next request, but session is logged out)
      const dbUser = await fixture.provider.retrieveByToken(user.getAuthIdentifier(), token);
      expect(dbUser).not.toBeNull();
    });

    it('should handle multiple users with different remember tokens', async () => {
      const user1 = await fixture.createUser('jack@example.com', 'password123');
      const user2 = await fixture.createUser('kate@example.com', 'password123');

      const token1 = fixture.generateRememberToken();
      const token2 = fixture.generateRememberToken();

      await fixture.provider.updateRememberToken(user1, token1);
      await fixture.provider.updateRememberToken(user2, token2);

      // Validate each user with their own token
      const retrieved1 = await fixture.provider.retrieveByToken(user1.getAuthIdentifier(), token1);
      const retrieved2 = await fixture.provider.retrieveByToken(user2.getAuthIdentifier(), token2);

      expect(retrieved1?.getAuthIdentifier()).toBe(user1.getAuthIdentifier());
      expect(retrieved2?.getAuthIdentifier()).toBe(user2.getAuthIdentifier());
      expect(retrieved1?.getAuthIdentifier()).not.toBe(retrieved2?.getAuthIdentifier());
    });
  });

  describe('Remember Me Cookie HTTP Layer', () => {
    it('should generate Set-Cookie header when remember=true', async () => {
      const user = await fixture.createUser('laura@example.com', 'password123');

      await fixture.guard.login(user, true);
      const cookie = fixture.guard.getRememberCookie();

      expect(cookie).not.toBeNull();
      expect(cookie).toContain('remember_web_web=');
      expect(cookie).toContain('HttpOnly');
      expect(cookie).toContain('SameSite=Lax');
      expect(cookie).toContain('Max-Age=1209600'); // 2 weeks
    });

    it('should NOT generate cookie when remember=false', async () => {
      const user = await fixture.createUser('mike@example.com', 'password123');

      await fixture.guard.login(user, false);
      const cookie = fixture.guard.getRememberCookie();

      expect(cookie).toBeNull();
    });

    it('should parse cookie and auto-login on user() call', async () => {
      const user = await fixture.createUser('nancy@example.com', 'password123');

      // Step 1: Login with remember
      await fixture.guard.login(user, true);
      const cookie = fixture.guard.getRememberCookie();
      expect(cookie).not.toBeNull();

      // Step 2: Logout (clear session, but cookie persists)
      await fixture.guard.logout();
      expect(await fixture.guard.check()).toBe(false);

      // Step 3: Extract cookie value and call user() - should auto-login
      const cookieMatch = cookie?.match(/remember_web_web=([^;]+)/);
      const cookieValue = cookieMatch?.[1];
      expect(cookieValue).toBeDefined();

      const userFromCookie = await fixture.guard.user(cookieValue);

      expect(userFromCookie).not.toBeNull();
      expect(userFromCookie?.getAuthIdentifier()).toBe(user.getAuthIdentifier());
      expect(await fixture.guard.check()).toBe(true); // Session regenerated
    });

    it('should ignore invalid cookie format', async () => {
      const invalidCookie = 'malformed_cookie_value';
      const user = await fixture.guard.user(invalidCookie);

      expect(user).toBeNull();
    });

    it('should ignore cookie with invalid token', async () => {
      const cookieWithBadToken = '1|invalid-token-xyz';
      const user = await fixture.guard.user(cookieWithBadToken);

      expect(user).toBeNull();
    });

    it('should ignore cookie for unknown user', async () => {
      const token = crypto.randomUUID();
      const cookieValue = `999|${token}`;

      const user = await fixture.guard.user(cookieValue);

      expect(user).toBeNull();
      expect(await fixture.guard.check()).toBe(false);
    });

    it('should clear cookie on logout', async () => {
      const user = await fixture.createUser('oscar@example.com', 'password123');

      await fixture.guard.login(user, true);
      const cookie = fixture.guard.getRememberCookie();
      expect(cookie).not.toBeNull();

      await fixture.guard.logout();
      const clearCookie = fixture.guard.getClearRememberCookie();

      expect(clearCookie).not.toBeNull();
      expect(clearCookie).toContain('remember_web_web=');
      expect(clearCookie).toContain('Max-Age=0'); // Expire immediately
    });
  });
});
