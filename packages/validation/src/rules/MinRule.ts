import type { ValidationRule } from '../contracts/ValidationRule';
import type { StandardSchemaV1 } from '../types';

/**
 * Min rule implementation.
 *
 * @packageDocumentation
 * Validates that a value meets a minimum threshold.
 * - For strings: checks minimum length
 * - For numbers: checks minimum value
 * - For arrays: checks minimum count
 * Does not enforce required constraint - null/undefined/empty are allowed.
 *
 * Implements both StandardSchemaV1 (for fluent API) and ValidationRule (for legacy Validator).
 */
export class MinRule implements StandardSchemaV1<unknown, unknown>, ValidationRule {
  /**
   * Rule name for legacy Validator compatibility.
   */
  readonly name = 'min';

  /**
   * Creates a new MinRule instance.
   *
   * @param min - The minimum threshold value
   */
  constructor(private readonly min: number = 0) {}

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
        if (value < this.min) {
          return {
            issues: [
              {
                code: 'min_value',
                message: `The field must be at least ${this.min}.`,
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
        if (value.length < this.min) {
          return {
            issues: [
              {
                code: 'min_length',
                message: `The field must be at least ${this.min}.`,
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
        if (value.length < this.min) {
          return {
            issues: [
              {
                code: 'min_items',
                message: `The field must be at least ${this.min}.`,
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

      // Unsupported type for min validation
      return {
        issues: [
          {
            code: 'invalid_type',
            message: `The field must be at least ${this.min}.`,
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
   * @param parameters - Rule parameters (first element is the min value)
   * @returns True if valid, false otherwise
   */
  passes(_field: string, value: unknown, parameters?: string[]): boolean {
    if (!parameters || parameters.length === 0 || !parameters[0]) {
      return false;
    }

    if (value === null || value === undefined || value === '') {
      return true;
    }

    const min = Number.parseFloat(parameters[0]);
    if (Number.isNaN(min)) {
      return false;
    }

    if (typeof value === 'number') {
      return value >= min;
    }

    if (typeof value === 'string' || Array.isArray(value)) {
      return value.length >= min;
    }

    return false;
  }

  /**
   * Legacy ValidationRule compatibility - returns error message.
   *
   * @param field - Field name
   * @param parameters - Rule parameters (first element is the min value)
   * @returns Error message
   */
  message(field: string, parameters?: string[]): string {
    const min = parameters && parameters.length > 0 && parameters[0] ? parameters[0] : '';
    return `The ${field} field must be at least ${min}.`;
  }
}
