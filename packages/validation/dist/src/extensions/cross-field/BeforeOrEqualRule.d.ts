/**
 * Regra para validação de data anterior ou igual.
 *
 * @packageDocumentation
 * Valida se uma data é anterior ou igual a outra data ou campo.
 */
import type { RuleResult, StandardSchemaRule, ValidationContext } from "../../contracts/StandardSchemaRule";
/**
 * Regra para validar se data é anterior ou igual a outra data/campo.
 *
 * @example
 * // Data anterior ou igual a hoje
 * const rule = new BeforeOrEqualRule('2024-12-31');
 *
 * @example
 * // Data anterior ou igual a outro campo
 * const rule = new BeforeOrEqualRule('end_date');
 */
export declare class BeforeOrEqualRule implements StandardSchemaRule<unknown> {
    private readonly dateOrField;
    /**
     * Nome da regra.
     */
    readonly name = "before_or_equal";
    /**
     * Cria uma nova instância da regra BeforeOrEqualRule.
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
