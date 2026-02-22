import type { ValidationRule } from '../contracts/ValidationRule';

export class MaxRule implements ValidationRule {
  public passes(_field: string, value: unknown, parameters?: string[]): boolean {
    if (!parameters || parameters.length === 0) {
      return false;
    }

    if (value === null || value === undefined || value === '') {
      return true;
    }

    const max = Number.parseFloat(parameters[0]);
    if (Number.isNaN(max)) {
      return false;
    }

    if (typeof value === 'number') {
      return value <= max;
    }

    if (typeof value === 'string' || Array.isArray(value)) {
      return value.length <= max;
    }

    return false;
  }

  public message(field: string, parameters?: string[]): string {
    const max = parameters && parameters.length > 0 ? parameters[0] : '';
    return `The ${field} field must not be greater than ${max}.`;
  }
}
