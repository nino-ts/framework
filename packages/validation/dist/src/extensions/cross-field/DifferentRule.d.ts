/**
 * Regra para validação de diferença entre campos.
 *
 * @packageDocumentation
 * Valida se o valor de um campo é diferente do valor de outro campo.
 */
import type { RuleResult, StandardSchemaRule, ValidationContext } from "../../contracts/StandardSchemaRule";
/**
 * Regra para validar diferença entre campos.
 *
 * @example
 * // Valida se password é diferente de old_password
 * const rule = new DifferentRule('old_password');
 */
export declare class DifferentRule implements StandardSchemaRule<unknown> {
    private readonly field;
    /**
     * Nome da regra.
     */
    readonly name = "different";
    /**
     * Cria uma nova instância da regra DifferentRule.
     *
     * @param field - Nome do campo para comparar
     */
    constructor(field: string);
    /**
     * Executa a validação da regra.
     *
     * @param context - Contexto contendo o valor e metadados da validação
     * @returns Resultado da validação
     */
    validate(context: ValidationContext<unknown>): RuleResult;
}
