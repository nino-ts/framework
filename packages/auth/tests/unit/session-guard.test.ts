import { beforeEach, describe, expect, mock, test } from 'bun:test';
import { SessionGuard } from '@/guards/session-guard.ts';
import { createMockProvider, createMockSession, createMockUser } from '@/tests/mocks/index.ts';

describe('SessionGuard', () => {
  let session: ReturnType<typeof createMockSession>;
  let provider: ReturnType<typeof createMockProvider>;
  let guard: SessionGuard;

  beforeEach(() => {
    session = createMockSession();
    provider = createMockProvider();
    guard = new SessionGuard('web', provider, session);
  });

  test('should return true for guest when no user', async () => {
    const result = await guard.guest();
    expect(result).toBe(true);
  });

  test('should return false for check when no user', async () => {
    const result = await guard.check();
    expect(result).toBe(false);
  });

  test('should return null user when not authenticated', async () => {
    const result = await guard.user();
    expect(result).toBeNull();
  });

  test('should return null id when not authenticated', async () => {
    const result = await guard.id();
    expect(result).toBeNull();
  });

  test('should attempt login with valid credentials', async () => {
    const mockUser = createMockUser({ email: 'test@example.com', id: 1 });
    provider.retrieveByCredentials = mock().mockResolvedValue(mockUser);
    provider.validateCredentials = mock().mockResolvedValue(true);

    const result = await guard.attempt({
      email: 'test@example.com',
      password: 'secret',
    });

    expect(result).toBe(true);
  });

  test('should reject login with invalid password', async () => {
    const mockUser = createMockUser({ id: 1 });
    provider.retrieveByCredentials = mock().mockResolvedValue(mockUser);
    provider.validateCredentials = mock().mockResolvedValue(false);

    const result = await guard.attempt({
      email: 'test@example.com',
      password: 'wrong',
    });

    expect(result).toBe(false);
  });

  test('should reject login with non-existent user', async () => {
    provider.retrieveByCredentials = mock().mockResolvedValue(null);

    const result = await guard.attempt({
      email: 'nonexistent@example.com',
      password: 'secret',
    });

    expect(result).toBe(false);
  });

  test('should login and set user', async () => {
    const mockUser = createMockUser({ id: 1 });
    await guard.login(mockUser);

    const user = await guard.user();
    expect(user).toBe(mockUser);
  });

  test('should login and store user id in session', async () => {
    const mockUser = createMockUser({ id: 42 });
    await guard.login(mockUser);

    const sessionKey = `login_web_${Buffer.from('SessionGuard').toString('hex')}`;
    expect(session.get<number>(sessionKey)).toBe(42);
  });

  test('should logout and clear user', async () => {
    const mockUser = createMockUser({ id: 1 });
    await guard.login(mockUser);
    await guard.logout();

    const user = await guard.user();
    expect(user).toBeNull();
    const sessionKey = `login_web_${Buffer.from('SessionGuard').toString('hex')}`;
    expect(session.get<number | undefined>(sessionKey)).toBeUndefined();
  });

  test('should loginUsingId and retrieve user', async () => {
    const mockUser = createMockUser({ id: 99 });
    provider.retrieveById = mock().mockResolvedValue(mockUser);

    const success = await guard.loginUsingId(99);

    expect(success).toBe(mockUser);
    const user = await guard.user();
    expect(user).toBe(mockUser);
  });

  test('should return false for loginUsingId with unknown id', async () => {
    provider.retrieveById = mock().mockResolvedValue(null);

    const success = await guard.loginUsingId(999);

    expect(success).toBe(false);
  });

  test('should validate credentials without login', async () => {
    const mockUser = createMockUser({ id: 1 });
    provider.retrieveByCredentials = mock().mockResolvedValue(mockUser);
    provider.validateCredentials = mock().mockResolvedValue(true);

    const result = await guard.validate({
      email: 'test@example.com',
      password: 'secret',
    });

    expect(result).toBe(true);
    const user = await guard.user();
    expect(user).toBeNull();
  });

  test('should cache user instance on subsequent calls', async () => {
    session.get = mock().mockReturnValue(1);
    provider.retrieveById = mock().mockResolvedValue(createMockUser({ id: 1 }));

    await guard.user();
    await guard.user();

    expect(provider.retrieveById).toHaveBeenCalledTimes(1);
  });

  test('should support remember me token', async () => {
    const mockUser = createMockUser({ id: 1 });
    await guard.login(mockUser, true);

    expect(mockUser.getRememberToken()).not.toBeNull();
  });
});
