import type { SessionConfig, SessionDriver } from "../types";
/**
 * Session class.
 *
 * Provides a convenient interface for working with session data,
 * regardless of the underlying driver.
 */
export declare class Session {
    /**
     * The session ID.
     */
    private id;
    /**
     * The session data.
     */
    private data;
    /**
     * The session driver.
     */
    private driver;
    /**
     * Whether the session has been modified.
     */
    private isModified;
    /**
     * Create a new session instance.
     *
     * @param id - The session ID
     * @param driver - The session driver
     * @param data - Initial session data
     */
    constructor(id: string, driver: SessionDriver, data?: Record<string, unknown>);
    /**
     * Get the session ID.
     *
     * @returns The session ID
     */
    getId(): string;
    /**
     * Get a value from the session.
     *
     * @param key - The key to get
     * @param defaultValue - Default value if key doesn't exist
     * @returns The value or default
     */
    get<T = unknown>(key: string, defaultValue?: T): T;
    /**
     * Set a value in the session.
     *
     * @param key - The key to set
     * @param value - The value to set
     */
    set(key: string, value: unknown): void;
    /**
     * Remove a value from the session.
     *
     * @param key - The key to remove
     */
    forget(key: string): void;
    /**
     * Check if a key exists in the session.
     *
     * @param key - The key to check
     * @returns Whether the key exists
     */
    has(key: string): boolean;
    /**
     * Get all session data.
     *
     * @returns The session data
     */
    all(): Record<string, unknown>;
    /**
     * Flash data for the next request only.
     *
     * @param key - The key to flash
     * @param value - The value to flash
     */
    flash(key: string, value: unknown): void;
    /**
     * Get and remove flashed data.
     *
     * @param key - The key to get
     * @returns The flashed value or undefined
     */
    getFlash<T = unknown>(key: string): T | undefined;
    /**
     * Regenerate the session ID.
     *
     * @returns The new session ID
     */
    regenerate(): Promise<string>;
    /**
     * Save the session data.
     *
     * @returns Whether the save was successful
     */
    save(): Promise<boolean>;
    /**
     * Invalidate the session.
     *
     * @returns Whether the invalidation was successful
     */
    invalidate(): Promise<boolean>;
    /**
     * Generate a unique session ID.
     *
     * @returns The generated session ID
     */
    private generateId;
}
/**
 * Session manager.
 *
 * Creates and manages session instances using a driver.
 */
export declare class SessionManager {
    /**
     * The session driver.
     */
    private driver;
    /**
     * Create a new session manager.
     *
     * @param driver - The session driver
     * @param config - Session configuration
     */
    constructor(driver: SessionDriver, config: SessionConfig);
    /**
     * Create a new session.
     *
     * @param id - Optional session ID (generates one if not provided)
     * @returns The session instance
     */
    create(id?: string): Promise<Session>;
    /**
     * Get an existing session or create a new one.
     *
     * @param id - The session ID
     * @returns The session instance
     */
    getOrCreate(id: string): Promise<Session>;
    /**
     * Destroy a session.
     *
     * @param id - The session ID
     * @returns Whether the destroy was successful
     */
    destroy(id: string): Promise<boolean>;
    /**
     * Generate a unique session ID.
     *
     * @returns The generated session ID
     */
    private generateId;
}
