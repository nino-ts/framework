/**
 * Regra para validação condicional: proibido a menos que campo seja valor.
 *
 * @packageDocumentation
 * Torna o campo proibido quando outro campo NÃO tem um valor específico.
 */

import type { StandardSchemaRule, ValidationContext, RuleResult } from '../../contracts/StandardSchemaRule';

/**
 * Regra para validar campo proibido condicional baseado em outro campo.
 *
 * @example
 * // Campo é proibido a menos que status seja 'active'
 * const rule = new ProhibitedUnlessRule('status', 'active');
 */
export class ProhibitedUnlessRule implements StandardSchemaRule<unknown> {
    /**
     * Nome da regra.
     */
    public readonly name = 'prohibited_unless';

    /**
     * Cria uma nova instância da regra ProhibitedUnlessRule.
     *
     * @param field - Nome do campo para verificar
     * @param value - Valor que dispensa a proibição
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
            // Campo tem o valor de exceção - não é proibido
            return { success: true };
        }

        // O campo é proibido - verifica se está presente
        if (context.value !== undefined && context.value !== null) {
            // Verifica se é string não vazia
            if (typeof context.value === 'string' && context.value.trim() !== '') {
                return {
                    success: false,
                    message: `The field is prohibited unless ${this.field} is ${this.value}`,
                    code: 'prohibited_unless',
                };
            }

            // Verifica se é array não vazio
            if (Array.isArray(context.value) && context.value.length > 0) {
                return {
                    success: false,
                    message: `The field is prohibited unless ${this.field} is ${this.value}`,
                    code: 'prohibited_unless',
                };
            }

            // Qualquer outro valor não nulo
            return {
                success: false,
                message: `The field is prohibited unless ${this.field} is ${this.value}`,
                code: 'prohibited_unless',
            };
        }

        return { success: true };
    }
}
