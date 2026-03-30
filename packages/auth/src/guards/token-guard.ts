import type { Authenticatable } from '@/contracts/authenticatable.ts';
import type { Guard } from '@/contracts/guard.ts';
import type { UserProvider } from '@/contracts/user-provider.ts';

/**
 * Configuration options for TokenGuard.
 */
export interface TokenGuardConfig {
  /**
   * The input key to look for the token (query parameter or header).
   */
  inputKey?: string;

  /**
   * The storage key to use when retrieving the user.
   */
  storageKey?: string;
}

/**
 * TokenGuard - Token-based authentication guard.
 *
 * Authenticates users via API tokens passed in the Authorization header
 * (Bearer scheme) or as a query parameter.
 *
 * @example
 * ```typescript
 * const request = new Request('http://api.example.com/users');
 * const guard = new TokenGuard(provider, request);
 *
 * if (await guard.check()) {
 *   const user = await guard.user();
 *   console.log(`Authenticated user: ${user.getAuthIdentifier()}`);
 * }
 * ```
 */
export class TokenGuard implements Guard {
  /**
   * The user provider to retrieve users.
   */
  protected readonly provider: UserProvider;

  /**
   * The current HTTP request.
   */
  protected readonly request: Request;

  /**
   * The currently authenticated user instance.
   */
  protected userInstance: Authenticatable | null = null;

  /**
   * Flag indicating whether the user has been retrieved.
   */
  protected userHasRetrieved: boolean = false;

  /**
   * The input key to look for the token.
   */
  protected readonly inputKey: string;

  /**
   * The storage key to use when retrieving the user.
   */
  protected readonly storageKey: string;

  /**
   * Create a new TokenGuard instance.
   *
   * @param provider - The user provider to retrieve users
   * @param request - The current HTTP request
   * @param inputKey - The input key to look for the token (default: 'token')
   * @param storageKey - The storage key for token lookup (default: 'token')
   */
  constructor(
    provider: UserProvider,
    request: Request,
    inputKey: string = 'token',
    storageKey: string = 'token',
  ) {
    this.provider = provider;
    this.request = request;
    this.inputKey = inputKey;
    this.storageKey = storageKey;
  }

  /**
   * Determine if the current user is authenticated.
   *
   * @returns True if the user is authenticated, false otherwise
   */
  async check(): Promise<boolean> {
    return !await this.guest();
  }

  /**
   * Determine if the current user is a guest (not authenticated).
   *
   * @returns True if the user is not authenticated, false otherwise
   */
  async guest(): Promise<boolean> {
    const token = this.getTokenFromRequest();

    if (!token) {
      return true;
    }

    const user = await this.provider.retrieveByTokenOnly(token);
    return user === null;
  }

  /**
   * Get the currently authenticated user.
   *
   * @returns The authenticated user or null if not authenticated
   */
  async user(): Promise<Authenticatable | null> {
    if (this.userHasRetrieved) {
      return this.userInstance;
    }

    const token = this.getTokenFromRequest();

    if (!token) {
      this.userHasRetrieved = true;
      this.userInstance = null;
      return null;
    }

    this.userInstance = await this.provider.retrieveByTokenOnly(token);
    this.userHasRetrieved = true;

    return this.userInstance;
  }

  /**
   * Get the ID for the currently authenticated user.
   *
   * @returns The user's ID or null if not authenticated
   */
  async id(): Promise<string | number | null> {
    const user = await this.user();
    return user?.getAuthIdentifier() ?? null;
  }

  /**
   * Validate a user's credentials.
   *
   * @param credentials - The credentials to validate
   * @returns True if the credentials are valid, false otherwise
   */
  async validate(credentials: Record<string, unknown>): Promise<boolean> {
    const token = credentials[this.inputKey] as string | undefined;

    if (!token) {
      return false;
    }

    const user = await this.provider.retrieveByTokenOnly(token);
    return user !== null;
  }

  /**
   * Extract the token from the request.
   *
   * Checks query parameters first, then the Authorization header (Bearer scheme).
   *
   * @returns The token or null if not found
   */
  protected getTokenFromRequest(): string | null {
    const url = new URL(this.request.url);
    const queryToken = url.searchParams.get(this.inputKey);

    if (queryToken) {
      return queryToken;
    }

    const authHeader = this.request.headers.get('Authorization');

    if (authHeader?.startsWith('Bearer ')) {
      return authHeader.substring(7);
    }

    return null;
  }
}
