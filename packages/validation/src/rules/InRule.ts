import type { ValidationRule } from '../contracts/ValidationRule';

export class InRule implements ValidationRule {
  public passes(_field: string, value: unknown, parameters?: string[]): boolean {
    if (!parameters || parameters.length === 0) {
      return false;
    }

    if (value === null || value === undefined || value === '') {
      return true;
    }

    return parameters.includes(String(value));
  }

  public message(field: string): string {
    return `The selected ${field} is invalid.`;
  }
}
