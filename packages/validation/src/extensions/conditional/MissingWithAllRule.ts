/**
 * Regra para validação condicional: ausente se todos os campos estiverem presentes.
 *
 * @packageDocumentation
 * Torna o campo ausente obrigatório quando todos os campos especificados estão presentes.
 */

import type { StandardSchemaRule, ValidationContext, RuleResult } from '../../contracts/StandardSchemaRule';

/**
 * Regra para validar ausência condicional baseado na presença de múltiplos campos.
 *
 * @example
 * // Campo deve estar ausente se todos os campos estiverem presentes
 * const rule = new MissingWithAllRule('field1', 'field2', 'field3');
 */
export class MissingWithAllRule implements StandardSchemaRule<unknown> {
    /**
     * Nome da regra.
     */
    public readonly name = 'missing_with_all';

    /**
     * Cria uma nova instância da regra MissingWithAllRule.
     *
     * @param fields - Nomes dos campos para verificar presença
     */
    public constructor(private readonly fields: string[]) {}

    /**
     * Executa a validação da regra.
     *
     * @param context - Contexto contendo o valor e metadados da validação
     * @returns Resultado da validação
     */
    public validate(context: ValidationContext<unknown>): RuleResult {
        // Verifica se todos os campos estão presentes
        const allPresent = this.fields.every((field) => {
            const value = context.data[field];
            return value !== undefined && value !== null;
        });

        if (allPresent) {
            // O campo deve estar ausente
            if (context.value !== undefined) {
                return {
                    success: false,
                    message: `The field must not be present when all of ${this.fields.join(', ')} are present`,
                    code: 'missing_with_all',
                };
            }
        }

        return { success: true };
    }
}
