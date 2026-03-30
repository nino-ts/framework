import type { AuthManager } from '@/auth-manager';

/**
 * Authentication middleware factory.
 *
 * Creates a middleware that checks if user is authenticated.
 * Returns 401 for unauthenticated requests.
 *
 * @param auth - AuthManager instance
 * @returns Middleware function
 *
 * @example
 * ```typescript
 * const auth = new AuthManager();
 * app.use(authenticate(auth));
 * ```
 */
export function authenticate(auth: AuthManager) {
  return async (request: Request, next: (req: Request) => Promise<Response>): Promise<Response> => {
    const authenticated = await auth.check();

    if (!authenticated) {
      const accept = request.headers.get('Accept') || '';

      if (accept.includes('application/json')) {
        return new Response(JSON.stringify({ error: 'Unauthorized' }), {
          headers: { 'Content-Type': 'application/json' },
          status: 401,
        });
      }

      return new Response('Unauthorized', { status: 401 });
    }

    return await next(request);
  };
}
