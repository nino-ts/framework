import { beforeEach, describe, expect, mock, test } from 'bun:test';
import { AuthManager } from '@/auth-manager';
import { authenticate } from '@/middleware/authenticate';
import { guest } from '@/middleware/guest';
import { createMockGuard } from '@/tests/mocks';

describe('Middleware', () => {
  describe('authenticate', () => {
    let authManager: AuthManager;
    let mockGuard: ReturnType<typeof createMockGuard>;
    let next: ReturnType<typeof mock>;

    beforeEach(() => {
      authManager = new AuthManager();
      mockGuard = createMockGuard();
      authManager.extend('session', () => mockGuard);
      next = mock().mockImplementation(() => new Response('OK', { status: 200 }));
    });

    test('should pass request when user authenticated', async () => {
      mockGuard.check = mock().mockResolvedValue(true);
      const middleware = authenticate(authManager);
      const request = new Request('http://test.com/protected');

      const response = await middleware(request, next);

      expect(response.status).toBe(200);
      expect(next).toHaveBeenCalled();
    });

    test('should return 401 for unauthenticated JSON request', async () => {
      mockGuard.check = mock().mockResolvedValue(false);
      const middleware = authenticate(authManager);
      const request = new Request('http://test.com/api', {
        headers: { Accept: 'application/json' },
      });

      const response = await middleware(request, next);

      expect(response.status).toBe(401);
      expect(next).not.toHaveBeenCalled();

      const body = (await response.json()) as { error: string };
      expect(body.error).toBe('Unauthorized');
    });

    test('should return 401 text for unauthenticated non-JSON', async () => {
      mockGuard.check = mock().mockResolvedValue(false);
      const middleware = authenticate(authManager);
      const request = new Request('http://test.com/page', {
        headers: { Accept: 'text/html' },
      });

      const response = await middleware(request, next);

      expect(response.status).toBe(401);
      expect(next).not.toHaveBeenCalled();

      const text = await response.text();
      expect(text).toBe('Unauthorized');
    });
  });

  describe('guest', () => {
    let authManager: AuthManager;
    let mockGuard: ReturnType<typeof createMockGuard>;
    let next: ReturnType<typeof mock>;

    beforeEach(() => {
      authManager = new AuthManager();
      mockGuard = createMockGuard();
      authManager.extend('session', () => mockGuard);
      next = mock().mockImplementation(() => new Response('OK', { status: 200 }));
    });

    test('should pass request when user is guest', async () => {
      mockGuard.check = mock().mockResolvedValue(false);
      const middleware = guest(authManager);
      const request = new Request('http://test.com/login');

      const response = await middleware(request, next);

      expect(response.status).toBe(200);
      expect(next).toHaveBeenCalled();
    });

    test('should redirect when user authenticated', async () => {
      mockGuard.check = mock().mockResolvedValue(true);
      const middleware = guest(authManager);
      const request = new Request('http://test.com/login');

      const response = await middleware(request, next);

      expect(response.status).toBe(302);
      expect(next).not.toHaveBeenCalled();
    });

    test('should redirect to /home by default', async () => {
      mockGuard.check = mock().mockResolvedValue(true);
      const middleware = guest(authManager);
      const request = new Request('http://test.com/login');

      const response = await middleware(request, next);

      const location = response.headers.get('Location');
      expect(location).toBe('/home');
    });

    test('should redirect to custom URL', async () => {
      mockGuard.check = mock().mockResolvedValue(true);
      const middleware = guest(authManager);
      const request = new Request('http://test.com/login?redirect=/dashboard');

      const response = await middleware(request, next);

      const location = response.headers.get('Location');
      expect(location).toBe('/dashboard');
    });
  });
});
