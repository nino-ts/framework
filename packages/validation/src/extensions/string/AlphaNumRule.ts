/**
 * Regra para validação de apenas letras e números Unicode.
 *
 * @packageDocumentation
 * Valida se uma string contém apenas letras e números (Unicode).
 */

import type { StandardSchemaRule, ValidationContext, RuleResult } from '../../contracts/StandardSchemaRule';

/**
 * Regra para validar apenas letras e números Unicode.
 *
 * @example
 * // Valida se string tem apenas letras e números
 * const rule = new AlphaNumRule();
 */
export class AlphaNumRule implements StandardSchemaRule<string> {
    /**
     * Nome da regra.
     */
    public readonly name = 'alpha_num';

    /**
     * Regex para letras e números Unicode.
     * \p{L} corresponde a qualquer letra, \p{N} a qualquer número.
     */
    private readonly alphaNumRegex = /^[\p{L}\p{N}]+$/u;

    /**
     * Executa a validação da regra.
     *
     * @param context - Contexto contendo o valor e metadados da validação
     * @returns Resultado da validação
     */
    public validate(context: ValidationContext<string>): RuleResult {
        const value = context.value;

        // Se o valor for null ou undefined, considera válido (não required por padrão)
        if (value === null || value === undefined) {
            return { success: true };
        }

        // Verifica se é uma string
        if (typeof value !== 'string') {
            return {
                success: false,
                message: 'The field must be a string',
                code: 'alpha_num_invalid_type',
            };
        }

        // Verifica se está vazia
        if (value.length === 0) {
            return {
                success: false,
                message: 'The field must contain only letters and numbers',
                code: 'alpha_num_empty',
            };
        }

        // Verifica se contém apenas letras e números
        if (!this.alphaNumRegex.test(value)) {
            return {
                success: false,
                message: 'The field must contain only letters and numbers',
                code: 'alpha_num',
            };
        }

        return { success: true };
    }
}
