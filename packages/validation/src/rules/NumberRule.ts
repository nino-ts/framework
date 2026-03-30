import type { ValidationRule } from '../contracts/ValidationRule';
import type { StandardSchemaV1 } from '../types';

/**
 * Number rule implementation.
 *
 * @packageDocumentation
 * Validates that a value is a number or numeric string.
 * Accepts native numbers and strings that can be parsed as valid numbers.
 * Does not enforce required constraint - null/undefined are allowed.
 *
 * Implements both StandardSchemaV1 (for fluent API) and ValidationRule (for legacy Validator).
 */
export class NumberRule implements StandardSchemaV1<unknown, unknown>, ValidationRule {
  /**
   * Rule name for legacy Validator compatibility.
   */
  readonly name = 'number';

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

      // Check if value is already a number
      if (typeof value === 'number') {
        if (Number.isNaN(value)) {
          return {
            issues: [
              {
                code: 'invalid_type',
                message: 'The field must be a number.',
              },
            ],
            success: false,
            value,
          } as const;
        }
        return {
          success: true,
          value,
        } as const;
      }

      // Check if value is a numeric string
      if (typeof value === 'string') {
        if (value.trim() === '') {
          return {
            issues: [
              {
                code: 'invalid_type',
                message: 'The field must be a number.',
              },
            ],
            success: false,
            value,
          } as const;
        }
        const parsed = Number(value);
        if (Number.isNaN(parsed)) {
          return {
            issues: [
              {
                code: 'invalid_type',
                message: 'The field must be a number.',
              },
            ],
            success: false,
            value,
          } as const;
        }
        return {
          success: true,
          value: parsed,
        } as const;
      }

      // Value is not a number or numeric string
      return {
        issues: [
          {
            code: 'invalid_type',
            message: 'The field must be a number.',
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
   * @param _parameters - Rule parameters (not used for number)
   * @returns True if valid, false otherwise
   */
  passes(_attribute: string, value: unknown, _parameters?: string[]): boolean {
    if (value === null || value === undefined) {
      return true; // Not required by default
    }

    if (typeof value === 'number') {
      return !Number.isNaN(value);
    }

    if (typeof value === 'string') {
      const parsed = Number(value);
      return !Number.isNaN(parsed) && value.trim() !== '';
    }

    return false;
  }

  /**
   * Legacy ValidationRule compatibility - returns error message.
   *
   * @param attribute - Field name
   * @param _parameters - Rule parameters (not used for number)
   * @returns Error message
   */
  message(attribute: string, _parameters?: string[]): string {
    return `The ${attribute} field must be a valid number.`;
  }
}
