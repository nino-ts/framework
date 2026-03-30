import type { ValidationRule } from '../contracts/ValidationRule';
import type { StandardSchemaV1 } from '../types';

/**
 * UUID rule implementation.
 *
 * @packageDocumentation
 * Validates that a value is a valid UUID (Universally Unique Identifier).
 * Supports all UUID versions (1-5) with standard 8-4-4-4-12 hex format.
 * Does not enforce required constraint - null/undefined/empty are allowed.
 *
 * Implements both StandardSchemaV1 (for fluent API) and ValidationRule (for legacy Validator).
 */
export class UuidRule implements StandardSchemaV1<unknown, string>, ValidationRule {
  /**
   * Rule name for legacy Validator compatibility.
   */
  readonly name = 'uuid';

  /**
   * Standard Schema V1 namespace.
   */
  readonly '~standard' = {
    validate: (value: unknown) => {
      // Allow null/undefined/empty (not required by default)
      if (value === null || value === undefined || value === '') {
        return {
          success: true,
          value: value as string,
        } as const;
      }

      // Check if value is a string
      if (typeof value !== 'string') {
        return {
          issues: [
            {
              code: 'invalid_type',
              message: 'The field must be a valid UUID.',
            },
          ],
          success: false,
          value,
        } as const;
      }

      // Validate UUID format (all versions 1-5)
      // Format: 8-4-4-4-12 hex characters with version and variant checks
      const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
      if (!uuidRegex.test(value)) {
        return {
          issues: [
            {
              code: 'invalid_uuid',
              message: 'The field must be a valid UUID.',
            },
          ],
          success: false,
          value,
        } as const;
      }

      // Value is a valid UUID
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
   * @param _field - Field name
   * @param value - Value to validate
   * @returns True if valid, false otherwise
   */
  passes(_field: string, value: unknown): boolean {
    if (value === null || value === undefined || value === '') {
      return true;
    }

    if (typeof value !== 'string') {
      return false;
    }

    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    return uuidRegex.test(value);
  }

  /**
   * Legacy ValidationRule compatibility - returns error message.
   *
   * @param field - Field name
   * @returns Error message
   */
  message(field: string): string {
    return `The ${field} field must be a valid UUID.`;
  }
}
