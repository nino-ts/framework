import { Glob } from 'bun';
import type { SessionDriver } from '../contracts/session-driver.ts';

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
    const filePath = `${this.path}/${sessionId}`;
    const file = Bun.file(filePath);

    if (!(await file.exists())) {
      return {};
    }

    try {
      const content = await file.text();
      if (!content) {
        return {};
      }

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
    const filePath = `${this.path}/${sessionId}`;
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
   * Uses Bun native file deletion to remove the session file.
   */
  async destroy(sessionId: string): Promise<boolean> {
    const filePath = `${this.path}/${sessionId}`;
    const file = Bun.file(filePath);

    if (await file.exists()) {
      try {
        await file.delete();
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
   * Uses Bun's Glob API for directory scanning and native file deletion.
   *
   * @param _maxLifetime - Not used (for API compatibility with SessionDriver)
   * @returns Number of sessions garbage collected
   */
  async gc(_maxLifetime: number): Promise<number> {
    const glob = new Glob(`${this.path}/*`);
    let count = 0;
    const now = Date.now();

    for await (const filePath of glob.scan()) {
      // Skip non-session files if any (e.g. .gitignore)
      const fileName = filePath.split('/').pop() || '';
      if (fileName.startsWith('.')) {
        continue;
      }

      try {
        const content = await Bun.file(filePath).text();
        const data = JSON.parse(content);

        if (now >= data.expires) {
          await Bun.file(filePath).delete();
          count++;
        }
      } catch {
        // If invalid JSON, skip for safety
      }
    }

    return count;
  }
}
