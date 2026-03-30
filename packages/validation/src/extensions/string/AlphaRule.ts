/**
 * Regra para validação de apenas letras Unicode.
 *
 * @packageDocumentation
 * Valida se uma string contém apenas letras (Unicode).
 */

import type { StandardSchemaRule, ValidationContext, RuleResult } from '../../contracts/StandardSchemaRule';

/**
 * Regra para validar apenas letras Unicode.
 *
 * @example
 * // Valida se string tem apenas letras
 * const rule = new AlphaRule();
 */
export class AlphaRule implements StandardSchemaRule<string> {
    /**
     * Nome da regra.
     */
    public readonly name = 'alpha';

    /**
     * Regex para letras Unicode.
     * \p{L} corresponde a qualquer letra em qualquer idioma.
     */
    private readonly alphaRegex = /^\p{L}+$/u;

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
                code: 'alpha_invalid_type',
            };
        }

        // Verifica se está vazia
        if (value.length === 0) {
            return {
                success: false,
                message: 'The field must contain only letters',
                code: 'alpha_empty',
            };
        }

        // Verifica se contém apenas letras
        if (!this.alphaRegex.test(value)) {
            return {
                success: false,
                message: 'The field must contain only letters',
                code: 'alpha',
            };
        }

        return { success: true };
    }
}
