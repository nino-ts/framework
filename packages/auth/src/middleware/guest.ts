import type { AuthManager } from '@/auth-manager';

/**
 * Guest middleware factory.
 *
 * Creates a middleware that redirects authenticated users.
 * Allows only guests (unauthenticated) to access.
 *
 * @param auth - AuthManager instance
 * @returns Middleware function
 *
 * @example
 * ```typescript
 * const auth = new AuthManager();
 * app.use(guest(auth)); // Redirects logged-in users
 * ```
 */
export function guest(auth: AuthManager) {
  return async (request: Request, next: (req: Request) => Promise<Response>): Promise<Response> => {
    const authenticated = await auth.check();

    if (authenticated) {
      const url = new URL(request.url);
      const redirectUrl = url.searchParams.get('redirect') || '/home';

      return Response.redirect(redirectUrl, 302);
    }

    return await next(request);
  };
}
