/**
 * Regra para validação de valor em array de outro campo.
 *
 * @packageDocumentation
 * Valida se o valor existe nos valores de outro campo (array).
 */
import type { RuleResult, StandardSchemaRule, ValidationContext } from "../../contracts/StandardSchemaRule";
/**
 * Regra para validar valor em array de outro campo.
 *
 * @example
 * // Valida se valor está no array permissions
 * const rule = new InArrayRule('permissions');
 */
export declare class InArrayRule implements StandardSchemaRule<unknown> {
    private readonly field;
    /**
     * Nome da regra.
     */
    readonly name = "in_array";
    /**
     * Cria uma nova instância da regra InArrayRule.
     *
     * @param field - Nome do campo que contém o array
     */
    constructor(field: string);
    /**
     * Executa a validação da regra.
     *
     * @param context - Contexto contendo o valor e metadados da validação
     * @returns Resultado da validação
     */
    validate(context: ValidationContext<unknown>): RuleResult;
    /**
     * Compara dois valores para igualdade.
     *
     * @param a - Primeiro valor
     * @param b - Segundo valor
     * @returns True se iguais
     */
    private valuesEqual;
}
