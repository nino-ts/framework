/**
 * Composer para regras de negação/composição.
 *
 * @packageDocumentation
 * Fornece funções utilitárias para criar regras de validação por negação ou composição.
 */

import type { StandardSchemaRule, ValidationContext, RuleResult } from '../contracts/StandardSchemaRule';

/**
 * Regra para validar se valor não está em uma lista.
 *
 * @example
 * const rule = new NotInRule(['admin', 'root']);
 */
export class NotInRule implements StandardSchemaRule<unknown> {
    public readonly name = 'not_in';

    public constructor(private readonly values: unknown[]) {}

    public validate(context: ValidationContext<unknown>): RuleResult {
        const value = context.value;

        if (value === null || value === undefined) {
            return { success: true };
        }

        for (const forbidden of this.values) {
            if (this.valuesEqual(value, forbidden)) {
                return {
                    success: false,
                    message: 'The selected value is not allowed',
                    code: 'not_in',
                };
            }
        }

        return { success: true };
    }

    private valuesEqual(a: unknown, b: unknown): boolean {
        if (a === b) {
            return true;
        }

        if (typeof a === 'object' && typeof b === 'object' && a !== null && b !== null) {
            try {
                return JSON.stringify(a) === JSON.stringify(b);
            } catch {
                return false;
            }
        }

        return false;
    }
}

/**
 * Regra para validar se valor é múltiplo de um divisor.
 *
 * @example
 * const rule = new MultipleOfRule(5);
 */
export class MultipleOfRule implements StandardSchemaRule<number> {
    public readonly name = 'multiple_of';

    public constructor(private readonly divisor: number) {}

    public validate(context: ValidationContext<number>): RuleResult {
        const value = context.value;

        if (value === null || value === undefined) {
            return { success: true };
        }

        if (typeof value !== 'number') {
            return {
                success: false,
                message: 'The field must be a number',
                code: 'multiple_of_invalid_type',
            };
        }

        if (value % this.divisor !== 0) {
            return {
                success: false,
                message: `The field must be a multiple of ${this.divisor}`,
                code: 'multiple_of',
            };
        }

        return { success: true };
    }
}

/**
 * Regra para validar se campo não está vazio quando presente.
 *
 * @example
 * const rule = new FilledRule();
 */
export class FilledRule implements StandardSchemaRule<unknown> {
    public readonly name = 'filled';

    public validate(context: ValidationContext<unknown>): RuleResult {
        const value = context.value;

        // Se undefined, considera válido (não required por padrão)
        if (value === undefined) {
            return { success: true };
        }

        // Se null, verifica se é considerado vazio
        if (value === null) {
            return {
                success: false,
                message: 'The field cannot be empty',
                code: 'filled',
            };
        }

        // Verifica string vazia
        if (typeof value === 'string' && value.trim() === '') {
            return {
                success: false,
                message: 'The field cannot be empty',
                code: 'filled',
            };
        }

        // Verifica array vazio
        if (Array.isArray(value) && value.length === 0) {
            return {
                success: false,
                message: 'The field cannot be empty',
                code: 'filled',
            };
        }

        // Verifica objeto vazio
        if (typeof value === 'object' && Object.keys(value).length === 0) {
            return {
                success: false,
                message: 'The field cannot be empty',
                code: 'filled',
            };
        }

        return { success: true };
    }
}

/**
 * Regra para validar se campo deve estar presente.
 *
 * @example
 * const rule = new PresentRule();
 */
export class PresentRule implements StandardSchemaRule<unknown> {
    public readonly name = 'present';

    public validate(context: ValidationContext<unknown>): RuleResult {
        // Verifica se está presente (não undefined)
        if (context.value === undefined) {
            return {
                success: false,
                message: 'The field must be present',
                code: 'present',
            };
        }

        return { success: true };
    }
}

/**
 * Regra para validar presença condicional: presente se campo for valor.
 *
 * @example
 * const rule = new PresentIfRule('status', 'active');
 */
export class PresentIfRule implements StandardSchemaRule<unknown> {
    public readonly name = 'present_if';

    public constructor(
        private readonly field: string,
        private readonly value: unknown,
    ) {}

    public validate(context: ValidationContext<unknown>): RuleResult {
        const referenceValue = context.data[this.field];

        // eslint-disable-next-line eqeqeq
        if (referenceValue == this.value) {
            if (context.value === undefined) {
                return {
                    success: false,
                    message: `The field must be present when ${this.field} is ${this.value}`,
                    code: 'present_if',
                };
            }
        }

        return { success: true };
    }
}

/**
 * Regra para validar presença condicional: presente a menos que campo seja valor.
 *
 * @example
 * const rule = new PresentUnlessRule('status', 'inactive');
 */
export class PresentUnlessRule implements StandardSchemaRule<unknown> {
    public readonly name = 'present_unless';

    public constructor(
        private readonly field: string,
        private readonly value: unknown,
    ) {}

    public validate(context: ValidationContext<unknown>): RuleResult {
        const referenceValue = context.data[this.field];

        // eslint-disable-next-line eqeqeq
        if (referenceValue == this.value) {
            return { success: true };
        }

        if (context.value === undefined) {
            return {
                success: false,
                message: `The field must be present unless ${this.field} is ${this.value}`,
                code: 'present_unless',
            };
        }

        return { success: true };
    }
}
