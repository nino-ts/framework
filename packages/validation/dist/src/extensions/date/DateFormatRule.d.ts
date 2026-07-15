/**
 * Regra para validação de formato de data.
 *
 * @packageDocumentation
 * Valida se uma data corresponde a um formato específico (non-ISO).
 */
import type { RuleResult, StandardSchemaRule, ValidationContext } from "../../contracts/StandardSchemaRule";
/**
 * Regra para validar formato de data.
 *
 * @example
 * // Formato brasileiro
 * const rule = new DateFormatRule('d/m/Y');
 *
 * @example
 * // Formato americano
 * const rule = new DateFormatRule('m/d/Y');
 *
 * @example
 * // Formato com hora
 * const rule = new DateFormatRule('Y-m-d H:i:s');
 */
export declare class DateFormatRule implements StandardSchemaRule<string> {
    /**
     * Nome da regra.
     */
    readonly name = "date_format";
    /**
     * Formato esperado.
     */
    private format;
    /**
     * Regex compilada do formato.
     */
    private formatRegex;
    /**
     * Cria uma nova instância da regra DateFormatRule.
     *
     * @param format - Formato da data (ex: 'Y-m-d', 'd/m/Y', 'm/d/Y H:i:s')
     */
    constructor(format: string);
    /**
     * Executa a validação da regra.
     *
     * @param context - Contexto contendo o valor e metadados da validação
     * @returns Resultado da validação
     */
    validate(context: ValidationContext<string>): RuleResult;
    /**
     * Compila o formato para regex.
     *
     * @param format - Formato a compilar
     * @returns RegExp compilada
     */
    private compileFormat;
    /**
     * Verifica se a data é válida.
     *
     * @param value - Data a verificar
     * @returns True se válida
     */
    private isValidDate;
    /**
     * Parse a data do formato.
     *
     * @param value - Data a parsear
     * @returns Date ou null
     */
    private parseDate;
}
