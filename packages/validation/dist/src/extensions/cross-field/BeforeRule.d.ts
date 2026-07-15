/**
 * Regra para validação de data anterior.
 *
 * @packageDocumentation
 * Valida se uma data é anterior a outra data ou campo.
 */
import type { RuleResult, StandardSchemaRule, ValidationContext } from "../../contracts/StandardSchemaRule";
/**
 * Regra para validar se data é anterior a outra data/campo.
 *
 * @example
 * // Data anterior a hoje
 * const rule = new BeforeRule('2024-12-31');
 *
 * @example
 * // Data anterior a outro campo
 * const rule = new BeforeRule('end_date');
 */
export declare class BeforeRule implements StandardSchemaRule<unknown> {
    private readonly dateOrField;
    /**
     * Nome da regra.
     */
    readonly name = "before";
    /**
     * Cria uma nova instância da regra BeforeRule.
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
