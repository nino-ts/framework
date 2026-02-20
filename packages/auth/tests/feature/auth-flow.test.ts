import { beforeEach, describe, expect, it } from 'bun:test';
import type { Authenticatable } from '@/contracts/authenticatable.ts';
import type { SessionInterface } from '@/contracts/session-interface.ts';
import type { UserProvider } from '@/contracts/user-provider.ts';
import { SessionGuard } from '@/guards/session-guard.ts';
import { BcryptHasher } from '@/hashing/bcrypt-hasher.ts';

/**
 * Integration tests for authentication flow: signup → login → logout
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

/**
 * Fixture that simulates a simple "database" of users
 */
function createAuthFixture() {
  const users = new Map<number, Authenticatable>();
  const hasher = new BcryptHasher();
  const nextUserId = { value: 1 };

  const provider: UserProvider = {
    async retrieveByCredentials(credentials: Record<string, unknown>): Promise<Authenticatable | null> {
      // Simple implementation: find user by checking all users
      // In real app, this would query database
      for (const user of users.values()) {
        // Store email in a hacky way in the mock user
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
    async retrieveByToken(_id: string | number, _token: string): Promise<Authenticatable | null> {
      return null;
    },
    async updateRememberToken(_user: Authenticatable, _token: string): Promise<void> {
      // no-op for basic test
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

  /**
   * Signup: create user with email/password
   */
  async function signup(email: string, password: string): Promise<Authenticatable> {
    const passwordHash = await hasher.make(password);
    const user = createMockUser(nextUserId.value++, email, passwordHash);
    // Store email for credential lookup
    (user as any).email = email;
    users.set(user.getAuthIdentifier() as number, user);
    return user;
  }

  return {
    guard,
    hasher,
    provider,
    session,
    signup,
    users,
  };
}

describe('Auth Flow — Integration Tests', () => {
  let fixture: ReturnType<typeof createAuthFixture>;

  beforeEach(() => {
    fixture = createAuthFixture();
  });

  describe('Signup → Login → Logout', () => {
    it('should signup a new user and immediately be logged in', async () => {
      const email = 'alice@example.com';
      const password = 'secure-password-123';

      const user = await fixture.signup(email, password);
      await fixture.guard.login(user);

      // User should be authenticated after login
      expect(await fixture.guard.check()).toBe(true);
      expect(await fixture.guard.guest()).toBe(false);

      const loggedInUser = await fixture.guard.user();
      expect(loggedInUser).not.toBeNull();
      expect(loggedInUser?.getAuthIdentifier()).toBe(user.getAuthIdentifier());
    });

    it('should login with correct email and password', async () => {
      const email = 'bob@example.com';
      const password = 'password123';

      await fixture.signup(email, password);

      const result = await fixture.guard.attempt({ email, password }, false);

      expect(result).toBe(true);
      expect(await fixture.guard.check()).toBe(true);
      expect(await fixture.guard.guest()).toBe(false);
    });

    it('should reject login with incorrect password', async () => {
      const email = 'charlie@example.com';
      const password = 'correct-password';

      await fixture.signup(email, password);

      const result = await fixture.guard.attempt({ email, password: 'wrong-password' }, false);

      expect(result).toBe(false);
      expect(await fixture.guard.check()).toBe(false);
      expect(await fixture.guard.guest()).toBe(true);
    });

    it('should reject login with non-existent email', async () => {
      const result = await fixture.guard.attempt({ email: 'nobody@example.com', password: 'anypassword' }, false);

      expect(result).toBe(false);
      expect(await fixture.guard.check()).toBe(false);
    });

    it('should logout and clear session', async () => {
      const email = 'diana@example.com';
      const password = 'password123';

      const user = await fixture.signup(email, password);
      await fixture.guard.login(user);

      expect(await fixture.guard.check()).toBe(true);

      await fixture.guard.logout();

      expect(await fixture.guard.check()).toBe(false);
      expect(await fixture.guard.guest()).toBe(true);
      expect(await fixture.guard.user()).toBeNull();
    });

    it('should return null id when guest', async () => {
      expect(await fixture.guard.id()).toBeNull();
    });

    it('should return user id when authenticated', async () => {
      const user = await fixture.signup('eve@example.com', 'password123');
      await fixture.guard.login(user);

      expect(await fixture.guard.id()).toBe(user.getAuthIdentifier());
    });

    it('should store user id in session after login', async () => {
      const user = await fixture.signup('frank@example.com', 'password123');

      // Session should be empty before login
      expect(fixture.session.store.size).toBe(0);

      // After login, session should have at least one entry (the user id)
      await fixture.guard.login(user);

      expect(fixture.session.store.size).toBeGreaterThan(0);
      expect(await fixture.guard.id()).toBe(user.getAuthIdentifier());
    });
  });

  describe('Multiple Users', () => {
    it('should support multiple users without cross-contamination', async () => {
      const user1 = await fixture.signup('user1@example.com', 'password1');
      const user2 = await fixture.signup('user2@example.com', 'password2');

      // Login as user1
      await fixture.guard.login(user1);
      expect(await fixture.guard.id()).toBe(1);

      // Logout
      await fixture.guard.logout();
      expect(await fixture.guard.check()).toBe(false);

      // Login as user2
      await fixture.guard.login(user2);
      expect(await fixture.guard.id()).toBe(2);
      const user2Logged = await fixture.guard.user();
      expect(user2Logged?.getAuthIdentifier()).toBe(2);
    });
  });
});
