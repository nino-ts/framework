/**
 * Regra para validação de valores distintos em array.
 *
 * @packageDocumentation
 * Valida se um array não contém valores duplicados.
 */
import type { RuleResult, StandardSchemaRule, ValidationContext } from "../../contracts/StandardSchemaRule";
/**
 * Regra para validar valores distintos em array.
 *
 * @example
 * // Valida se array tem valores únicos
 * const rule = new DistinctRule();
 */
export declare class DistinctRule implements StandardSchemaRule<unknown[]> {
    /**
     * Nome da regra.
     */
    readonly name = "distinct";
    /**
     * Executa a validação da regra.
     *
     * @param context - Contexto contendo o valor e metadados da validação
     * @returns Resultado da validação
     */
    validate(context: ValidationContext<unknown[]>): RuleResult;
    /**
     * Serializa valor para comparação.
     *
     * @param value - Valor a serializar
     * @returns String serializada
     */
    private serialize;
}
