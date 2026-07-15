/**
 * JSON configuration loader.
 *
 * @packageDocumentation
 */
import type { ConfigLoader } from "../types";
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
export declare class JsonLoader implements ConfigLoader {
    /**
     * Load configuration from a JSON file.
     *
     * @param filePath - Absolute path to JSON file
     * @returns Parsed configuration object
     * @throws Error if file not found or invalid JSON
     */
    load(filePath: string): Promise<Record<string, unknown>>;
    /**
     * Check if this loader supports a file extension.
     *
     * @param extension - File extension without dot
     * @returns True if extension is 'json' (case-insensitive)
     */
    supports(extension: string): boolean;
}
