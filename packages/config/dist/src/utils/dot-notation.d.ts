/**
 * Dot-notation utility functions for nested object access.
 *
 * @packageDocumentation
 */
/**
 * Get a nested value from an object using dot notation.
 *
 * @param obj - Source object
 * @param path - Dot-notation path (e.g., "app.name")
 * @param defaultValue - Default value if path not found
 * @returns The value at path or default value
 *
 * @example
 * ```typescript
 * const config = { app: { name: 'ninots' } };
 * getNestedValue(config, 'app.name'); // 'ninots'
 * getNestedValue(config, 'app.missing', 'default'); // 'default'
 * ```
 */
export declare function getNestedValue(obj: Record<string, unknown>, path: string, defaultValue?: unknown): unknown;
/**
 * Set a nested value in an object using dot notation.
 *
 * Creates intermediate objects if they don't exist.
 *
 * @param obj - Target object
 * @param path - Dot-notation path
 * @param value - Value to set
 *
 * @example
 * ```typescript
 * const config = {};
 * setNestedValue(config, 'app.name', 'ninots');
 * // config = { app: { name: 'ninots' } }
 * ```
 */
export declare function setNestedValue(obj: Record<string, unknown>, path: string, value: unknown): void;
/**
 * Check if a nested key exists in an object.
 *
 * Returns true even if the value is null or undefined.
 *
 * @param obj - Source object
 * @param path - Dot-notation path
 * @returns True if key exists
 *
 * @example
 * ```typescript
 * const config = { app: { name: 'ninots' } };
 * hasNestedKey(config, 'app.name'); // true
 * hasNestedKey(config, 'app.missing'); // false
 * ```
 */
export declare function hasNestedKey(obj: Record<string, unknown>, path: string): boolean;
/**
 * Remove a nested key from an object.
 *
 * @param obj - Source object
 * @param path - Dot-notation path
 *
 * @example
 * ```typescript
 * const config = { app: { name: 'ninots', debug: true } };
 * forgetNestedKey(config, 'app.debug');
 * // config = { app: { name: 'ninots' } }
 * ```
 */
export declare function forgetNestedKey(obj: Record<string, unknown>, path: string): void;
