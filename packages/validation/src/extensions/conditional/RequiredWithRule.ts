/**
 * Regra para validação condicional: required se campo estiver presente.
 *
 * @packageDocumentation
 * Torna o campo obrigatório apenas quando outro campo está presente nos dados.
 */

import type { RuleResult, StandardSchemaRule, ValidationContext } from "../../contracts/StandardSchemaRule";

/**
 * Regra para validar required condicional baseado na presença de outro campo.
 *
 * @example
 * // Campo é required se address estiver presente
 * const rule = new RequiredWithRule('address');
 */
export class RequiredWithRule implements StandardSchemaRule<unknown> {
    /**
     * Nome da regra.
     */
    public readonly name = "required_with";

    /**
     * Cria uma nova instância da regra RequiredWithRule.
     *
     * @param field - Nome do campo para verificar presença
     */
    public constructor(private readonly field: string) {}

    /**
     * Executa a validação da regra.
     *
     * @param context - Contexto contendo o valor e metadados da validação
     * @returns Resultado da validação
     */
    public validate(context: ValidationContext<unknown>): RuleResult {
        // Verifica se o campo de referência está presente
        const referenceValue = context.data[this.field];
        const isPresent = referenceValue !== undefined && referenceValue !== null;

        if (!isPresent) {
            // Campo de referência não está presente - não é required
            return { success: true };
        }

        // O campo é required - verifica se está presente e não vazio
        if (context.value === undefined || context.value === null) {
            return {
                code: "required_with",
                message: `The field is required when ${this.field} is present`,
                success: false,
            };
        }

        // Verifica se é string vazia
        if (typeof context.value === "string" && context.value.trim() === "") {
            return {
                code: "required_with",
                message: `The field is required when ${this.field} is present`,
                success: false,
            };
        }

        // Verifica se é array vazio
        if (Array.isArray(context.value) && context.value.length === 0) {
            return {
                code: "required_with",
                message: `The field is required when ${this.field} is present`,
                success: false,
            };
        }

        return { success: true };
    }
}
