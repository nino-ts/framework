import type { Authenticatable } from "../contracts/authenticatable";
import type { StatefulGuard } from "../contracts/guard";
import type { SessionInterface } from "../contracts/session-interface";
import type { UserProvider } from "../contracts/user-provider";
export declare class SessionGuard implements StatefulGuard {
    protected name: string;
    protected provider: UserProvider;
    protected session: SessionInterface;
    protected userInstance: Authenticatable | null;
    protected loggedOut: boolean;
    private lastRememberCookie;
    constructor(name: string, provider: UserProvider, session: SessionInterface);
    check(): Promise<boolean>;
    guest(): Promise<boolean>;
    user(rememberCookie?: string): Promise<Authenticatable | null>;
    id(): Promise<string | number | null>;
    validate(credentials: Record<string, unknown>): Promise<boolean>;
    attempt(credentials: Record<string, unknown>, remember?: boolean): Promise<boolean>;
    login(user: Authenticatable, remember?: boolean): Promise<void>;
    loginUsingId(id: string | number, remember?: boolean): Promise<Authenticatable | false>;
    logout(): Promise<void>;
    protected updateSession(id: string | number): void;
    protected getName(): string;
    /**
     * Get the Set-Cookie header value for remember cookie.
     * Returns null if remember=false was used in login().
     *
     * @returns Set-Cookie header value or null
     */
    getRememberCookie(): string | null;
    /**
     * Get the Set-Cookie header value to clear remember cookie.
     * Used during logout to expire the cookie.
     *
     * @returns Set-Cookie header value with Max-Age=0
     */
    getClearRememberCookie(): string;
    /**
     * Build Set-Cookie header value for remember cookie.
     *
     * Format: remember_web_web={userId}|{token}; HttpOnly; SameSite=Lax; Max-Age=1209600; Path=/
     *
     * @param userId - User identifier
     * @param token - Remember token (UUID)
     * @returns Set-Cookie header value
     */
    private buildRememberCookie;
    /**
     * Parse remember cookie value and validate format.
     *
     * Expected format: {userId}|{token}
     * Validates:
     * - Cookie value is string with exactly one pipe separator
     * - Token is valid UUID format
     * - userId is not empty
     *
     * @param value - Cookie value from request
     * @returns Parsed userId and token, or null if invalid
     */
    private parseRememberCookie;
}
