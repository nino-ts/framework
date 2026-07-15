/**
 * Regra para validação de data posterior ou igual.
 *
 * @packageDocumentation
 * Valida se uma data é posterior ou igual a outra data ou campo.
 */
import type { RuleResult, StandardSchemaRule, ValidationContext } from "../../contracts/StandardSchemaRule";
/**
 * Regra para validar se data é posterior ou igual a outra data/campo.
 *
 * @example
 * // Data posterior ou igual a hoje
 * const rule = new AfterOrEqualRule('2024-01-01');
 *
 * @example
 * // Data posterior ou igual a outro campo
 * const rule = new AfterOrEqualRule('start_date');
 */
export declare class AfterOrEqualRule implements StandardSchemaRule<unknown> {
    private readonly dateOrField;
    /**
     * Nome da regra.
     */
    readonly name = "after_or_equal";
    /**
     * Cria uma nova instância da regra AfterOrEqualRule.
     *
     * @param dateOrField - Data ou nome do campo para comparar
     */
    constructor(dateOrField: string);
    /**
     * Executa a validação da regra.
     *
     * @param context - Contexto contendo o valor e metadados da validação
     * @returns Resultado da validação
     */
    validate(context: ValidationContext<unknown>): RuleResult;
    /**
     * Converte valor para Date.
     *
     * @param value - Valor a converter
     * @returns Date ou null se inválido
     */
    private toDate;
    /**
     * Obtém a data de referência.
     *
     * @param context - Contexto de validação
     * @returns Date de referência ou null
     */
    private getReferenceDate;
}
