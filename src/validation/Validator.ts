/**
 * Ninots Framework - Validator
 * Laravel-inspired validation system
 * Zero dependencies implementation
 */

import type { ValidationRule, ValidationRules, ValidationErrors, ValidationResult } from '../types';

/**
 * Validator class for data validation
 */
export class Validator {
  private data: Record<string, unknown>;
  private rules: ValidationRules;
  private errors: ValidationErrors = {};
  private customMessages: Record<string, string> = {};

  constructor(
    data: Record<string, unknown>,
    rules: ValidationRules,
    messages: Record<string, string> = {}
  ) {
    this.data = data;
    this.rules = rules;
    this.customMessages = messages;
  }

  /**
   * Run validation
   */
  validate(): ValidationResult {
    this.errors = {};
    const validated: Record<string, unknown> = {};

    for (const [field, fieldRules] of Object.entries(this.rules)) {
      const rules = this.parseRules(fieldRules);
      const value = this.getValue(field);
      const fieldErrors: string[] = [];

      // Check if nullable and value is null/undefined
      const isNullable = rules.includes('nullable');
      if (isNullable && (value === null || value === undefined || value === '')) {
        continue;
      }

      for (const rule of rules) {
        if (rule === 'nullable') continue;
        
        const error = this.validateRule(field, value, rule);
        if (error) {
          fieldErrors.push(error);
        }
      }

      if (fieldErrors.length > 0) {
        this.errors[field] = fieldErrors;
      } else {
        validated[field] = value;
      }
    }

    return {
      valid: Object.keys(this.errors).length === 0,
      errors: this.errors,
      validated,
    };
  }

  /**
   * Check if validation fails
   */
  fails(): boolean {
    const result = this.validate();
    return !result.valid;
  }

  /**
   * Check if validation passes
   */
  passes(): boolean {
    const result = this.validate();
    return result.valid;
  }

  /**
   * Get validation errors
   */
  getErrors(): ValidationErrors {
    return this.errors;
  }

  /**
   * Get first error for a field
   */
  first(field: string): string | null {
    return this.errors[field]?.[0] ?? null;
  }

  /**
   * Get all errors for a field
   */
  get(field: string): string[] {
    return this.errors[field] ?? [];
  }

  /**
   * Parse rules string or array
   */
  private parseRules(rules: ValidationRule[] | string): string[] {
    if (typeof rules === 'string') {
      return rules.split('|');
    }
    return rules;
  }

  /**
   * Get value from data using dot notation
   */
  private getValue(key: string): unknown {
    const parts = key.split('.');
    let value: unknown = this.data;

    for (const part of parts) {
      if (value === null || value === undefined) {
        return undefined;
      }
      value = (value as Record<string, unknown>)[part];
    }

    return value;
  }

  /**
   * Validate a single rule
   */
  private validateRule(field: string, value: unknown, rule: string): string | null {
    const [ruleName, ...params] = rule.split(':');
    const ruleParams = params.join(':').split(',');

    switch (ruleName) {
      case 'required':
        return this.validateRequired(field, value);
      case 'string':
        return this.validateString(field, value);
      case 'number':
        return this.validateNumber(field, value);
      case 'boolean':
        return this.validateBoolean(field, value);
      case 'email':
        return this.validateEmail(field, value);
      case 'url':
        return this.validateUrl(field, value);
      case 'uuid':
        return this.validateUuid(field, value);
      case 'array':
        return this.validateArray(field, value);
      case 'object':
        return this.validateObject(field, value);
      case 'date':
        return this.validateDate(field, value);
      case 'min':
        return this.validateMin(field, value, Number(ruleParams[0]));
      case 'max':
        return this.validateMax(field, value, Number(ruleParams[0]));
      case 'between':
        return this.validateBetween(field, value, Number(ruleParams[0]), Number(ruleParams[1]));
      case 'in':
        return this.validateIn(field, value, ruleParams);
      case 'regex':
        return this.validateRegex(field, value, ruleParams.join(':'));
      case 'same':
        return this.validateSame(field, value, ruleParams[0] ?? '');
      case 'different':
        return this.validateDifferent(field, value, ruleParams[0] ?? '');
      case 'confirmed':
        return this.validateConfirmed(field, value);
      case 'alpha':
        return this.validateAlpha(field, value);
      case 'alphanumeric':
        return this.validateAlphanumeric(field, value);
      case 'numeric':
        return this.validateNumeric(field, value);
      case 'integer':
        return this.validateInteger(field, value);
      case 'positive':
        return this.validatePositive(field, value);
      case 'negative':
        return this.validateNegative(field, value);
      default:
        return null;
    }
  }

