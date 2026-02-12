import { join } from 'node:path';
import type { SessionDriver } from '../contracts/session-driver';

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
export class FileSessionDriver implements SessionDriver {
    private path: string;

    /**
     * Create a new file session driver.
     *
     * The directory at `path` must exist and be writable.
     * If the directory doesn't exist, write operations will fail.
     *
     * @param path - Absolute or relative path to session storage directory
     */
    constructor(path: string) {
        this.path = path;
    }

    async read(sessionId: string): Promise<Record<string, unknown>> {
        const filePath = join(this.path, sessionId);
        const file = Bun.file(filePath);

        if (!(await file.exists())) {
            return {};
        }

        try {
            const content = await file.text();
            if (!content) return {};

            const data = JSON.parse(content);

            // Check expiration
            if (Date.now() >= data.expires) {
                return {};
            }

            return data.payload;
        } catch {
            return {};
        }
    }

    async write(sessionId: string, data: Record<string, unknown>, lifetime: number): Promise<boolean> {
        const filePath = join(this.path, sessionId);
        const expires = Date.now() + lifetime * 60 * 1000;

        const payload = JSON.stringify({
            expires,
            payload: data,
        });

        await Bun.write(filePath, payload);
        return true;
    }

    /**
     * Destroy a session file.
     *
     * @todo v1.1: Replace with bun:sqlite or Bun native delete API when available.
     *            Currently uses node:fs/promises.unlink as a temporary solution.
     */
    async destroy(sessionId: string): Promise<boolean> {
        const filePath = join(this.path, sessionId);
        const file = Bun.file(filePath);

        if (await file.exists()) {
            // TODO: Use bun:sqlite for deletion in v1.1
            const { unlink } = await import('node:fs/promises');
            try {
                await unlink(filePath);
                return true;
            } catch {
                return false;
            }
        }
        return false;
    }

    /**
     * Garbage collect expired sessions.
     *
     * Scans the session directory and removes expired session files.
     * Requires node:fs/promises.readdir which will be replaced with bun:sqlite in v1.1.
     *
     * @param _maxLifetime - Not used (for API compatibility with SessionDriver)
     * @returns Number of sessions garbage collected
     *
     * @todo v1.1: Replace with bun:sqlite for directory scanning and deletion.
     *            Currently uses node:fs/promises as a temporary solution.
     */
    async gc(_maxLifetime: number): Promise<number> {
        // TODO: Use bun:sqlite for directory listing and deletion in v1.1
        const { readdir, unlink } = await import('node:fs/promises');
        const files = await readdir(this.path);
        let count = 0;
        const now = Date.now();

        for (const file of files) {
            const filePath = join(this.path, file);
            // Skip non-session files if any (e.g. .gitignore)
            if (file.startsWith('.')) continue;

            try {
                const content = await Bun.file(filePath).text();
                const data = JSON.parse(content);

                if (now >= data.expires) {
                    await unlink(filePath);
                    count++;
                }
            } catch {
                // If invalid JSON, skip for safety
            }
        }

        return count;
    }
}
