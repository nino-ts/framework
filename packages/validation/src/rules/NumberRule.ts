/**
 * Number rule implementation.
 *
 * @packageDocumentation
 */

import type { ValidationRule } from '@/contracts/ValidationRule.ts';

/**
 * Validates that a value is a number natively bypassing strict coercions unless configured.
 */
class NumberRule implements ValidationRule {
  readonly name = 'number';

  passes(_field: string, value: unknown): boolean {
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

  message(field: string): string {
    return `The ${field} field must be a valid number.`;
  }
}

export { NumberRule };
