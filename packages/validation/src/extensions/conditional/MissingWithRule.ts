/**
 * Regra para validação condicional: ausente se campo estiver presente.
 *
 * @packageDocumentation
 * Torna o campo ausente obrigatório quando outro campo está presente.
 */

import type { StandardSchemaRule, ValidationContext, RuleResult } from '../../contracts/StandardSchemaRule';

/**
 * Regra para validar ausência condicional baseado na presença de outro campo.
 *
 * @example
 * // Campo deve estar ausente se credit_card estiver presente
 * const rule = new MissingWithRule('credit_card');
 */
export class MissingWithRule implements StandardSchemaRule<unknown> {
    /**
     * Nome da regra.
     */
    public readonly name = 'missing_with';

    /**
     * Cria uma nova instância da regra MissingWithRule.
     *
     * @param field - Nome do campo para verificar presença
     */
    public constructor(private readonly field: string) {}

    /**
     * Executa a validação da regra.
     *
     * @param context - Contexto contendo o valor e metadados da validação
     * @returns Resultado da validação
     */
    public validate(context: ValidationContext<unknown>): RuleResult {
        // Verifica se o campo de referência está presente
        const referenceValue = context.data[this.field];
        const isPresent = referenceValue !== undefined && referenceValue !== null;

        if (isPresent) {
            // O campo deve estar ausente
            if (context.value !== undefined) {
                return {
                    success: false,
                    message: `The field must not be present when ${this.field} is present`,
                    code: 'missing_with',
                };
            }
        }

        return { success: true };
    }
}
