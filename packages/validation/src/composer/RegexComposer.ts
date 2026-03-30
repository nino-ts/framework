/**
 * Composer para regras baseadas em regex.
 *
 * @packageDocumentation
 * Fornece funções utilitárias para criar regras de validação baseadas em expressões regulares.
 */

import type { StandardSchemaRule, ValidationContext, RuleResult } from '../contracts/StandardSchemaRule';

/**
 * Regra para validar dígitos entre um intervalo.
 *
 * @example
 * const rule = new DigitsBetweenRule(3, 6);
 */
export class DigitsBetweenRule implements StandardSchemaRule<string | number> {
    public readonly name = 'digits_between';

    public constructor(
        private readonly min: number,
        private readonly max: number,
    ) {}

    public validate(context: ValidationContext<string | number>): RuleResult {
        const value = context.value;

        if (value === null || value === undefined) {
            return { success: true };
        }

        const stringValue = String(value);
        const digitsOnly = /^\d+$/.test(stringValue);

        if (!digitsOnly) {
            return {
                success: false,
                message: 'The field must contain only digits',
                code: 'digits_between_invalid',
            };
        }

        if (stringValue.length < this.min || stringValue.length > this.max) {
            return {
                success: false,
                message: `The field must have between ${this.min} and ${this.max} digits`,
                code: 'digits_between',
            };
        }

        return { success: true };
    }
}

/**
 * Regra para validar máximo de dígitos.
 *
 * @example
 * const rule = new MaxDigitsRule(10);
 */
export class MaxDigitsRule implements StandardSchemaRule<string | number> {
    public readonly name = 'max_digits';

    public constructor(private readonly max: number) {}

    public validate(context: ValidationContext<string | number>): RuleResult {
        const value = context.value;

        if (value === null || value === undefined) {
            return { success: true };
        }

        const stringValue = String(value);
        const digitsOnly = /^\d+$/.test(stringValue);

        if (!digitsOnly) {
            return {
                success: false,
                message: 'The field must contain only digits',
                code: 'max_digits_invalid',
            };
        }

        if (stringValue.length > this.max) {
            return {
                success: false,
                message: `The field must not have more than ${this.max} digits`,
                code: 'max_digits',
            };
        }

        return { success: true };
    }
}

/**
 * Regra para validar mínimo de dígitos.
 *
 * @example
 * const rule = new MinDigitsRule(3);
 */
export class MinDigitsRule implements StandardSchemaRule<string | number> {
    public readonly name = 'min_digits';

    public constructor(private readonly min: number) {}

    public validate(context: ValidationContext<string | number>): RuleResult {
        const value = context.value;

        if (value === null || value === undefined) {
            return { success: true };
        }

        const stringValue = String(value);
        const digitsOnly = /^\d+$/.test(stringValue);

        if (!digitsOnly) {
            return {
                success: false,
                message: 'The field must contain only digits',
                code: 'min_digits_invalid',
            };
        }

        if (stringValue.length < this.min) {
            return {
                success: false,
                message: `The field must have at least ${this.min} digits`,
                code: 'min_digits',
            };
        }

        return { success: true };
    }
}

/**
 * Regra para validar se não começa com valores específicos.
 *
 * @example
 * const rule = new DoesntStartWithRule('http://', 'https://');
 */
export class DoesntStartWithRule implements StandardSchemaRule<string> {
    public readonly name = 'doesnt_start_with';

    public constructor(private readonly values: string[]) {}

    public validate(context: ValidationContext<string>): RuleResult {
        const value = context.value;

        if (value === null || value === undefined) {
            return { success: true };
        }

        for (const prefix of this.values) {
            if (value.startsWith(prefix)) {
                return {
                    success: false,
                    message: `The field must not start with ${this.values.join(', ')}`,
                    code: 'doesnt_start_with',
                };
            }
        }

        return { success: true };
    }
}

/**
 * Regra para validar se não termina com valores específicos.
 *
 * @example
 * const rule = new DoesntEndWithRule('.exe', '.bat');
 */
export class DoesntEndWithRule implements StandardSchemaRule<string> {
    public readonly name = 'doesnt_end_with';

    public constructor(private readonly values: string[]) {}

    public validate(context: ValidationContext<string>): RuleResult {
        const value = context.value;

        if (value === null || value === undefined) {
            return { success: true };
        }

        for (const suffix of this.values) {
            if (value.endsWith(suffix)) {
                return {
                    success: false,
                    message: `The field must not end with ${this.values.join(', ')}`,
                    code: 'doesnt_end_with',
                };
            }
        }

        return { success: true };
    }
}

/**
 * Regra para validar se não corresponde a um padrão regex.
 *
 * @example
 * const rule = new NotRegexRule(/^[0-9]+$/);
 */
export class NotRegexRule implements StandardSchemaRule<string> {
    public readonly name = 'not_regex';

    public constructor(private readonly pattern: RegExp) {}

    public validate(context: ValidationContext<string>): RuleResult {
        const value = context.value;

        if (value === null || value === undefined) {
            return { success: true };
        }

        if (this.pattern.test(value)) {
            return {
                success: false,
                message: `The field must not match the pattern ${this.pattern}`,
                code: 'not_regex',
            };
        }

        return { success: true };
    }
}
