/**
 * Regra para validação de array sequencial (lista).
 *
 * @packageDocumentation
 * Valida se um array é sequencial (keys 0 a n-1).
 * Em JavaScript, arrays normais são sempre sequenciais,
 * mas esta regra verifica se não há "buracos" no array.
 */

import type { StandardSchemaRule, ValidationContext, RuleResult } from '../../contracts/StandardSchemaRule';

/**
 * Regra para validar array sequencial.
 *
 * @example
 * // Valida se array é sequencial
 * const rule = new ListRule();
 */
export class ListRule implements StandardSchemaRule<unknown[]> {
    /**
     * Nome da regra.
     */
    public readonly name = 'list';

    /**
     * Executa a validação da regra.
     *
     * @param context - Contexto contendo o valor e metadados da validação
     * @returns Resultado da validação
     */
    public validate(context: ValidationContext<unknown[]>): RuleResult {
        const value = context.value;

        // Se o valor for null ou undefined, considera válido (não required por padrão)
        if (value === null || value === undefined) {
            return { success: true };
        }

        // Verifica se é um array
        if (!Array.isArray(value)) {
            return {
                success: false,
                message: 'The field must be an array',
                code: 'list_not_array',
            };
        }

        // Verifica se é um array denso (sem holes)
        // Em JavaScript, arrays criados normalmente são sempre densos
        // Esta verificação é mais para garantir que não é um objeto tipo-array
        for (let i = 0; i < value.length; i++) {
            if (!(i in value)) {
                return {
                    success: false,
                    message: 'The field must be a sequential array',
                    code: 'list_not_sequential',
                };
            }
        }

        return { success: true };
    }
}
