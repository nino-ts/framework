/**
 * Casts Attributes - Interface and utilities for model attribute casting.
 *
 * Provides the contract for models to define attribute casts.
 *
 * @packageDocumentation
 */

import type { CastType } from '@/types.ts';

/**
 * Map of attribute names to cast types.
 *
 * @example
 * ```typescript
 * const casts: CastAttributes = {
 *     active: 'boolean',
 *     age: 'integer',
 *     birthday: 'date',
 *     tags: 'array',
 *     metadata: 'json',
 *     status: 'enum',
 * };
 * ```
 */
export type CastAttributes = Record<string, CastType | 'enum'>;

/**
 * Interface for models that support attribute casting.
 *
 * Models implementing this interface can define casts for their attributes.
 *
 * @example
 * ```typescript
 * class User extends Model implements CastsAttributes {
 *     casts(): CastAttributes {
 *         return {
 *             active: 'boolean',
 *             email_verified_at: 'date',
 *             roles: 'array',
 *         };
 *     }
 * }
 * ```
 */
export interface CastsAttributes {
  /**
   * Get the casts for the model attributes.
   *
   * @returns Map of attribute names to cast types
   */
  casts(): CastAttributes;
}

/**
 * Mixin that adds casting functionality to a model class.
 *
 * @template TBase - Base class type
 *
 * @example
 * ```typescript
 * class User extends withCasts(Model) {
 *     casts() {
 *         return {
 *             active: 'boolean',
 *             email_verified_at: 'date',
 *         };
 *     }
 * }
 * ```
 */
export function withCasts<TBase extends new (...args: any[]) => object>(Base: TBase) {
  return class extends Base implements CastsAttributes {
    /**
     * Get the casts for the model attributes.
     *
     * @returns Empty casts by default - override in subclass
     */
    casts(): CastAttributes {
      return {};
    }
  };
}
