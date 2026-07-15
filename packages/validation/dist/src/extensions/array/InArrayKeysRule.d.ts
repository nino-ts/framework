/**
 * Regra para validação de chaves em array.
 *
 * @packageDocumentation
 * Valida se pelo menos uma das chaves especificadas está presente no array/objeto.
 */
import type { RuleResult, StandardSchemaRule, ValidationContext } from "../../contracts/StandardSchemaRule";
/**
 * Regra para validar presença de pelo menos uma chave.
 *
 * @example
 * // Valida se tem pelo menos uma das chaves
 * const rule = new InArrayKeysRule('email', 'phone', 'address');
 */
export declare class InArrayKeysRule implements StandardSchemaRule<Record<string, unknown>> {
    /**
     * Nome da regra.
     */
    readonly name = "in_array_keys";
    /**
     * Chaves para verificar.
     */
    private keys;
    /**
     * Cria uma nova instância da regra InArrayKeysRule.
     *
     * @param keys - Chaves para verificar
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
