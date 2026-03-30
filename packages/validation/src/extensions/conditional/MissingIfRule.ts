/**
 * Regra para validação condicional: ausente se campo for valor.
 *
 * @packageDocumentation
 * Torna o campo ausente obrigatório quando outro campo tem um valor específico.
 */

import type { StandardSchemaRule, ValidationContext, RuleResult } from '../../contracts/StandardSchemaRule';

/**
 * Regra para validar ausência condicional baseado em outro campo.
 *
 * @example
 * // Campo deve estar ausente se status for 'inactive'
 * const rule = new MissingIfRule('status', 'inactive');
 */
export class MissingIfRule implements StandardSchemaRule<unknown> {
    /**
     * Nome da regra.
     */
    public readonly name = 'missing_if';

    /**
     * Cria uma nova instância da regra MissingIfRule.
     *
     * @param field - Nome do campo para verificar
     * @param value - Valor que dispara a ausência
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
            // O campo deve estar ausente
            if (context.value !== undefined) {
                return {
                    success: false,
                    message: `The field must not be present when ${this.field} is ${this.value}`,
                    code: 'missing_if',
                };
            }
        }

        return { success: true };
    }
}
