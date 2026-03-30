/**
 * Regra para validação condicional: required se campo estiver ausente.
 *
 * @packageDocumentation
 * Torna o campo obrigatório apenas quando outro campo NÃO está presente nos dados.
 */

import type { StandardSchemaRule, ValidationContext, RuleResult } from '../../contracts/StandardSchemaRule';

/**
 * Regra para validar required condicional baseado na ausência de outro campo.
 *
 * @example
 * // Campo é required se phone não estiver presente
 * const rule = new RequiredWithoutRule('phone');
 */
export class RequiredWithoutRule implements StandardSchemaRule<unknown> {
    /**
     * Nome da regra.
     */
    public readonly name = 'required_without';

    /**
     * Cria uma nova instância da regra RequiredWithoutRule.
     *
     * @param field - Nome do campo para verificar ausência
     */
    public constructor(private readonly field: string) {}

    /**
     * Executa a validação da regra.
     *
     * @param context - Contexto contendo o valor e metadados da validação
     * @returns Resultado da validação
     */
    public validate(context: ValidationContext<unknown>): RuleResult {
        // Verifica se o campo de referência está ausente
        const referenceValue = context.data[this.field];
        const isAbsent = referenceValue === undefined || referenceValue === null;

        if (!isAbsent) {
            // Campo de referência está presente - não é required
            return { success: true };
        }

        // O campo é required - verifica se está presente e não vazio
        if (context.value === undefined || context.value === null) {
            return {
                success: false,
                message: `The field is required when ${this.field} is not present`,
                code: 'required_without',
            };
        }

        // Verifica se é string vazia
        if (typeof context.value === 'string' && context.value.trim() === '') {
            return {
                success: false,
                message: `The field is required when ${this.field} is not present`,
                code: 'required_without',
            };
        }

        // Verifica se é array vazio
        if (Array.isArray(context.value) && context.value.length === 0) {
            return {
                success: false,
                message: `The field is required when ${this.field} is not present`,
                code: 'required_without',
            };
        }

        return { success: true };
    }
}
