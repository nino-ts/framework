import type { ValidationRule } from '../contracts/ValidationRule';
import type { StandardSchemaV1 } from '../types';

/**
 * Boolean rule implementation.
 *
 * @packageDocumentation
 * Validates that a value is a boolean or mappable to boolean.
 * Accepts native booleans and truthy/falsy representations:
 * - Native: true, false
 * - Numbers: 1 (true), 0 (false)
 * - Strings: "1", "true" (true), "0", "false" (false)
 * Does not enforce required constraint - null/undefined are allowed.
 *
 * Implements both StandardSchemaV1 (for fluent API) and ValidationRule (for legacy Validator).
 */
export class BooleanRule implements StandardSchemaV1<unknown, unknown>, ValidationRule {
  /**
   * Rule name for legacy Validator compatibility.
   */
  readonly name = 'boolean';

  /**
   * Standard Schema V1 namespace.
   */
  readonly '~standard' = {
    validate: (value: unknown) => {
      // Allow null/undefined (not required by default)
      if (value === null || value === undefined) {
        return {
          success: true,
          value,
        } as const;
      }

      // Check if value is already a boolean
      if (typeof value === 'boolean') {
        return {
          success: true,
          value,
        } as const;
      }

      // Map numeric values to boolean
      if (value === 1 || value === '1') {
        return {
          success: true,
          value: true,
        } as const;
      }

      if (value === 0 || value === '0') {
        return {
          success: true,
          value: false,
        } as const;
      }

      // Map string representations to boolean
      if (typeof value === 'string') {
        if (value.toLowerCase() === 'true') {
          return {
            success: true,
            value: true,
          } as const;
        }
        if (value.toLowerCase() === 'false') {
          return {
            success: true,
            value: false,
          } as const;
        }
      }

      // Value cannot be mapped to boolean
      return {
        issues: [
          {
            code: 'invalid_type',
            message: 'The field must be a boolean.',
          },
        ],
        success: false,
        value,
      } as const;
    },
    vendor: 'ninots',
    version: '1',
  } as const;

  /**
   * Legacy ValidationRule compatibility - checks if value passes validation.
   *
   * @param _attribute - Field name
   * @param value - Value to validate
   * @param _parameters - Rule parameters (not used for boolean)
   * @returns True if valid, false otherwise
   */
  passes(_attribute: string, value: unknown, _parameters?: string[]): boolean {
    if (value === null || value === undefined) {
      return true;
    }

    return (
      typeof value === 'boolean' ||
      value === 'true' ||
      value === 'false' ||
      value === 1 ||
      value === 0 ||
      value === '1' ||
      value === '0'
    );
  }

  /**
   * Legacy ValidationRule compatibility - returns error message.
   *
   * @param attribute - Field name
   * @param _parameters - Rule parameters (not used for boolean)
   * @returns Error message
   */
  message(attribute: string, _parameters?: string[]): string {
    return `The ${attribute} field must be a boolean mapping representing true or false values natively evaluated.`;
  }
}
