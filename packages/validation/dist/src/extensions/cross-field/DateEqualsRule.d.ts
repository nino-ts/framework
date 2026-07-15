/**
 * Regra para validação de igualdade de datas.
 *
 * @packageDocumentation
 * Valida se uma data é igual a outra data ou campo.
 */
import type { RuleResult, StandardSchemaRule, ValidationContext } from "../../contracts/StandardSchemaRule";
/**
 * Regra para validar se data é igual a outra data/campo.
 *
 * @example
 * // Data igual a uma data específica
 * const rule = new DateEqualsRule('2024-01-01');
 *
 * @example
 * // Data igual a outro campo
 * const rule = new DateEqualsRule('reference_date');
 */
export declare class DateEqualsRule implements StandardSchemaRule<unknown> {
    private readonly dateOrField;
    /**
     * Nome da regra.
     */
    readonly name = "date_equals";
    /**
     * Cria uma nova instância da regra DateEqualsRule.
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
