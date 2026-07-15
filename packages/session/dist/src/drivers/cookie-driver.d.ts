import type { SessionDriver } from "../types";
/**
 * Cookie-based session driver.
 *
 * Stores session data in encrypted cookies.
 * Best for small, stateless sessions.
 */
export declare class CookieDriver implements SessionDriver {
    /**
     * Maximum cookie size (4KB limit for cookies).
     */
    private readonly MAX_COOKIE_SIZE;
    /**
     * Read session data from cookie.
     *
     * Note: In practice, this reads from the request cookie header.
     *
     * @param id - The session ID (ignored for cookie driver)
     * @returns The session data or null
     */
    read(_id: string): Promise<Record<string, unknown> | null>;
    /**
     * Write session data to cookie.
     *
     * @param _id - The session ID (ignored for cookie driver)
     * @param data - The session data
     * @returns Whether the write was successful
     */
    write(_id: string, data: Record<string, unknown>): Promise<boolean>;
    /**
     * Destroy session (clear cookie).
     *
     * @param _id - The session ID
     * @returns Whether the destroy was successful
     */
    destroy(_id: string): Promise<boolean>;
    /**
     * Check if session exists (always true for cookie driver).
     *
     * @param _id - The session ID
     * @returns Always true
     */
    exists(_id: string): Promise<boolean>;
    /**
     * Serialize session data to cookie string.
     *
     * @param data - The session data
     * @param config - Cookie configuration
     * @returns Cookie header value
     */
    toCookieString(data: Record<string, unknown>, config: {
        name: string;
        maxAge: number;
        path: string;
        secure: boolean;
        httpOnly: boolean;
        sameSite: string;
    }): string;
}