  /**
   * Get error message
   */
  private getMessage(field: string, rule: string, defaultMessage: string): string {
    const customKey = `${field}.${rule}`;
    return this.customMessages[customKey] ?? this.customMessages[rule] ?? defaultMessage;
  }

  // ============================================================================
  // Validation Rules
  // ============================================================================

  private validateRequired(field: string, value: unknown): string | null {
    if (value === undefined || value === null || value === '') {
      return this.getMessage(field, 'required', `The ${field} field is required.`);
    }
    if (Array.isArray(value) && value.length === 0) {
      return this.getMessage(field, 'required', `The ${field} field is required.`);
    }
    return null;
  }

  private validateString(field: string, value: unknown): string | null {
    if (value !== undefined && typeof value !== 'string') {
      return this.getMessage(field, 'string', `The ${field} field must be a string.`);
    }
    return null;
  }

  private validateNumber(field: string, value: unknown): string | null {
    if (value !== undefined && typeof value !== 'number') {
      return this.getMessage(field, 'number', `The ${field} field must be a number.`);
    }
    return null;
  }

  private validateBoolean(field: string, value: unknown): string | null {
    if (value !== undefined && typeof value !== 'boolean') {
      return this.getMessage(field, 'boolean', `The ${field} field must be a boolean.`);
    }
    return null;
  }

