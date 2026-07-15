import type { SessionDriver } from "./contracts/session-driver";
/**
 * Session manager class.
 */
export declare class Session {
    protected driver: SessionDriver;
    protected id: string;
    protected token: string;
    protected name: string;
    protected attributes: Record<string, unknown>;
    protected started: boolean;
    constructor(driver: SessionDriver, name: string, id?: string, token?: string);
    /**
     * Start the session, reading data from driver.
     */
    start(): Promise<boolean>;
    /**
     * Get the session ID.
     */
    getId(): string;
    /**
     * Set the session ID.
     */
    setId(id: string): void;
    /**
     * Get the session token.
     */
    getToken(): string;
    /**
     * Set the session token.
     */
    setToken(token: string): void;
    /**
     * Get the session name.
     */
    getName(): string;
    /**
     * Get a value from the session.
     */
    get<T = unknown>(key: string, defaultValue?: T): T;
    /**
     * Set a value in the session.
     */
    put(key: string, value: unknown): void;
    /**
     * Get all attributes.
     */
    all(): Record<string, unknown>;
    /**
     * Check if a key exists.
     */
    has(key: string): boolean;
    /**
     * Remove a key from the session.
     */
    forget(key: string): void;
    /**
     * Remove all data from the session.
     */
    flush(): void;
    /**
     * Save the session data to the driver.
     */
    save(lifetime?: number): Promise<void>;
    /**
     * Invalidate the session (regenerate ID and keep data or flush).
     */
    invalidate(): Promise<boolean>;
    /**
     * Regenerate the session ID.
     */
    regenerate(destroy?: boolean): Promise<boolean>;
    /**
     * Regenerate the session token and return the new token.
     *
     * The token is a cryptographically secure random string used to identify the session
     * in cookies, headers, or other transport mechanisms. This method generates a new token
     * and persists it via save().
     *
     * @returns The newly generated session token
     */
    regenerateToken(): Promise<string>;
    /**
     * Flash a value to the session (next request only).
     */
    flash(key: string, value: unknown): void;
    /**
     * Reflash all flash data.
     */
    reflash(): void;
    /**
     * Keep specific flash data.
     */
    keep(keys?: string[]): void;
    /**
     * Age flash data.
     */
    ageFlashData(): void;
    private push;
    private removeFromOldFlash;
}
