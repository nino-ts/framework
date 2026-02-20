/**
 * JSON configuration loader.
 *
 * @packageDocumentation
 */

import type { ConfigLoader } from '@/types.ts';

/**
 * Loader for JSON configuration files.
 *
 * Uses Bun.file() for native file reading.
 *
 * @example
 * ```typescript
 * const loader = new JsonLoader();
 * const config = await loader.load('/path/to/config.json');
 * ```
 */
export class JsonLoader implements ConfigLoader {
  constructor() {}
  /**
   * Load configuration from a JSON file.
   *
   * @param filePath - Absolute path to JSON file
   * @returns Parsed configuration object
   * @throws Error if file not found or invalid JSON
   */
  async load(filePath: string): Promise<Record<string, unknown>> {
    const file = Bun.file(filePath);

    if (!(await file.exists())) {
      throw new Error(`Configuration file not found: ${filePath}`);
    }

    const content = await file.text();

    try {
      const parsed = JSON.parse(content) as unknown;

      if (typeof parsed !== 'object' || parsed === null) {
        throw new Error(`Configuration must be an object in: ${filePath}`);
      }

      if (Array.isArray(parsed)) {
        throw new Error(`Configuration must be an object, not array in: ${filePath}`);
      }

      return parsed as Record<string, unknown>;
    } catch (error) {
      if (error instanceof SyntaxError) {
        throw new Error(`Invalid JSON in ${filePath}: ${error.message}`);
      }
      throw error;
    }
  }

  /**
   * Check if this loader supports a file extension.
   *
   * @param extension - File extension without dot
   * @returns True if extension is 'json' (case-insensitive)
   */
  supports(extension: string): boolean {
    return extension.toLowerCase() === 'json';
  }
}
