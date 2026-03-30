/**
 * Regra para validação de igualdade entre campos.
 *
 * @packageDocumentation
 * Valida se o valor de um campo é igual ao valor de outro campo.
 */

import type { StandardSchemaRule, ValidationContext, RuleResult } from '../../contracts/StandardSchemaRule';

/**
 * Regra para validar igualdade entre campos.
 *
 * @example
 * // Valida se email é igual a email_confirmation
 * const rule = new SameRule('email_confirmation');
 */
export class SameRule implements StandardSchemaRule<unknown> {
    /**
     * Nome da regra.
     */
    public readonly name = 'same';

    /**
     * Cria uma nova instância da regra SameRule.
     *
     * @param field - Nome do campo para comparar
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

        // Obtém o valor do campo de referência
        const referenceValue = context.data[this.field];

        // Compara valores (usa == para compatibilidade com Laravel)
        // eslint-disable-next-line eqeqeq
        if (value != referenceValue) {
            return {
                success: false,
                message: `The field must match ${this.field}`,
                code: 'same',
            };
        }

        return { success: true };
    }
}
