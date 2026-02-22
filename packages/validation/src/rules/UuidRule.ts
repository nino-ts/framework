import type { ValidationRule } from '../contracts/ValidationRule';

export class UuidRule implements ValidationRule {
  public passes(_field: string, value: unknown): boolean {
    if (value === null || value === undefined || value === '') {
      return true;
    }

    if (typeof value !== 'string') {
      return false;
    }

    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    return uuidRegex.test(value);
  }

  public message(field: string): string {
    return `The ${field} field must be a valid UUID.`;
  }
}
