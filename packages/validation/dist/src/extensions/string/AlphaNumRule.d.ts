/**
 * Regra para validação de apenas letras e números Unicode.
 *
 * @packageDocumentation
 * Valida se uma string contém apenas letras e números (Unicode).
 */
import type { RuleResult, StandardSchemaRule, ValidationContext } from "../../contracts/StandardSchemaRule";
/**
 * Regra para validar apenas letras e números Unicode.
 *
 * @example
 * // Valida se string tem apenas letras e números
 * const rule = new AlphaNumRule();
 */
export declare class AlphaNumRule implements StandardSchemaRule<string> {
    /**
     * Nome da regra.
     */
    readonly name = "alpha_num";
    /**
     * Regex para letras e números Unicode.
     * \p{L} corresponde a qualquer letra, \p{N} a qualquer número.
     */
    private readonly alphaNumRegex;
    /**
     * Executa a validação da regra.
     *
     * @param context - Contexto contendo o valor e metadados da validação
     * @returns Resultado da validação
     */
    validate(context: ValidationContext<string>): RuleResult;
}
