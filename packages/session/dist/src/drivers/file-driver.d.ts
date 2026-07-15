import type { SessionDriver } from "../types";
/**
 * File-based session driver.
 *
 * Stores session data as JSON files on disk.
 * Best for single-server deployments.
 */
export declare class FileDriver implements SessionDriver {
    /**
     * The directory where session files are stored.
     */
    private directory;
    /**
     * Create a new file driver instance.
     *
     * @param directory - The session storage directory
     */
    constructor(directory: string);
    /**
     * Get the file path for a session ID.
     *
     * @param id - The session ID
     * @returns The file path
     */
    private filePath;
    /**
     * Read session data from file.
     *
     * @param id - The session ID
     * @returns The session data or null if not found
     */
    read(id: string): Promise<Record<string, unknown> | null>;
    /**
     * Write session data to file.
     *
     * @param id - The session ID
     * @param data - The session data
     * @returns Whether the write was successful
     */
    write(id: string, data: Record<string, unknown>): Promise<boolean>;
    /**
     * Destroy a session file.
     *
     * @param id - The session ID
     * @returns Whether the destroy was successful
     */
    destroy(id: string): Promise<boolean>;
    /**
     * Check if a session file exists.
     *
     * @param id - The session ID
     * @returns Whether the session exists
     */
    exists(id: string): Promise<boolean>;
}
