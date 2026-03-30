/**
 * Regra para validação de valor em array de outro campo.
 *
 * @packageDocumentation
 * Valida se o valor existe nos valores de outro campo (array).
 */

import type { StandardSchemaRule, ValidationContext, RuleResult } from '../../contracts/StandardSchemaRule';

/**
 * Regra para validar valor em array de outro campo.
 *
 * @example
 * // Valida se valor está no array permissions
 * const rule = new InArrayRule('permissions');
 */
export class InArrayRule implements StandardSchemaRule<unknown> {
    /**
     * Nome da regra.
     */
    public readonly name = 'in_array';

    /**
     * Cria uma nova instância da regra InArrayRule.
     *
     * @param field - Nome do campo que contém o array
     */
    public constructor(private readonly field: string) {}

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

        // Obtém o array de referência
        const arrayValue = context.data[this.field];

        if (!Array.isArray(arrayValue)) {
            return {
                success: false,
                message: `The ${this.field} field must be an array`,
                code: 'in_array_not_array',
            };
        }

        // Verifica se o valor está no array
        const found = arrayValue.some((item) => this.valuesEqual(item, value));

        if (!found) {
            return {
                success: false,
                message: `The selected value is not in the ${this.field} field`,
                code: 'in_array',
            };
        }

        return { success: true };
    }

    /**
     * Compara dois valores para igualdade.
     *
     * @param a - Primeiro valor
     * @param b - Segundo valor
     * @returns True se iguais
     */
    private valuesEqual(a: unknown, b: unknown): boolean {
        // Compara valores primitivos
        if (a === b) {
            return true;
        }

        // Compara objetos (referência)
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
