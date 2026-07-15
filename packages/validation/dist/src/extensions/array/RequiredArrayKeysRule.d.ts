/**
 * Regra para validação de chaves requeridas em array.
 *
 * @packageDocumentation
 * Valida se um array/objeto contém todas as chaves especificadas.
 */
import type { RuleResult, StandardSchemaRule, ValidationContext } from "../../contracts/StandardSchemaRule";
/**
 * Regra para validar chaves requeridas em array/objeto.
 *
 * @example
 * // Valida se objeto tem chaves específicas
 * const rule = new RequiredArrayKeysRule('id', 'name', 'email');
 */
export declare class RequiredArrayKeysRule implements StandardSchemaRule<Record<string, unknown>> {
    /**
     * Nome da regra.
     */
    readonly name = "required_array_keys";
    /**
     * Chaves requeridas.
     */
    private requiredKeys;
    /**
     * Cria uma nova instância da regra RequiredArrayKeysRule.
     *
     * @param keys - Chaves que devem estar presentes
     */
    constructor(...keys: string[]);
    /**
     * Executa a validação da regra.
     *
     * @param context - Contexto contendo o valor e metadados da validação
     * @returns Resultado da validação
     */
    validate(context: ValidationContext<Record<string, unknown>>): RuleResult;
}
