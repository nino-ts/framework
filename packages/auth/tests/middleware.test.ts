import { describe, expect, it } from 'bun:test';
import { AuthManager } from '@/auth-manager.ts';
import type { Authenticatable } from '@/contracts/authenticatable.ts';
import type { Guard } from '@/contracts/guard.ts';
import { Authenticate } from '@/middleware/authenticate.ts';
import { RedirectIfAuthenticated } from '@/middleware/guest.ts';

function createMockGuard(isAuthenticated: boolean): Guard {
  const mockUser: Authenticatable | null = isAuthenticated
    ? {
        getAuthIdentifier: () => 1,
        getAuthIdentifierName: () => 'id',
        getAuthPassword: () => 'hashed',
        getAuthPasswordName: () => 'password',
        getRememberToken: () => null,
        getRememberTokenName: () => 'remember_token',
        setRememberToken: () => {},
      }
    : null;

  return {
    async check(): Promise<boolean> {
      return isAuthenticated;
    },
    async guest(): Promise<boolean> {
      return !isAuthenticated;
    },
    async id(): Promise<string | number | null> {
      return mockUser?.getAuthIdentifier() ?? null;
    },
    async user(): Promise<Authenticatable | null> {
      return mockUser;
    },
    async validate(): Promise<boolean> {
      return isAuthenticated;
    },
  };
}

function createAuthManager(isAuthenticated: boolean): AuthManager {
  const manager = new AuthManager({
    defaults: { guard: 'web' },
    guards: {
      web: { driver: 'session', provider: 'users' },
    },
  });

  manager.extend('session', () => createMockGuard(isAuthenticated));
  return manager;
}

const passthrough = async (_req: Request): Promise<Response> => new Response('OK', { status: 200 });

describe('Authenticate Middleware', () => {
  it('passes request when user is authenticated', async () => {
    const auth = new Authenticate(createAuthManager(true));
    const request = new Request('http://localhost/dashboard');

    const response = await auth.handle(request, passthrough);
    expect(response.status).toBe(200);
    expect(await response.text()).toBe('OK');
  });

  it('returns 401 for unauthenticated JSON request', async () => {
    const auth = new Authenticate(createAuthManager(false));
    const request = new Request('http://localhost/api/data', {
      headers: { Accept: 'application/json' },
    });

    const response = await auth.handle(request, passthrough);
    expect(response.status).toBe(401);

    const body = await response.json();
    expect(body.message).toBe('Unauthenticated.');
  });

  it('returns 401 text for unauthenticated non-JSON request', async () => {
    const auth = new Authenticate(createAuthManager(false));
    const request = new Request('http://localhost/dashboard');

    const response = await auth.handle(request, passthrough);
    expect(response.status).toBe(401);
    expect(await response.text()).toBe('Unauthenticated.');
  });
});

describe('RedirectIfAuthenticated Middleware', () => {
  it('passes request when user is a guest', async () => {
    const middleware = new RedirectIfAuthenticated(createAuthManager(false));
    const request = new Request('http://localhost/login');

    const response = await middleware.handle(request, passthrough);
    expect(response.status).toBe(200);
    expect(await response.text()).toBe('OK');
  });

  it('redirects when user is authenticated', async () => {
    const middleware = new RedirectIfAuthenticated(createAuthManager(true));
    const request = new Request('http://localhost/login');

    const response = await middleware.handle(request, passthrough);
    expect(response.status).toBe(302);
    expect(response.headers.get('Location')).toBe('/');
  });
});
