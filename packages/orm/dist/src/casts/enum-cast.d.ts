/**
 * Enum Cast - Casts attributes to TypeScript enum values.
 *
 * Handles conversion between enum values and their string/number representations.
 *
 * @packageDocumentation
 */
import type { AttributeCaster } from "./cast-registry";
import type { CastType } from "../types";
/**
 * Type for enum-like objects.
 */
export type EnumObject = Record<string | number, string | number>;
/**
 * Options for enum casting.
 */
export interface EnumCastOptions {
    /**
     * The enum object to cast to/from.
     */
    enum: EnumObject;
    /**
     * Whether to use string or numeric values.
     * @default 'string'
     */
    mode?: "string" | "number";
}
/**
 * Caster for enum attributes.
 *
 * Converts between enum values and their representations.
 *
 * @example
 * ```typescript
 * enum Status {
 *     Active = 'active',
 *     Inactive = 'inactive',
 * }
 *
 * const caster = new EnumCast({ enum: Status });
 * caster.get('active'); // Status.Active
 * caster.get(Status.Active); // 'active' (when setting)
 * ```
 */
export declare class EnumCast implements AttributeCaster {
    /**
     * The enum object to cast to/from.
     */
    protected readonly enumObject: EnumObject;
    /**
     * Cast mode: 'string' or 'number'.
     */
    protected readonly mode: "string" | "number";
    /**
     * Create a new enum caster.
     *
     * @param options - Enum cast options or enum object
     * @param mode - Optional mode when using enum object directly
     */
    constructor(options: EnumObject | EnumCastOptions, mode?: "string" | "number");
    /**
     * Get the cast type name.
     */
    getType(): CastType;
    /**
     * Get the enum object.
     */
    getEnumObject(): EnumObject;
    /**
     * Get the cast mode.
     */
    getMode(): "string" | "number";
    /**
     * Cast a value when getting from model.
     *
     * @param value - The raw value from database
     * @returns Enum value or original value
     */
    get(value: unknown): unknown;
    /**
     * Cast a value when setting to model.
     *
     * @param value - The value to set
     * @returns String/number representation for storage
     */
    set(value: unknown): string | number | null;
    /**
     * Check if a value is a valid enum value.
     *
     * @param value - Value to check
     * @returns True if valid enum value
     */
    protected isValidEnumValue(value: unknown): boolean;
}
