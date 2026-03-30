import type { ValidationRule } from '../contracts/ValidationRule';
import type { StandardSchemaV1 } from '../types';

/**
 * Array rule implementation.
 *
 * @packageDocumentation
 * Validates that a value is of type array.
 * Does not enforce required constraint - null/undefined are allowed.
 *
 * Implements both StandardSchemaV1 (for fluent API) and ValidationRule (for legacy Validator).
 */
export class ArrayRule implements StandardSchemaV1<unknown, unknown>, ValidationRule {
  /**
   * Rule name for legacy Validator compatibility.
   */
  readonly name = 'array';

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

      // Check if value is an array
      if (!Array.isArray(value)) {
        return {
          issues: [
            {
              code: 'invalid_type',
              message: 'The field must be an array.',
            },
          ],
          success: false,
          value,
        } as const;
      }

      // Value is a valid array
      return {
        success: true,
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
   * @param _parameters - Rule parameters (not used for array)
   * @returns True if valid, false otherwise
   */
  passes(_attribute: string, value: unknown, _parameters?: string[]): boolean {
    if (value === null || value === undefined) {
      return true;
    }

    return Array.isArray(value);
  }

  /**
   * Legacy ValidationRule compatibility - returns error message.
   *
   * @param attribute - Field name
   * @param _parameters - Rule parameters (not used for array)
   * @returns Error message
   */
  message(attribute: string, _parameters?: string[]): string {
    return `The ${attribute} must be an array.`;
  }
}
