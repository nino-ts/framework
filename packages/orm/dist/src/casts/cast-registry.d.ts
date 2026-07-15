/**
 * Cast Registry - Manages attribute casters for ORM models.
 *
 * Provides a centralized registry for casting attributes to specific types
 * when getting/setting model attributes.
 *
 * @packageDocumentation
 */
import type { CastType } from "../types";
/**
 * Interface for attribute casters.
 */
export interface AttributeCaster {
    /**
     * Get the cast type name.
     */
    getType(): CastType;
    /**
     * Cast a value when getting from model.
     *
     * @param value - The raw value from database
     * @returns The casted value
     */
    get(value: unknown): unknown;
    /**
     * Cast a value when setting to model.
     *
     * @param value - The value to set
     * @returns The casted value for storage
     */
    set(value: unknown): unknown;
}
/**
 * Registry for managing attribute casters.
 *
 * @example
 * ```typescript
 * const registry = new CastRegistry();
 * registry.register('custom', new CustomCaster());
 * const caster = registry.get('custom');
 * ```
 */
export declare class CastRegistry {
    /**
     * Map of registered casters by type.
     */
    protected casters: Map<CastType, AttributeCaster>;
    /**
     * Create a new cast registry with default casters.
     */
    constructor();
    /**
     * Register default casters.
     */
    protected registerDefaults(): void;
    /**
     * Register a caster for a specific type.
     *
     * @param type - The cast type
     * @param caster - The caster instance
     */
    register(type: CastType, caster: AttributeCaster): void;
    /**
     * Get a caster by type.
     *
     * @param type - The cast type
     * @returns The caster instance
     * @throws Error if caster not found
     */
    get(type: CastType): AttributeCaster;
    /**
     * Check if a caster is registered for a type.
     *
     * @param type - The cast type
     * @returns True if caster exists
     */
    has(type: CastType): boolean;
    /**
     * Get all registered caster types.
     *
     * @returns Array of caster types
     */
    getTypes(): CastType[];
    /**
     * Remove a caster by type.
     *
     * @param type - The cast type
     */
    remove(type: CastType): void;
    /**
     * Clear all registered casters.
     */
    clear(): void;
}
/**
 * Global singleton cast registry instance.
 */
export declare const globalCastRegistry: CastRegistry;
