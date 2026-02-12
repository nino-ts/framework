export interface SessionDriver {
    /**
     * Read session data.
     */
    read(sessionId: string): Promise<Record<string, unknown>>;

    /**
     * Write session data.
     */
    write(sessionId: string, data: Record<string, unknown>, lifetime: number): Promise<boolean>;

    /**
     * Destroy a session.
     */
    destroy(sessionId: string): Promise<boolean>;

    /**
     * Garbage collect old sessions.
     */
    gc(maxLifetime: number): Promise<number>;
}
