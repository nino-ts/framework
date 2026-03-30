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
    get<T = unknown>(key: string, defaultValue?: T): T {
      return (store.has(key) ? store.get(key) : defaultValue) as T;
    },
    put(key: string, value: unknown): void {
      store.set(key, value);
    },
    async regenerate(): Promise<boolean> {
      return true;
    },
    getId(): string | null {
      return store.get('session_id') as string | null;
    },
    isStarted(): boolean {
      return store.get('started') as boolean;
    },
    token(): string {
      return store.get('_token') as string;
    },
  };
}

function createMockUser(
  id: string | number,
  email: string,
  password: string
): Authenticatable {
  return {
    getAuthIdentifierName(): string {
      return 'id';
    },
    getAuthIdentifier(): string | number {
      return id;
    },
    getAuthPassword(): string {
      return password;
    },
    getAuthPasswordName(): string {
      return 'password';
    },
    getRememberToken(): string | null {
      return null;
    },
    setRememberToken(_value: string | null): void {
      // no-op
    },
    getRememberTokenName(): string {
      return 'remember_token';
    },
    getId(): string | number {
      return id;
    },
    getEmail(): string | null {
      return email;
    },
    getName(): string | null {
      return null;
    },
    getPassword(): string | null {
      return password;
    },
  };
}

function createAuthFlowFixture() {
  const hasher = new BcryptHasher();
  const users = new Map<string | number, Authenticatable>();
  const nextUserId = { value: 1 };

  const provider: UserProvider = {
    async retrieveById(id: string | number): Promise<Authenticatable | null> {
      return users.get(id) ?? null;
    },
    async retrieveByToken(
      id: string | number,
      _token: string
    ): Promise<Authenticatable | null> {
      return users.get(id) ?? null;
    },
    async retrieveByTokenOnly(_token: string): Promise<Authenticatable | null> {
      return null;
    },
    async retrieveByCredentials(
      credentials: Record<string, unknown>
    ): Promise<Authenticatable | null> {
      const email = credentials.email as string | undefined;
      if (!email) return null;
      
      for (const user of users.values()) {
        if (user.getEmail() === email) {
          return user;
        }
      }
      return null;
    },
    async updateRememberToken(_user: Authenticatable, _token: string): Promise<void> {
      // no-op for basic test
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

  /**
   * Signup: create user with email/password
   */
  async function signup(email: string, password: string): Promise<Authenticatable> {
    const passwordHash = await hasher.hash(password);
    const user = createMockUser(nextUserId.value++, email, passwordHash);
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

describe('Auth Flow (Integration)', () => {
  let fixture: ReturnType<typeof createAuthFlowFixture>;

  beforeEach(() => {
    fixture = createAuthFlowFixture();
  });

  it('should authenticate user after signup', async () => {
    const { guard, signup } = fixture;

    // Signup
    await signup('test@example.com', 'password123');

    // Login
    const authenticated = await guard.attempt({
      email: 'test@example.com',
      password: 'password123',
    });
    expect(authenticated).toBe(true);
    expect(await guard.check()).toBe(true);
  });

  it('should reject invalid credentials', async () => {
    const { guard, signup } = fixture;

    // Signup
    await signup('test@example.com', 'password123');

    // Login with wrong password
    const authenticated = await guard.attempt({
      email: 'test@example.com',
      password: 'wrongpassword',
    });
    expect(authenticated).toBe(false);
    expect(await guard.check()).toBe(false);
  });

  it('should logout authenticated user', async () => {
    const { guard, signup } = fixture;

    // Signup and login
    await signup('test@example.com', 'password123');
    await guard.attempt({
      email: 'test@example.com',
      password: 'password123',
    });
    expect(await guard.check()).toBe(true);

    // Logout
    await guard.logout();
    expect(await guard.check()).toBe(false);
  });
});
