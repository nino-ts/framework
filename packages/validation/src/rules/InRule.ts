import type { ValidationRule } from '../contracts/ValidationRule';
import type { StandardSchemaV1 } from '../types';

/**
 * In rule implementation.
 *
 * @packageDocumentation
 * Validates that a value is included in a list of allowed values.
 * Performs strict equality comparison against the provided whitelist.
 * Does not enforce required constraint - null/undefined/empty are allowed.
 *
 * Implements both StandardSchemaV1 (for fluent API) and ValidationRule (for legacy Validator).
 */
export class InRule implements StandardSchemaV1<unknown, unknown>, ValidationRule {
  /**
   * Rule name for legacy Validator compatibility.
   */
  readonly name = 'in';

  /**
   * Creates a new InRule instance.
   *
   * @param values - Array of allowed values
   */
  constructor(private readonly values: string[] = []) {}

  /**
   * Standard Schema V1 namespace.
   */
  readonly '~standard' = {
    validate: (value: unknown) => {
      // Allow null/undefined/empty (not required by default)
      if (value === null || value === undefined || value === '') {
        return {
          success: true,
          value,
        } as const;
      }

      // Convert value to string for comparison
      const stringValue = String(value);

      // Check if value is in the allowed list
      if (!this.values.includes(stringValue)) {
        return {
          issues: [
            {
              code: 'invalid_enum',
              message: 'The selected value is invalid.',
            },
          ],
          success: false,
          value,
        } as const;
      }

      // Value is in the allowed list
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
   * @param parameters - Rule parameters (list of allowed values)
   * @returns True if valid, false otherwise
   */
  passes(_field: string, value: unknown, parameters?: string[]): boolean {
    if (!parameters || parameters.length === 0) {
      return false;
    }

    if (value === null || value === undefined || value === '') {
      return true;
    }

    return parameters.includes(String(value));
  }

  /**
   * Legacy ValidationRule compatibility - returns error message.
   *
   * @param field - Field name
   * @param _parameters - Rule parameters (not used for message)
   * @returns Error message
   */
  message(field: string, _parameters?: string[]): string {
    return `The selected ${field} is invalid.`;
  }
}
