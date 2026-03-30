/**
 * Regra para validação: campo deve estar ausente.
 *
 * @packageDocumentation
 * Valida que o campo não deve estar presente nos dados.
 */

import type { StandardSchemaRule, ValidationContext, RuleResult } from '../../contracts/StandardSchemaRule';

/**
 * Regra para validar que o campo deve estar ausente.
 *
 * @example
 * // Campo deve estar ausente
 * const rule = new MissingRule();
 */
export class MissingRule implements StandardSchemaRule<unknown> {
    /**
     * Nome da regra.
     */
    public readonly name = 'missing';

    /**
     * Executa a validação da regra.
     *
     * @param context - Contexto contendo o valor e metadados da validação
     * @returns Resultado da validação
     */
    public validate(context: ValidationContext<unknown>): RuleResult {
        // Verifica se o valor está ausente (undefined)
        if (context.value !== undefined) {
            return {
                success: false,
                message: 'The field must not be present',
                code: 'missing',
            };
        }

        return { success: true };
    }
}
