/**
 * Date Cast - Casts attributes to Date objects.
 *
 * Handles conversion of timestamps, strings, and numbers to Date instances.
 *
 * @packageDocumentation
 */
import type { AttributeCaster } from "./cast-registry";
import type { CastType } from "../types";
/**
 * Caster for date attributes.
 *
 * Converts various date formats to Date objects.
 *
 * @example
 * ```typescript
 * const caster = new DateCast();
 * caster.get('2024-01-15'); // Date instance
 * caster.get(1705312800000); // Date from timestamp
 * caster.get(new Date()); // Date (unchanged)
 * ```
 */
export declare class DateCast implements AttributeCaster {
    /**
     * Get the cast type name.
     */
    getType(): CastType;
    /**
     * Cast a value when getting from model.
     *
     * @param value - The raw value from database
     * @returns Date instance or null
     */
    get(value: unknown): Date | null;
    /**
     * Cast a value when setting to model.
     *
     * @param value - The value to set
     * @returns Date instance or null for storage
     */
    set(value: unknown): Date | null;
}
/**
 * DateTime Cast - Alias for DateCast with datetime type.
 */
export declare class DateTimeCast extends DateCast {
    /**
     * Get the cast type name.
     */
    getType(): CastType;
}
/**
 * Timestamp Cast - Casts to Date but returns timestamp number.
 *
 * Note: This class does not extend DateCast because the return type of get() is different.
 */
export declare class TimestampCast implements AttributeCaster {
    /**
     * Get the cast type name.
     */
    getType(): CastType;
    /**
     * Cast a value when getting from model.
     *
     * @param value - The raw value from database
     * @returns Timestamp number or null
     */
    get(value: unknown): number | null;
    /**
     * Cast a value when setting to model.
     *
     * @param value - The value to set
     * @returns Date instance for storage
     */
    set(value: unknown): Date | null;
}
