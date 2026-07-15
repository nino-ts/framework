import type { AuthManager } from "../auth-manager";
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
export declare function authenticate(auth: AuthManager): (request: Request, next: (req: Request) => Promise<Response>) => Promise<Response>;
