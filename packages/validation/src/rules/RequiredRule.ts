/**
 * Required rule implementation.
 *
 * @packageDocumentation
 */

import type { ValidationRule } from '@/contracts/ValidationRule.ts';

/**
 * Validates that a value is present and not empty.
 */
class RequiredRule implements ValidationRule {
  readonly name = 'required';

  passes(_field: string, value: unknown): boolean {
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

  message(field: string): string {
    return `The ${field} field is required.`;
  }
}

export { RequiredRule };
