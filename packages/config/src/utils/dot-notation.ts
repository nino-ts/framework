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
export function getNestedValue(obj: Record<string, unknown>, path: string, defaultValue?: unknown): unknown {
  if (!path) {
    return defaultValue;
  }

  const keys = path.split('.');
  let current: unknown = obj;

  for (const key of keys) {
    if (current === null || current === undefined) {
      return defaultValue;
    }

    if (typeof current !== 'object') {
      return defaultValue;
    }

    if (!(key in current)) {
      return defaultValue;
    }

    current = (current as Record<string, unknown>)[key];
  }

  return current;
}

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
export function setNestedValue(obj: Record<string, unknown>, path: string, value: unknown): void {
  if (!path) {
    return;
  }

  const keys = path.split('.');
  let current: Record<string, unknown> = obj;

  for (let i = 0; i < keys.length - 1; i++) {
    const key = keys[i];
    if (key === undefined) {
      throw new Error(`Invalid path segment at index ${i}`);
    }

    if (!(key in current) || typeof current[key] !== 'object' || current[key] === null) {
      current[key] = {};
    }

    current = current[key] as Record<string, unknown>;
  }

  const lastKey = keys[keys.length - 1];
  if (lastKey !== undefined) {
    current[lastKey] = value;
  }
}

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
export function hasNestedKey(obj: Record<string, unknown>, path: string): boolean {
  if (!path) {
    return false;
  }

  const keys = path.split('.');
  let current: unknown = obj;

  for (const key of keys) {
    if (current === null || current === undefined || typeof current !== 'object') {
      return false;
    }

    if (!(key in current)) {
      return false;
    }

    current = (current as Record<string, unknown>)[key];
  }

  return true;
}

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
export function forgetNestedKey(obj: Record<string, unknown>, path: string): void {
  if (!path) {
    return;
  }

  const keys = path.split('.');

  if (keys.length === 1) {
    const key = keys[0];
    if (key !== undefined) {
      delete obj[key];
    }
    return;
  }

  const parentPath = keys.slice(0, -1).join('.');
  const lastKey = keys[keys.length - 1];

  const parent = getNestedValue(obj, parentPath) as Record<string, unknown> | undefined;

  if (parent && typeof parent === 'object' && lastKey !== undefined) {
    delete parent[lastKey];
  }
}
