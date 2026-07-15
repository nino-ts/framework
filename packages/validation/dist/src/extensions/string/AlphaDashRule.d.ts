/**
 * Regra para validação de letras, números, dashes e underscores.
 *
 * @packageDocumentation
 * Valida se uma string contém apenas letras, números, dashes (-) e underscores (_).
 */
import type { RuleResult, StandardSchemaRule, ValidationContext } from "../../contracts/StandardSchemaRule";
/**
 * Regra para validar letras, números, dashes e underscores.
 *
 * @example
 * // Valida se string tem apenas letras, números, dashes e underscores
 * const rule = new AlphaDashRule();
 */
export declare class AlphaDashRule implements StandardSchemaRule<string> {
    /**
     * Nome da regra.
     */
    readonly name = "alpha_dash";
    /**
     * Regex para letras, números, dashes e underscores Unicode.
     * \p{L} corresponde a qualquer letra, \p{N} a qualquer número.
     */
    private readonly alphaDashRegex;
    /**
     * Executa a validação da regra.
     *
     * @param context - Contexto contendo o valor e metadados da validação
     * @returns Resultado da validação
     */
    validate(context: ValidationContext<string>): RuleResult;
}
