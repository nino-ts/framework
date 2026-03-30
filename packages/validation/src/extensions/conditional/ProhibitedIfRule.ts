/**
 * Regra para validação condicional: proibido se campo for valor.
 *
 * @packageDocumentation
 * Torna o campo proibido quando outro campo tem um valor específico.
 */

import type { StandardSchemaRule, ValidationContext, RuleResult } from '../../contracts/StandardSchemaRule';

/**
 * Regra para validar campo proibido condicional baseado em outro campo.
 *
 * @example
 * // Campo é proibido se status for 'inactive'
 * const rule = new ProhibitedIfRule('status', 'inactive');
 */
export class ProhibitedIfRule implements StandardSchemaRule<unknown> {
    /**
     * Nome da regra.
     */
    public readonly name = 'prohibited_if';

    /**
     * Cria uma nova instância da regra ProhibitedIfRule.
     *
     * @param field - Nome do campo para verificar
     * @param value - Valor que dispara a proibição
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
            // O campo é proibido - verifica se está presente
            if (context.value !== undefined && context.value !== null) {
                // Verifica se é string não vazia
                if (typeof context.value === 'string' && context.value.trim() !== '') {
                    return {
                        success: false,
                        message: `The field is prohibited when ${this.field} is ${this.value}`,
                        code: 'prohibited_if',
                    };
                }

                // Verifica se é array não vazio
                if (Array.isArray(context.value) && context.value.length > 0) {
                    return {
                        success: false,
                        message: `The field is prohibited when ${this.field} is ${this.value}`,
                        code: 'prohibited_if',
                    };
                }

                // Qualquer outro valor não nulo
                return {
                    success: false,
                    message: `The field is prohibited when ${this.field} is ${this.value}`,
                    code: 'prohibited_if',
                };
            }
        }

        return { success: true };
    }
}
