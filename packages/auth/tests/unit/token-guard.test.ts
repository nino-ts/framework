import { describe, expect, test, beforeEach, mock } from 'bun:test';
import { TokenGuard } from '@/guards/token-guard.ts';
import { createMockProvider, createMockUser } from '@/tests/mocks/index.ts';

describe('TokenGuard', () => {
  let provider: ReturnType<typeof createMockProvider>;
  let guard: TokenGuard;

  beforeEach(() => {
    provider = createMockProvider();
    const request = new Request('http://test.com');
    guard = new TokenGuard(provider, request);
  });

  test('should authenticate via Bearer header', async () => {
    const mockUser = createMockUser({ id: 1 });
    provider.retrieveByTokenOnly = mock().mockResolvedValue(mockUser);

    const request = new Request('http://test.com', {
      headers: { Authorization: 'Bearer token123' }
    });
    guard = new TokenGuard(provider, request);

    expect(await guard.check()).toBe(true);
  });

  test('should authenticate via query parameter', async () => {
    const mockUser = createMockUser({ id: 1 });
    provider.retrieveByTokenOnly = mock().mockResolvedValue(mockUser);

    const request = new Request('http://test.com?token=token123');
    guard = new TokenGuard(provider, request);

    expect(await guard.check()).toBe(true);
  });

  test('should return null user without token', async () => {
    const request = new Request('http://test.com');
    guard = new TokenGuard(provider, request);

    expect(await guard.user()).toBeNull();
  });

  test('should return null user with invalid token', async () => {
    provider.retrieveByTokenOnly = mock().mockResolvedValue(null);

    const request = new Request('http://test.com', {
      headers: { Authorization: 'Bearer invalid' }
    });
    guard = new TokenGuard(provider, request);

    expect(await guard.user()).toBeNull();
  });

  test('should validate token credentials', async () => {
    const mockUser = createMockUser({ id: 1 });
    provider.retrieveByTokenOnly = mock().mockResolvedValue(mockUser);

    const request = new Request('http://test.com', {
      headers: { Authorization: 'Bearer token123' }
    });
    guard = new TokenGuard(provider, request);

    expect(await guard.validate({ token: 'token123' })).toBe(true);
  });

  test('should return false for invalid token in validate', async () => {
    provider.retrieveByTokenOnly = mock().mockResolvedValue(null);

    const result = await guard.validate({ token: 'invalid' });
    expect(result).toBe(false);
  });

  test('should return user id when authenticated', async () => {
    const mockUser = createMockUser({ id: 42 });
    provider.retrieveByTokenOnly = mock().mockResolvedValue(mockUser);

    const request = new Request('http://test.com', {
      headers: { Authorization: 'Bearer token123' }
    });
    guard = new TokenGuard(provider, request);

    expect(await guard.id()).toBe(42);
  });

  test('should return null id when not authenticated', async () => {
    const request = new Request('http://test.com');
    guard = new TokenGuard(provider, request);

    expect(await guard.id()).toBeNull();
  });

  test('should cache user on subsequent calls', async () => {
    const mockUser = createMockUser({ id: 1 });
    provider.retrieveByTokenOnly = mock().mockResolvedValue(mockUser);

    const request = new Request('http://test.com', {
      headers: { Authorization: 'Bearer token123' }
    });
    guard = new TokenGuard(provider, request);

    await guard.user();
    await guard.user();

    expect(provider.retrieveByTokenOnly).toHaveBeenCalledTimes(1);
  });

  test('should support custom input and storage keys', async () => {
    const mockUser = createMockUser({ id: 1 });
    provider.retrieveByTokenOnly = mock().mockResolvedValue(mockUser);

    const request = new Request('http://test.com?api_key=custom123');
    guard = new TokenGuard(provider, request, 'api_key', 'api_token');

    expect(await guard.check()).toBe(true);
  });
});
