/**
 * Regra para validação de chaves requeridas em array.
 *
 * @packageDocumentation
 * Valida se um array/objeto contém todas as chaves especificadas.
 */

import type { StandardSchemaRule, ValidationContext, RuleResult } from '../../contracts/StandardSchemaRule';

/**
 * Regra para validar chaves requeridas em array/objeto.
 *
 * @example
 * // Valida se objeto tem chaves específicas
 * const rule = new RequiredArrayKeysRule('id', 'name', 'email');
 */
export class RequiredArrayKeysRule implements StandardSchemaRule<Record<string, unknown>> {
    /**
     * Nome da regra.
     */
    public readonly name = 'required_array_keys';

    /**
     * Chaves requeridas.
     */
    private requiredKeys: string[];

    /**
     * Cria uma nova instância da regra RequiredArrayKeysRule.
     *
     * @param keys - Chaves que devem estar presentes
     */
    public constructor(...keys: string[]) {
        this.requiredKeys = keys;
    }

    /**
     * Executa a validação da regra.
     *
     * @param context - Contexto contendo o valor e metadados da validação
     * @returns Resultado da validação
     */
    public validate(context: ValidationContext<Record<string, unknown>>): RuleResult {
        const value = context.value;

        // Se o valor for null ou undefined, considera válido (não required por padrão)
        if (value === null || value === undefined) {
            return { success: true };
        }

        // Verifica se é um objeto
        if (typeof value !== 'object') {
            return {
                success: false,
                message: 'The field must be an object or array',
                code: 'required_array_keys_not_object',
            };
        }

        const obj = value as Record<string, unknown>;

        // Verifica se todas as chaves estão presentes
        const missingKeys = this.requiredKeys.filter((key) => !(key in obj));

        if (missingKeys.length > 0) {
            return {
                success: false,
                message: `The field must contain the following keys: ${missingKeys.join(', ')}`,
                code: 'required_array_keys',
            };
        }

        return { success: true };
    }
}
