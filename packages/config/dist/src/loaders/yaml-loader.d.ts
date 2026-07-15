/**
 * YAML configuration loader.
 *
 * @packageDocumentation
 */
import type { ConfigLoader } from "../types";
/**
 * Loader for YAML configuration files.
 *
 * Uses @std/yaml for parsing and Bun.file() for reading.
 *
 * @example
 * ```typescript
 * const loader = new YamlLoader();
 * const config = await loader.load('/path/to/config.yaml');
 * ```
 */
export declare class YamlLoader implements ConfigLoader {
    /**
     * Load configuration from a YAML file.
     *
     * @param filePath - Absolute path to YAML file
     * @returns Parsed configuration object
     * @throws Error if file not found or invalid YAML
     */
    load(filePath: string): Promise<Record<string, unknown>>;
    /**
     * Check if this loader supports a file extension.
     *
     * @param extension - File extension without dot
     * @returns True if extension is 'yaml' or 'yml' (case-insensitive)
     */
    supports(extension: string): boolean;
}
