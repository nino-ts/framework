/**
 * Regra para validação de diferença entre campos.
 *
 * @packageDocumentation
 * Valida se o valor de um campo é diferente do valor de outro campo.
 */

import type { StandardSchemaRule, ValidationContext, RuleResult } from '../../contracts/StandardSchemaRule';

/**
 * Regra para validar diferença entre campos.
 *
 * @example
 * // Valida se password é diferente de old_password
 * const rule = new DifferentRule('old_password');
 */
export class DifferentRule implements StandardSchemaRule<unknown> {
    /**
     * Nome da regra.
     */
    public readonly name = 'different';

    /**
     * Cria uma nova instância da regra DifferentRule.
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
        if (value == referenceValue) {
            return {
                success: false,
                message: `The field must be different from ${this.field}`,
                code: 'different',
            };
        }

        return { success: true };
    }
}
