/**
 * Regra para validação de array sequencial (lista).
 *
 * @packageDocumentation
 * Valida se um array é sequencial (keys 0 a n-1).
 * Em JavaScript, arrays normais são sempre sequenciais,
 * mas esta regra verifica se não há "buracos" no array.
 */
import type { RuleResult, StandardSchemaRule, ValidationContext } from "../../contracts/StandardSchemaRule";
/**
 * Regra para validar array sequencial.
 *
 * @example
 * // Valida se array é sequencial
 * const rule = new ListRule();
 */
export declare class ListRule implements StandardSchemaRule<unknown[]> {
    /**
     * Nome da regra.
     */
    readonly name = "list";
    /**
     * Executa a validação da regra.
     *
     * @param context - Contexto contendo o valor e metadados da validação
     * @returns Resultado da validação
     */
    validate(context: ValidationContext<unknown[]>): RuleResult;
}
