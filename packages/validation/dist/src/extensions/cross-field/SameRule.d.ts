/**
 * Regra para validação de igualdade entre campos.
 *
 * @packageDocumentation
 * Valida se o valor de um campo é igual ao valor de outro campo.
 */
import type { RuleResult, StandardSchemaRule, ValidationContext } from "../../contracts/StandardSchemaRule";
/**
 * Regra para validar igualdade entre campos.
 *
 * @example
 * // Valida se email é igual a email_confirmation
 * const rule = new SameRule('email_confirmation');
 */
export declare class SameRule implements StandardSchemaRule<unknown> {
    private readonly field;
    /**
     * Nome da regra.
     */
    readonly name = "same";
    /**
     * Cria uma nova instância da regra SameRule.
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
