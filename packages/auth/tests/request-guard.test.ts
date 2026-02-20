import { beforeEach, describe, expect, it } from 'bun:test';
import type { Authenticatable } from '../src/contracts/authenticatable.ts';
import { RequestGuard } from '../src/guards/request-guard.ts';

function createMockUser(id: string | number = 42, _name: string = 'John'): Authenticatable {
  return {
    getAuthIdentifier: () => id,
    getAuthIdentifierName: () => 'id',
    getAuthPassword: () => 'hashed',
    getAuthPasswordName: () => 'password',
    getRememberToken: () => null,
    getRememberTokenName: () => 'remember_token',
    setRememberToken: () => {},
  };
}

describe('RequestGuard', () => {
  let guard: RequestGuard;

  beforeEach(() => {
    guard = new RequestGuard({
      check: async () => true,
      id: async () => 42,
      user: async () => createMockUser(),
      validate: async () => true,
    });
  });

  it('calls check callback and returns result', async () => {
    expect(await guard.check()).toBe(true);
  });

  it('calls user callback and returns user', async () => {
    const user = await guard.user();
    expect(user).not.toBeNull();
    expect(user?.getAuthIdentifier()).toBe(42);
  });

  it('calls id callback and returns id', async () => {
    expect(await guard.id()).toBe(42);
  });

  it('calls validate callback with credentials', async () => {
    const credentials = { email: 'john@example.com', password: 'secret' };
    expect(await guard.validate(credentials)).toBe(true);
  });

  it('guest returns opposite of check', async () => {
    expect(await guard.guest()).toBe(false); // check is true, so guest is false
  });

  it('handles check callback returning false', async () => {
    const notAuthGuard = new RequestGuard({
      check: async () => false,
      id: async () => null,
      user: async () => null,
    });

    expect(await notAuthGuard.check()).toBe(false);
    expect(await notAuthGuard.guest()).toBe(true);
  });

  it('handles user callback returning null', async () => {
    const noUserGuard = new RequestGuard({
      user: async () => null,
    });

    expect(await noUserGuard.user()).toBeNull();
  });

  it('handles missing optional callbacks with defaults', async () => {
    const minimalGuard = new RequestGuard({});

    expect(await minimalGuard.check()).toBe(false);
    expect(await minimalGuard.user()).toBeNull();
    expect(await minimalGuard.id()).toBeNull();
    expect(await minimalGuard.guest()).toBe(true);
    expect(await minimalGuard.validate({})).toBe(false);
  });

  it('allows custom closure logic with complex conditions', async () => {
    let checkCount = 0;

    const complexGuard = new RequestGuard({
      check: async () => {
        checkCount++;
        return checkCount > 0;
      },
      user: async () => {
        if (checkCount > 0) {
          return createMockUser(99, 'Admin');
        }
        return null;
      },
    });

    const firstCheck = await complexGuard.check();
    expect(firstCheck).toBe(true);
    expect(checkCount).toBe(1);

    const user = await complexGuard.user();
    expect(user?.getAuthIdentifier()).toBe(99);
    expect(checkCount).toBe(1); // user() independent call
  });

  it('validate with specific credentials check', async () => {
    const guard = new RequestGuard({
      validate: async (credentials: Record<string, unknown>) => {
        return credentials.email === 'admin@example.com' && credentials.password === 'super-secret';
      },
    });

    expect(await guard.validate({ email: 'admin@example.com', password: 'super-secret' })).toBe(true);
    expect(await guard.validate({ email: 'admin@example.com', password: 'wrong' })).toBe(false);
    expect(await guard.validate({ email: 'user@example.com', password: 'super-secret' })).toBe(false);
  });

  it('caches user instance across calls to avoid repeated callback execution', async () => {
    let userCallCount = 0;
    const user = createMockUser(123);

    const cachedGuard = new RequestGuard({
      user: async () => {
        userCallCount++;
        return user;
      },
    });

    const first = await cachedGuard.user();
    const second = await cachedGuard.user();

    expect(first).toBe(second);
    expect(userCallCount).toBe(1); // Cached - callback only called once
  });
});
