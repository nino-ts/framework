/**
 * Regra para validação condicional: exclui se campo for valor.
 *
 * @packageDocumentation
 * Exclui o campo da validação quando outro campo tem um valor específico.
 * Diferente de prohibited, exclude remove o campo do dataset validado.
 */

import type { StandardSchemaRule, ValidationContext, RuleResult } from '../../contracts/StandardSchemaRule';

/**
 * Regra para validar exclusão condicional baseado em outro campo.
 *
 * @example
 * // Campo é excluído se type for 'guest'
 * const rule = new ExcludeIfRule('type', 'guest');
 */
export class ExcludeIfRule implements StandardSchemaRule<unknown> {
    /**
     * Nome da regra.
     */
    public readonly name = 'exclude_if';

    /**
     * Cria uma nova instância da regra ExcludeIfRule.
     *
     * @param field - Nome do campo para verificar
     * @param value - Valor que dispara a exclusão
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
            // Campo deve ser excluído - marca para exclusão
            // O schema pai deve remover este campo do resultado
            return {
                success: false,
                message: 'Field excluded',
                code: 'exclude_if',
            };
        }

        return { success: true };
    }

    /**
     * Verifica se o campo deve ser excluído.
     *
     * @param data - Dados completos sendo validados
     * @returns True se o campo deve ser excluído
     */
    public shouldExclude(data: Record<string, unknown>): boolean {
        const referenceValue = data[this.field];
        // eslint-disable-next-line eqeqeq
        return referenceValue == this.value;
    }
}
