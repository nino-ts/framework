/**
 * Regra para validação de letras, números, dashes e underscores.
 *
 * @packageDocumentation
 * Valida se uma string contém apenas letras, números, dashes (-) e underscores (_).
 */

import type { StandardSchemaRule, ValidationContext, RuleResult } from '../../contracts/StandardSchemaRule';

/**
 * Regra para validar letras, números, dashes e underscores.
 *
 * @example
 * // Valida se string tem apenas letras, números, dashes e underscores
 * const rule = new AlphaDashRule();
 */
export class AlphaDashRule implements StandardSchemaRule<string> {
    /**
     * Nome da regra.
     */
    public readonly name = 'alpha_dash';

    /**
     * Regex para letras, números, dashes e underscores Unicode.
     * \p{L} corresponde a qualquer letra, \p{N} a qualquer número.
     */
    private readonly alphaDashRegex = /^[\p{L}\p{N}_-]+$/u;

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
                code: 'alpha_dash_invalid_type',
            };
        }

        // Verifica se está vazia
        if (value.length === 0) {
            return {
                success: false,
                message: 'The field must contain only letters, numbers, dashes and underscores',
                code: 'alpha_dash_empty',
            };
        }

        // Verifica se contém apenas caracteres permitidos
        if (!this.alphaDashRegex.test(value)) {
            return {
                success: false,
                message: 'The field must contain only letters, numbers, dashes and underscores',
                code: 'alpha_dash',
            };
        }

        return { success: true };
    }
}
