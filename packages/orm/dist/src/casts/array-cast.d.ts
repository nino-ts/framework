/**
 * Array Cast - Casts attributes to array values.
 *
 * Handles conversion of JSON strings and other values to arrays.
 *
 * @packageDocumentation
 */
import type { AttributeCaster } from "./cast-registry";
/**
 * Caster for array attributes.
 *
 * Converts JSON strings and other values to arrays.
 *
 * @example
 * ```typescript
 * const caster = new ArrayCast();
 * caster.get('["a", "b", "c"]'); // ['a', 'b', 'c']
 * caster.get('{"key": "value"}'); // ['key']
 * caster.get(null); // []
 * ```
 */
export declare class ArrayCast implements AttributeCaster {
    /**
     * Get the cast type name.
     */
    getType(): "array";
    /**
     * Cast a value when getting from model.
     *
     * @param value - The raw value from database
     * @returns Array value
     */
    get(value: unknown): unknown[];
    /**
     * Cast a value when setting to model.
     *
     * @param value - The value to set
     * @returns JSON string for storage
     */
    set(value: unknown): string;
}
/**
 * JSON Cast - Casts attributes to JSON objects/arrays.
 *
 * Similar to ArrayCast but preserves object structure.
 */
export declare class JsonCast implements AttributeCaster {
    /**
     * Get the cast type name.
     */
    getType(): "json";
    /**
     * Cast a value when getting from model.
     *
     * @param value - The raw value from database
     * @returns Parsed JSON value
     */
    get(value: unknown): unknown;
    /**
     * Cast a value when setting to model.
     *
     * @param value - The value to set
     * @returns JSON string for storage
     */
    set(value: unknown): string;
}
