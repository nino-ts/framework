import type { Authenticatable } from '@/contracts/authenticatable.ts';
import type { Guard } from '@/contracts/guard.ts';

/**
 * Callback definitions for RequestGuard.
 *
 * Each method is optional and defaults to safe values:
 * - `check`: defaults to `false`
 * - `user`: defaults to `null`
 * - `id`: defaults to `null`
 * - `guest`: computed as `!check()`
 * - `validate`: defaults to `false`
 *
 * This flexibility allows you to implement any authentication logic:
 * custom headers, external services, database queries, etc.
 */
export interface GuardCallback {
  /**
   * Determine if the current request is authenticated.
   *
   * Should return `true` if the request carries valid authentication credentials.
   */
  check?: () => Promise<boolean>;

  /**
   * Get the authenticated user for this request.
   *
   * Should return the user object if authenticated, or `null` otherwise.
   * The result is cached across multiple calls to avoid repeated execution.
   */
  user?: () => Promise<Authenticatable | null>;

  /**
   * Get the authenticated user's ID for this request.
   *
   * Should return the unique identifier for the authenticated user,
   * or `null` if not authenticated.
   */
  id?: () => Promise<string | number | null>;

  /**
   * Validate credentials using custom logic.
   *
   * Should return `true` if the provided credentials are valid, `false` otherwise.
   * This method is used for authentication attempts (e.g., login).
   *
   * @param credentials - Object containing authentication credentials (email, password, etc)
   */
  validate?: (credentials: Record<string, unknown>) => Promise<boolean>;
}

/**
 * A flexible guard that uses custom callbacks for authentication logic.
 *
 * RequestGuard is useful when you need custom authentication logic that doesn't fit
 * the standard provider-based patterns (SessionGuard, TokenGuard). Each method delegates
 * to a user-provided callback, allowing complete flexibility for domain-specific needs.
 *
 * Callbacks are infrastructure-agnostic: authenticate based on custom headers,
 * query parameters, external services, database queries, or any other mechanism.
 *
 * All callbacks are optional and default to safe values:
 * - check returns false, user returns null, id returns null, validate returns false
 * - guest is computed as !check()
 *
 * The user() callback result is cached to avoid repeated execution.
 *
 * @see Guard for the interface contract
 * @see AuthManager.extend() for registering custom guard factories
 */
export class RequestGuard implements Guard {
  protected callbacks: GuardCallback;
  protected cachedUser: Authenticatable | null | undefined;

  /**
   * Create a new RequestGuard instance.
   *
   * @param callbacks - Object containing the authentication callback functions.
   *                    All callbacks are optional.
   */
  constructor(callbacks: GuardCallback = {}) {
    this.callbacks = callbacks;
  }

  async check(): Promise<boolean> {
    if (!this.callbacks.check) {
      return false;
    }
    return this.callbacks.check();
  }

  async guest(): Promise<boolean> {
    return !(await this.check());
  }

  async user(): Promise<Authenticatable | null> {
    if (this.cachedUser !== undefined) {
      return this.cachedUser;
    }

    if (!this.callbacks.user) {
      return null;
    }

    this.cachedUser = await this.callbacks.user();
    return this.cachedUser;
  }

  async id(): Promise<string | number | null> {
    if (!this.callbacks.id) {
      return null;
    }
    return this.callbacks.id();
  }

  async validate(credentials: Record<string, unknown>): Promise<boolean> {
    if (!this.callbacks.validate) {
      return false;
    }
    return this.callbacks.validate(credentials);
  }
}