  private validateEmail(field: string, value: unknown): string | null {
    if (typeof value !== 'string') return null;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value)) {
      return this.getMessage(field, 'email', `The ${field} field must be a valid email address.`);
    }
    return null;
  }

  private validateUrl(field: string, value: unknown): string | null {
    if (typeof value !== 'string') return null;
    try {
      new URL(value);
      return null;
    } catch {
      return this.getMessage(field, 'url', `The ${field} field must be a valid URL.`);
    }
  }

  private validateUuid(field: string, value: unknown): string | null {
    if (typeof value !== 'string') return null;
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(value)) {
      return this.getMessage(field, 'uuid', `The ${field} field must be a valid UUID.`);
    }
    return null;
  }

  private validateArray(field: string, value: unknown): string | null {
    if (value !== undefined && !Array.isArray(value)) {
      return this.getMessage(field, 'array', `The ${field} field must be an array.`);
    }
    return null;
  }

  private validateObject(field: string, value: unknown): string | null {
    if (value !== undefined && (typeof value !== 'object' || value === null || Array.isArray(value))) {
      return this.getMessage(field, 'object', `The ${field} field must be an object.`);
    }
    return null;
  }

  private validateDate(field: string, value: unknown): string | null {
    if (value === undefined) return null;
    const date = new Date(value as string | number);
    if (Number.isNaN(date.getTime())) {
      return this.getMessage(field, 'date', `The ${field} field must be a valid date.`);
    }
    return null;
  }

  private validateMin(field: string, value: unknown, min: number): string | null {
    if (typeof value === 'string' && value.length < min) {
      return this.getMessage(field, 'min', `The ${field} field must be at least ${min} characters.`);
    }
    if (typeof value === 'number' && value < min) {
      return this.getMessage(field, 'min', `The ${field} field must be at least ${min}.`);
    }
    if (Array.isArray(value) && value.length < min) {
      return this.getMessage(field, 'min', `The ${field} field must have at least ${min} items.`);
    }
    return null;
  }

  private validateMax(field: string, value: unknown, max: number): string | null {
    if (typeof value === 'string' && value.length > max) {
      return this.getMessage(field, 'max', `The ${field} field must not exceed ${max} characters.`);
    }
    if (typeof value === 'number' && value > max) {
      return this.getMessage(field, 'max', `The ${field} field must not exceed ${max}.`);
    }
    if (Array.isArray(value) && value.length > max) {
      return this.getMessage(field, 'max', `The ${field} field must not have more than ${max} items.`);
    }
    return null;
  }

  private validateBetween(field: string, value: unknown, min: number, max: number): string | null {
    const size = typeof value === 'string' ? value.length : 
                 typeof value === 'number' ? value :
                 Array.isArray(value) ? value.length : 0;
    
    if (size < min || size > max) {
      return this.getMessage(field, 'between', `The ${field} field must be between ${min} and ${max}.`);
    }
    return null;
  }

  private validateIn(field: string, value: unknown, options: string[]): string | null {
    if (!options.includes(String(value))) {
      return this.getMessage(field, 'in', `The ${field} field must be one of: ${options.join(', ')}.`);
    }
    return null;
  }

  private validateRegex(field: string, value: unknown, pattern: string): string | null {
    if (typeof value !== 'string') return null;
    const regex = new RegExp(pattern);
    if (!regex.test(value)) {
      return this.getMessage(field, 'regex', `The ${field} field format is invalid.`);
    }
    return null;
  }

  private validateSame(field: string, value: unknown, otherField: string): string | null {
    const otherValue = this.getValue(otherField);
    if (value !== otherValue) {
      return this.getMessage(field, 'same', `The ${field} field must match ${otherField}.`);
    }
    return null;
  }

  private validateDifferent(field: string, value: unknown, otherField: string): string | null {
    const otherValue = this.getValue(otherField);
    if (value === otherValue) {
      return this.getMessage(field, 'different', `The ${field} field must be different from ${otherField}.`);
    }
    return null;
  }

  private validateConfirmed(field: string, value: unknown): string | null {
    const confirmationField = `${field}_confirmation`;
    const confirmationValue = this.getValue(confirmationField);
    if (value !== confirmationValue) {
      return this.getMessage(field, 'confirmed', `The ${field} confirmation does not match.`);
    }
    return null;
  }

  private validateAlpha(field: string, value: unknown): string | null {
    if (typeof value !== 'string') return null;
    if (!/^[a-zA-Z]+$/.test(value)) {
      return this.getMessage(field, 'alpha', `The ${field} field must only contain letters.`);
    }
    return null;
  }

  private validateAlphanumeric(field: string, value: unknown): string | null {
    if (typeof value !== 'string') return null;
    if (!/^[a-zA-Z0-9]+$/.test(value)) {
      return this.getMessage(field, 'alphanumeric', `The ${field} field must only contain letters and numbers.`);
    }
    return null;
  }

  private validateNumeric(field: string, value: unknown): string | null {
    if (value === undefined) return null;
    if (Number.isNaN(Number(value))) {
      return this.getMessage(field, 'numeric', `The ${field} field must be numeric.`);
    }
    return null;
  }

  private validateInteger(field: string, value: unknown): string | null {
    if (value === undefined) return null;
    if (!Number.isInteger(Number(value))) {
      return this.getMessage(field, 'integer', `The ${field} field must be an integer.`);
    }
    return null;
  }

  private validatePositive(field: string, value: unknown): string | null {
    if (typeof value !== 'number') return null;
    if (value <= 0) {
      return this.getMessage(field, 'positive', `The ${field} field must be positive.`);
    }
    return null;
  }

  private validateNegative(field: string, value: unknown): string | null {
    if (typeof value !== 'number') return null;
    if (value >= 0) {
      return this.getMessage(field, 'negative', `The ${field} field must be negative.`);
    }
    return null;
  }
}

/**
 * Create a validator instance
 */
export function validate(
  data: Record<string, unknown>,
  rules: ValidationRules,
  messages: Record<string, string> = {}
): ValidationResult {
  const validator = new Validator(data, rules, messages);
  return validator.validate();
}

/**
 * Validation middleware factory
 */
export function validateRequest(rules: ValidationRules, messages: Record<string, string> = {}) {
  return async (request: Request, next: () => Promise<Response>): Promise<Response> => {
    let data: Record<string, unknown> = {};

    // Parse request body
    const contentType = request.headers.get('Content-Type') ?? '';
    if (contentType.includes('application/json')) {
      try {
        data = await request.json() as Record<string, unknown>;
      } catch {
        data = {};
      }
    } else if (contentType.includes('multipart/form-data') || contentType.includes('application/x-www-form-urlencoded')) {
      const formData = await request.formData();
      for (const [key, value] of formData.entries()) {
        data[key] = value;
      }
    }

    // Add query params
    const url = new URL(request.url);
    for (const [key, value] of url.searchParams) {
      if (!(key in data)) {
        data[key] = value;
      }
    }

    const result = validate(data, rules, messages);

    if (!result.valid) {
      return new Response(JSON.stringify({ errors: result.errors }), {
        status: 422,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Store validated data on request
    (request as unknown as Record<string, unknown>).validated = result.validated;

    return next();
  };
}
