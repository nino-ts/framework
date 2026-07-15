/**
 * Regra para validação de apenas letras Unicode.
 *
 * @packageDocumentation
 * Valida se uma string contém apenas letras (Unicode).
 */
import type { RuleResult, StandardSchemaRule, ValidationContext } from "../../contracts/StandardSchemaRule";
/**
 * Regra para validar apenas letras Unicode.
 *
 * @example
 * // Valida se string tem apenas letras
 * const rule = new AlphaRule();
 */
export declare class AlphaRule implements StandardSchemaRule<string> {
    /**
     * Nome da regra.
     */
    readonly name = "alpha";
    /**
     * Regex para letras Unicode.
     * \p{L} corresponde a qualquer letra em qualquer idioma.
     */
    private readonly alphaRegex;
    /**
     * Executa a validação da regra.
     *
     * @param context - Contexto contendo o valor e metadados da validação
     * @returns Resultado da validação
     */
    validate(context: ValidationContext<string>): RuleResult;
}
