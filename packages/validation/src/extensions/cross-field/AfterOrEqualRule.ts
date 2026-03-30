/**
 * Regra para validação de data posterior ou igual.
 *
 * @packageDocumentation
 * Valida se uma data é posterior ou igual a outra data ou campo.
 */

import type { StandardSchemaRule, ValidationContext, RuleResult } from '../../contracts/StandardSchemaRule';

/**
 * Regra para validar se data é posterior ou igual a outra data/campo.
 *
 * @example
 * // Data posterior ou igual a hoje
 * const rule = new AfterOrEqualRule('2024-01-01');
 *
 * @example
 * // Data posterior ou igual a outro campo
 * const rule = new AfterOrEqualRule('start_date');
 */
export class AfterOrEqualRule implements StandardSchemaRule<unknown> {
    /**
     * Nome da regra.
     */
    public readonly name = 'after_or_equal';

    /**
     * Cria uma nova instância da regra AfterOrEqualRule.
     *
     * @param dateOrField - Data ou nome do campo para comparar
     */
    public constructor(private readonly dateOrField: string) {}

    /**
     * Executa a validação da regra.
     *
     * @param context - Contexto contendo o valor e metadados da validação
     * @returns Resultado da validação
     */
    public validate(context: ValidationContext<unknown>): RuleResult {
        const value = context.value;

        // Se o valor for null ou undefined, considera válido (não required por padrão)
        if (value === null || value === undefined) {
            return { success: true };
        }

        // Converte o valor para Date
        const valueDate = this.toDate(value);

        if (!valueDate) {
            return {
                success: false,
                message: 'Invalid date format',
                code: 'after_or_equal_invalid_date',
            };
        }

        // Obtém a data de referência
        const referenceDate = this.getReferenceDate(context);

        if (!referenceDate) {
            return {
                success: false,
                message: `Invalid reference date: ${this.dateOrField}`,
                code: 'after_or_equal_invalid_reference',
            };
        }

        // Verifica se a data é posterior ou igual
        if (valueDate < referenceDate) {
            return {
                success: false,
                message: `The date must be after or equal to ${this.dateOrField}`,
                code: 'after_or_equal',
            };
        }

        return { success: true };
    }

    /**
     * Converte valor para Date.
     *
     * @param value - Valor a converter
     * @returns Date ou null se inválido
     */
    private toDate(value: unknown): Date | null {
        if (value instanceof Date) {
            return value;
        }

        if (typeof value === 'string') {
            const date = new Date(value);
            if (!Number.isNaN(date.getTime())) {
                return date;
            }
        }

        if (typeof value === 'number') {
            const date = new Date(value);
            if (!Number.isNaN(date.getTime())) {
                return date;
            }
        }

        return null;
    }

    /**
     * Obtém a data de referência.
     *
     * @param context - Contexto de validação
     * @returns Date de referência ou null
     */
    private getReferenceDate(context: ValidationContext<unknown>): Date | null {
        // Verifica se é um campo
        const fieldValue = context.data[this.dateOrField];

        if (fieldValue !== undefined) {
            return this.toDate(fieldValue);
        }

        // Verifica se é uma data literal
        return this.toDate(this.dateOrField);
    }
}
