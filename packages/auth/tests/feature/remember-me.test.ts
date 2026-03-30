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
    get<T = unknown>(key: string, defaultValue?: T): T {
      return (store.has(key) ? store.get(key) : defaultValue) as T;
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
      const email = credentials.email as string | undefined;
      if (!email) return null;
      
      for (const user of users.values()) {
        const userEmail = (user as unknown as Record<string, unknown>).email as string | undefined;
        if (userEmail === email) {
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
    async retrieveByTokenOnly(_token: string): Promise<Authenticatable | null> {
      return null;
    },
    async updateRememberToken(user: Authenticatable, token: string): Promise<void> {
      user.setRememberToken(token);
    },
    async validateCredentials(user: Authenticatable, credentials: Record<string, unknown>): Promise<boolean> {
      const passwordHash = user.getAuthPassword();
      const password = credentials.password as string | undefined;

      if (!password) return false;

      try {
        return await hasher.verify(password, passwordHash);
      } catch {
        return false;
      }
    },
  };

  const session = createMockSession();
  const guard = new SessionGuard('web', provider, session);

  async function createUser(email: string, password: string): Promise<Authenticatable> {
    const passwordHash = await hasher.hash(password);
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

describe('Remember Me (Integration)', () => {
  let fixture: ReturnType<typeof createRememberMeFixture>;

  beforeEach(() => {
    fixture = createRememberMeFixture();
  });

  it('should login user without remember me', async () => {
    const { guard, createUser } = fixture;

    const user = await createUser('alice@example.com', 'password123');

    // Login without remember me
    const authenticated = await guard.attempt(
      { email: 'alice@example.com', password: 'password123' },
      false
    );

    expect(authenticated).toBe(true);
    expect(await guard.check()).toBe(true);
    expect(await guard.user()).toBe(user);
  });

  it('should login user with remember me', async () => {
    const { guard, createUser, generateRememberToken, provider } = fixture;

    const user = await createUser('bob@example.com', 'password123');
    const token = generateRememberToken();

    // Update remember token in provider
    await provider.updateRememberToken(user, token);

    // Login with remember me
    const authenticated = await guard.attempt(
      { email: 'bob@example.com', password: 'password123' },
      true
    );

    expect(authenticated).toBe(true);
    expect(await guard.check()).toBe(true);
  });

  it('should retrieve user by remember token', async () => {
    const { provider, createUser, generateRememberToken } = fixture;

    const user = await createUser('charlie@example.com', 'password123');
    const token = generateRememberToken();

    // Set remember token
    await provider.updateRememberToken(user, token);

    // Retrieve by token
    const retrieved = await provider.retrieveByToken(user.getAuthIdentifier(), token);

    expect(retrieved).toBe(user);
  });

  it('should reject invalid remember token', async () => {
    const { provider, createUser } = fixture;

    const user = await createUser('diana@example.com', 'password123');

    // Try to retrieve with wrong token
    const retrieved = await provider.retrieveByToken(user.getAuthIdentifier(), 'wrong_token');

    expect(retrieved).toBeNull();
  });
});
