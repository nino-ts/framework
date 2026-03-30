import type { ValidationRule } from '../contracts/ValidationRule';
import type { StandardSchemaV1 } from '../types';

/**
 * Email rule implementation.
 *
 * @packageDocumentation
 * Validates that a value is a valid email address format.
 * Uses regex pattern to check standard email structure: local-part @domain.
 * Does not enforce required constraint - null/undefined are allowed.
 *
 * Implements both StandardSchemaV1 (for fluent API) and ValidationRule (for legacy Validator).
 */
export class EmailRule implements StandardSchemaV1<unknown, unknown>, ValidationRule {
  /**
   * Rule name for legacy Validator compatibility.
   */
  readonly name = 'email';

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

      // Check if value is a string
      if (typeof value !== 'string') {
        return {
          issues: [
            {
              code: 'invalid_type',
              message: 'The field must be a valid email address.',
            },
          ],
          success: false,
          value,
        } as const;
      }

      // Validate email format using regex
      // Pattern: non-whitespace @ non-whitespace . non-whitespace
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value)) {
        return {
          issues: [
            {
              code: 'invalid_email',
              message: 'The field must be a valid email address.',
            },
          ],
          success: false,
          value,
        } as const;
      }

      // Value is a valid email
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
   * @param _parameters - Rule parameters (not used for email)
   * @returns True if valid, false otherwise
   */
  passes(_attribute: string, value: unknown, _parameters?: string[]): boolean {
    if (value === null || value === undefined) {
      return true; // Not required by default
    }

    if (typeof value !== 'string') {
      return false;
    }

    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(value);
  }

  /**
   * Legacy ValidationRule compatibility - returns error message.
   *
   * @param attribute - Field name
   * @param _parameters - Rule parameters (not used for email)
   * @returns Error message
   */
  message(attribute: string, _parameters?: string[]): string {
    return `The ${attribute} field must be a valid email address.`;
  }
}
