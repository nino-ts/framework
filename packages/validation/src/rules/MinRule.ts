import type { ValidationRule } from '../contracts/ValidationRule';

export class MinRule implements ValidationRule {
  public passes(_field: string, value: unknown, parameters?: string[]): boolean {
    if (!parameters || parameters.length === 0) {
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

  public message(field: string, parameters?: string[]): string {
    const min = parameters && parameters.length > 0 ? parameters[0] : '';
    return `The ${field} field must be at least ${min}.`;
  }
}
