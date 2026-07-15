import type { SessionDriver } from "../contracts/session-driver";
/**
 * File-based session driver using Bun native file I/O.
 *
 * The session storage directory must exist and be writable.
 * Sessions are persisted as JSON files with expiration metadata.
 *
 * @example
 * ```typescript
 * const driver = new FileSessionDriver('./storage/sessions');
 * await driver.write('session-id', { user_id: 1 }, 3600);
 * const data = await driver.read('session-id');
 * ```
 */
export declare class FileSessionDriver implements SessionDriver {
    private path;
    /**
     * Create a new file session driver.
     *
     * The directory at `path` must exist and be writable.
     * If the directory doesn't exist, write operations will fail.
     *
     * @param path - Absolute or relative path to session storage directory
     */
    constructor(path: string);
    read(sessionId: string): Promise<Record<string, unknown>>;
    write(sessionId: string, data: Record<string, unknown>, lifetime: number): Promise<boolean>;
    /**
     * Destroy a session file.
     *
     * Uses Bun native file deletion to remove the session file.
     */
    destroy(sessionId: string): Promise<boolean>;
    /**
     * Garbage collect expired sessions.
     *
     * Scans the session directory and removes expired session files.
     * Uses Bun's Glob API for directory scanning and native file deletion.
     *
     * @param _maxLifetime - Not used (for API compatibility with SessionDriver)
     * @returns Number of sessions garbage collected
     */
    gc(_maxLifetime: number): Promise<number>;
}
