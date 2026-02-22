import type { ValidationRule } from '../contracts/ValidationRule';

export class ArrayRule implements ValidationRule {
  public passes(_attribute: string, value: unknown, _parameters?: string[]): boolean {
    if (value === null || value === undefined) {
      return true;
    }

    return Array.isArray(value);
  }

  public message(attribute: string, _parameters?: string[]): string {
    return `The ${attribute} must be an array.`;
  }
}
