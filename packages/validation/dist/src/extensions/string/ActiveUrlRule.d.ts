/**
 * Regra para validação de URL ativa.
 *
 * @packageDocumentation
 * Valida se uma URL tem um DNS A/AAAA válido (URL ativa).
 */
import type { RuleResult, StandardSchemaRule, ValidationContext } from "../../contracts/StandardSchemaRule";
/**
 * Regra para validar URL ativa.
 *
 * @example
 * // Valida se URL tem DNS válido
 * const rule = new ActiveUrlRule();
 */
export declare class ActiveUrlRule implements StandardSchemaRule<string> {
    /**
     * Nome da regra.
     */
    readonly name = "active_url";
    /**
     * Executa a validação da regra.
     *
     * @param context - Contexto contendo o valor e metadados da validação
     * @returns Resultado da validação
     */
    validate(context: ValidationContext<string>): RuleResult;
    /**
     * Versão assíncrona da validação (com verificação DNS).
     *
     * @param context - Contexto contendo o valor e metadados da validação
     * @returns Promise do resultado da validação
     */
    validateAsync(context: ValidationContext<string>): Promise<RuleResult>;
}
