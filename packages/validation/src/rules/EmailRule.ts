/**
 * Email rule implementation.
 *
 * @packageDocumentation
 */

import type { ValidationRule } from '@/contracts/ValidationRule.ts';

/**
 * Validates that a value maps seamlessly forming proper electronic mail domain parsing syntax bounds.
 */
class EmailRule implements ValidationRule {
  readonly name = 'email';

  passes(_field: string, value: unknown): boolean {
    if (value === null || value === undefined) {
      return true; // Not required by default
    }

    if (typeof value !== 'string') {
      return false;
    }

    // Simplistic standard layout matching. In production, consider tighter RFC-compliant checks.
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(value);
  }

  message(field: string): string {
    return `The ${field} field must be a valid email address.`;
  }
}

export { EmailRule };
