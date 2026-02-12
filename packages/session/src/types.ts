export interface SessionConfig {
    /**
     * Session driver to use.
     *
     * Supported drivers: 'memory' (in-memory), 'file' (filesystem), 'database' (for sessionStorage).
     * Custom drivers can be registered by extending SessionManager.
     */
    driver: 'file' | 'database' | 'memory' | string;

    /**
     * Session lifetime in minutes.
     */
    lifetime: number;

    /**
     * Session cookie name.
     */
    cookie?: string;

    /**
     * Session file storage path.
     */
    files?: string;

    /**
     * Session database connection.
     */
    connection?: string;

    /**
     * Session database table.
     */
    table?: string;
}
