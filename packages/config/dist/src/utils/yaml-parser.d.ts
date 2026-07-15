/**
 * Simple YAML parser for configuration files.
 *
 * Supports basic YAML features needed for config files:
 * - Key-value pairs
 * - Nested objects (indentation-based)
 * - Arrays (with - prefix)
 * - Basic types (string, number, boolean, null)
 *
 * @packageDocumentation
 */
/**
 * Parse a YAML string into a JavaScript object.
 *
 * @param content - YAML content string
 * @returns Parsed object
 */
export declare function parseYaml(content: string): Record<string, unknown>;
