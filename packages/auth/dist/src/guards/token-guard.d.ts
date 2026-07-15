import type { Authenticatable } from "../contracts/authenticatable";
import type { Guard } from "../contracts/guard";
import type { UserProvider } from "../contracts/user-provider";
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
export declare class TokenGuard implements Guard {
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
    protected userInstance: Authenticatable | null;
    /**
     * Flag indicating whether the user has been retrieved.
     */
    protected userHasRetrieved: boolean;
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
    constructor(provider: UserProvider, request: Request, inputKey?: string, storageKey?: string);
    /**
     * Determine if the current user is authenticated.
     *
     * @returns True if the user is authenticated, false otherwise
     */
    check(): Promise<boolean>;
    /**
     * Determine if the current user is a guest (not authenticated).
     *
     * @returns True if the user is not authenticated, false otherwise
     */
    guest(): Promise<boolean>;
    /**
     * Get the currently authenticated user.
     *
     * @returns The authenticated user or null if not authenticated
     */
    user(): Promise<Authenticatable | null>;
    /**
     * Get the ID for the currently authenticated user.
     *
     * @returns The user's ID or null if not authenticated
     */
    id(): Promise<string | number | null>;
    /**
     * Validate a user's credentials.
     *
     * @param credentials - The credentials to validate
     * @returns True if the credentials are valid, false otherwise
     */
    validate(credentials: Record<string, unknown>): Promise<boolean>;
    /**
     * Extract the token from the request.
     *
     * Checks query parameters first, then the Authorization header (Bearer scheme).
     *
     * @returns The token or null if not found
     */
    protected getTokenFromRequest(): string | null;
}
