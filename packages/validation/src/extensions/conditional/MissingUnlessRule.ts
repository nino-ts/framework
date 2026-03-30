/**
 * Regra para validação condicional: ausente a menos que campo seja valor.
 *
 * @packageDocumentation
 * Torna o campo ausente obrigatório quando outro campo NÃO tem um valor específico.
 */

import type { StandardSchemaRule, ValidationContext, RuleResult } from '../../contracts/StandardSchemaRule';

/**
 * Regra para validar ausência condicional baseado em outro campo.
 *
 * @example
 * // Campo deve estar ausente a menos que status seja 'active'
 * const rule = new MissingUnlessRule('status', 'active');
 */
export class MissingUnlessRule implements StandardSchemaRule<unknown> {
    /**
     * Nome da regra.
     */
    public readonly name = 'missing_unless';

    /**
     * Cria uma nova instância da regra MissingUnlessRule.
     *
     * @param field - Nome do campo para verificar
     * @param value - Valor que dispensa a ausência
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
            // Campo tem o valor de exceção - não precisa estar ausente
            return { success: true };
        }

        // O campo deve estar ausente
        if (context.value !== undefined) {
            return {
                success: false,
                message: `The field must not be present unless ${this.field} is ${this.value}`,
                code: 'missing_unless',
            };
        }

        return { success: true };
    }
}
