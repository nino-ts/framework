import type { ValidationRule } from '../contracts/ValidationRule';
import type { StandardSchemaV1 } from '../types';

/**
 * Required rule implementation.
 *
 * @packageDocumentation
 * Validates that a value is present and not empty.
 * Rejects null, undefined, empty strings, and empty arrays.
 *
 * Implements both StandardSchemaV1 (for fluent API) and ValidationRule (for legacy Validator).
 */
export class RequiredRule implements StandardSchemaV1<unknown, unknown>, ValidationRule {
  /**
   * Rule name for legacy Validator compatibility.
   */
  readonly name = 'required';

  /**
   * Standard Schema V1 namespace.
   */
  readonly '~standard' = {
    validate: (value: unknown) => {
      // Check for null or undefined
      if (value === null || value === undefined) {
        return {
          issues: [
            {
              code: 'required',
              message: 'The field is required.',
            },
          ],
          success: false,
          value,
        } as const;
      }

      // Check for empty string
      if (typeof value === 'string' && value.trim() === '') {
        return {
          issues: [
            {
              code: 'required',
              message: 'The field is required.',
            },
          ],
          success: false,
          value,
        } as const;
      }

      // Check for empty array
      if (Array.isArray(value) && value.length === 0) {
        return {
          issues: [
            {
              code: 'required',
              message: 'The field is required.',
            },
          ],
          success: false,
          value,
        } as const;
      }

      // Value is valid
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
   * @param attribute - Field name
   * @param value - Value to validate
   * @param _parameters - Rule parameters (not used for required)
   * @returns True if valid, false otherwise
   */
  passes(_attribute: string, value: unknown, _parameters?: string[]): boolean {
    if (value === null || value === undefined) {
      return false;
    }
    if (typeof value === 'string' && value.trim() === '') {
      return false;
    }
    if (Array.isArray(value) && value.length === 0) {
      return false;
    }
    return true;
  }

  /**
   * Legacy ValidationRule compatibility - returns error message.
   *
   * @param attribute - Field name
   * @param _parameters - Rule parameters (not used for required)
   * @returns Error message
   */
  message(attribute: string, _parameters?: string[]): string {
    return `The ${attribute} field is required.`;
  }
}
