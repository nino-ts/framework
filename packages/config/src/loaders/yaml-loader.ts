/**
 * YAML configuration loader.
 *
 * @packageDocumentation
 */

import { parse } from 'yaml';
import type { ConfigLoader } from '@/types';

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
export class YamlLoader implements ConfigLoader {
    /**
     * Load configuration from a YAML file.
     *
     * @param filePath - Absolute path to YAML file
     * @returns Parsed configuration object
     * @throws Error if file not found or invalid YAML
     */
    async load(filePath: string): Promise<Record<string, unknown>> {
        const file = Bun.file(filePath);

        if (!(await file.exists())) {
            throw new Error(`Configuration file not found: ${filePath}`);
        }

        const content = await file.text();

        if (!content.trim()) {
            return {};
        }

        try {
            const parsed = parse(content) as unknown;

            if (typeof parsed !== 'object' || parsed === null) {
                throw new Error(`Configuration must be an object in: ${filePath}`);
            }

            if (Array.isArray(parsed)) {
                throw new Error(`Configuration must be an object, not array in: ${filePath}`);
            }

            return parsed as Record<string, unknown>;
        } catch (error) {
            if (
                error instanceof SyntaxError ||
                (error instanceof Error && error.message.includes('must be an object'))
            ) {
                throw error;
            }
            throw new Error(`Invalid YAML in ${filePath}: ${error instanceof Error ? error.message : String(error)}`);
        }
    }

    /**
     * Check if this loader supports a file extension.
     *
     * @param extension - File extension without dot
     * @returns True if extension is 'yaml' or 'yml' (case-insensitive)
     */
    supports(extension: string): boolean {
        const ext = extension.toLowerCase();
        return ext === 'yaml' || ext === 'yml';
    }
}
