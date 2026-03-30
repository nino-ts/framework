/**
 * Regra para validação condicional: required se campo for valor.
 *
 * @packageDocumentation
 * Torna o campo obrigatório apenas quando outro campo tem um valor específico.
 */

import type { StandardSchemaRule, ValidationContext, RuleResult } from '../../contracts/StandardSchemaRule';

/**
 * Regra para validar required condicional baseado em outro campo.
 *
 * @example
 * // Campo é required se payment_method for 'credit_card'
 * const rule = new RequiredIfRule('payment_method', 'credit_card');
 */
export class RequiredIfRule implements StandardSchemaRule<unknown> {
    /**
     * Nome da regra.
     */
    public readonly name = 'required_if';

    /**
     * Cria uma nova instância da regra RequiredIfRule.
     *
     * @param field - Nome do campo para verificar
     * @param value - Valor que dispara o required
     */
    public constructor(
        private readonly field: string,
        private readonly value: unknown,
    ) {}

    /**
     * Executa a validação da regra.
     *
     * @param context - Contexto contendo o valor e metadados da validação
     * @returns Resultado da validação
     */
    public validate(context: ValidationContext<unknown>): RuleResult {
        // Verifica se o campo de referência tem o valor especificado
        const referenceValue = context.data[this.field];

        // Compara valores (usa == para compatibilidade com Laravel)
        // eslint-disable-next-line eqeqeq
        if (referenceValue == this.value) {
            // O campo é required - verifica se está presente e não vazio
            if (context.value === undefined || context.value === null) {
                return {
                    success: false,
                    message: `The field is required when ${this.field} is ${this.value}`,
                    code: 'required_if',
                };
            }

            // Verifica se é string vazia
            if (typeof context.value === 'string' && context.value.trim() === '') {
                return {
                    success: false,
                    message: `The field is required when ${this.field} is ${this.value}`,
                    code: 'required_if',
                };
            }

            // Verifica se é array vazio
            if (Array.isArray(context.value) && context.value.length === 0) {
                return {
                    success: false,
                    message: `The field is required when ${this.field} is ${this.value}`,
                    code: 'required_if',
                };
            }
        }

        return { success: true };
    }
}
