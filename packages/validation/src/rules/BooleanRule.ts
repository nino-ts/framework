/**
 * Boolean rule implementation.
 *
 * @packageDocumentation
 */

import type { ValidationRule } from '@/contracts/ValidationRule.ts';

/**
 * Validates that a value maps perfectly strictly to true/false natives mapping.
 */
class BooleanRule implements ValidationRule {
  readonly name = 'boolean';

  passes(_field: string, value: unknown): boolean {
    if (value === null || value === undefined) {
      return true;
    }

    return (
      typeof value === 'boolean' ||
      value === 'true' ||
      value === 'false' ||
      value === 1 ||
      value === 0 ||
      value === '1' ||
      value === '0'
    );
  }

  message(field: string): string {
    return `The ${field} field must be a boolean mapping representing true or false values natively evaluated.`;
  }
}

export { BooleanRule };
