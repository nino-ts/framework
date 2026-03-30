import type { ValidationRule } from '../contracts/ValidationRule';
import type { StandardSchemaV1 } from '../types';

/**
 * Max rule implementation.
 *
 * @packageDocumentation
 * Validates that a value does not exceed a maximum threshold.
 * - For strings: checks maximum length
 * - For numbers: checks maximum value
 * - For arrays: checks maximum count
 * Does not enforce required constraint - null/undefined/empty are allowed.
 *
 * Implements both StandardSchemaV1 (for fluent API) and ValidationRule (for legacy Validator).
 */
export class MaxRule implements StandardSchemaV1<unknown, unknown>, ValidationRule {
  /**
   * Rule name for legacy Validator compatibility.
   */
  readonly name = 'max';

  /**
   * Creates a new MaxRule instance.
   *
   * @param max - The maximum threshold value
   */
  constructor(private readonly max: number = Number.MAX_SAFE_INTEGER) {}

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

      // Validate based on type
      if (typeof value === 'number') {
        if (value > this.max) {
          return {
            issues: [
              {
                code: 'max_value',
                message: `The field must not be greater than ${this.max}.`,
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

      if (typeof value === 'string') {
        if (value.length > this.max) {
          return {
            issues: [
              {
                code: 'max_length',
                message: `The field must not be greater than ${this.max}.`,
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

      if (Array.isArray(value)) {
        if (value.length > this.max) {
          return {
            issues: [
              {
                code: 'max_items',
                message: `The field must not be greater than ${this.max}.`,
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

      // Unsupported type for max validation
      return {
        issues: [
          {
            code: 'invalid_type',
            message: `The field must not be greater than ${this.max}.`,
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
   * @param _field - Field name
   * @param value - Value to validate
   * @param parameters - Rule parameters (first element is the max value)
   * @returns True if valid, false otherwise
   */
  passes(_field: string, value: unknown, parameters?: string[]): boolean {
    if (!parameters || parameters.length === 0 || !parameters[0]) {
      return false;
    }

    if (value === null || value === undefined || value === '') {
      return true;
    }

    const max = Number.parseFloat(parameters[0]);
    if (Number.isNaN(max)) {
      return false;
    }

    if (typeof value === 'number') {
      return value <= max;
    }

    if (typeof value === 'string' || Array.isArray(value)) {
      return value.length <= max;
    }

    return false;
  }

  /**
   * Legacy ValidationRule compatibility - returns error message.
   *
   * @param field - Field name
   * @param parameters - Rule parameters (first element is the max value)
   * @returns Error message
   */
  message(field: string, parameters?: string[]): string {
    const max = parameters && parameters.length > 0 && parameters[0] ? parameters[0] : '';
    return `The ${field} field must not be greater than ${max}.`;
  }
}
