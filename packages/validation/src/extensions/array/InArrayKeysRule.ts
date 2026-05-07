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
export class InArrayKeysRule implements StandardSchemaRule<Record<string, unknown>> {
    /**
     * Nome da regra.
     */
    public readonly name = "in_array_keys";

    /**
     * Chaves para verificar.
     */
    private keys: string[];

    /**
     * Cria uma nova instância da regra InArrayKeysRule.
     *
     * @param keys - Chaves para verificar
     */
    public constructor(...keys: string[]) {
        this.keys = keys;
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
        if (typeof value !== "object") {
            return {
                code: "in_array_keys_not_object",
                message: "The field must be an object or array",
                success: false,
            };
        }

        const obj = value as Record<string, unknown>;

        // Verifica se pelo menos uma chave está presente
        const hasKey = this.keys.some((key) => key in obj);

        if (!hasKey) {
            return {
                code: "in_array_keys",
                message: `The field must contain at least one of the following keys: ${this.keys.join(", ")}`,
                success: false,
            };
        }

        return { success: true };
    }
}
