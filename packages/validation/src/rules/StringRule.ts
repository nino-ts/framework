/**
 * String rule implementation.
 *
 * @packageDocumentation
 */

import type { ValidationRule } from '@/contracts/ValidationRule.ts';

/**
 * Validates that a value is a string.
 */
class StringRule implements ValidationRule {
  readonly name = 'string';

  passes(_field: string, value: unknown): boolean {
    if (value === null || value === undefined) {
      return true; // Not required by default
    }
    return typeof value === 'string';
  }

  message(field: string): string {
    return `The ${field} field must be a string.`;
  }
}

export { StringRule };
