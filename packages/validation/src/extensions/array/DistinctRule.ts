/**
 * Regra para validação de valores distintos em array.
 *
 * @packageDocumentation
 * Valida se um array não contém valores duplicados.
 */

import type { StandardSchemaRule, ValidationContext, RuleResult } from '../../contracts/StandardSchemaRule';

/**
 * Regra para validar valores distintos em array.
 *
 * @example
 * // Valida se array tem valores únicos
 * const rule = new DistinctRule();
 */
export class DistinctRule implements StandardSchemaRule<unknown[]> {
    /**
     * Nome da regra.
     */
    public readonly name = 'distinct';

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
                code: 'distinct_not_array',
            };
        }

        // Verifica valores duplicados
        const seen = new Set<unknown>();

        for (const item of value) {
            // Usa serialização simples para comparação
            const serialized = this.serialize(item);

            if (seen.has(serialized)) {
                return {
                    success: false,
                    message: 'The array must not contain duplicate values',
                    code: 'distinct',
                };
            }

            seen.add(serialized);
        }

        return { success: true };
    }

    /**
     * Serializa valor para comparação.
     *
     * @param value - Valor a serializar
     * @returns String serializada
     */
    private serialize(value: unknown): string {
        if (value === null) {
            return 'null';
        }

        if (value === undefined) {
            return 'undefined';
        }

        if (typeof value === 'object') {
            try {
                return JSON.stringify(value);
            } catch {
                return String(value);
            }
        }

        return String(value);
    }
}
