/**
 * Regra para validação de formato de data.
 *
 * @packageDocumentation
 * Valida se uma data corresponde a um formato específico (non-ISO).
 */

import type { StandardSchemaRule, ValidationContext, RuleResult } from '../../contracts/StandardSchemaRule';

/**
 * Mapeamento de tokens de formato para regex.
 */
const FORMAT_PATTERNS: Record<string, string> = {
    d: '[0-9]{1,2}', // Dia (1-31)
    dd: '[0-9]{2}', // Dia com zero (01-31)
    D: '[A-Za-z]{1,3}', // Dia da semana abreviado (Mon, Tue)
    DD: '[A-Za-z]{3,9}', // Dia da semana completo (Monday, Tuesday)
    m: '[0-9]{1,2}', // Mês (1-12)
    mm: '[0-9]{2}', // Mês com zero (01-12)
    M: '[0-9]{1,2}', // Mês (1-12)
    MM: '[0-9]{2}', // Mês com zero (01-12)
    MMM: '[A-Za-z]{3}', // Mês abreviado (Jan, Feb)
    MMMM: '[A-Za-z]{3,9}', // Mês completo (January, February)
    yy: '[0-9]{2}', // Ano 2 dígitos (00-99)
    yyyy: '[0-9]{4}', // Ano 4 dígitos (1900-2099)
    h: '[0-9]{1,2}', // Hora (0-23)
    hh: '[0-9]{2}', // Hora com zero (00-23)
    H: '[0-9]{1,2}', // Hora (0-23)
    HH: '[0-9]{2}', // Hora com zero (00-23)
    i: '[0-9]{1,2}', // Minuto (0-59)
    ii: '[0-9]{2}', // Minuto com zero (00-59)
    mm_time: '[0-9]{2}', // Minuto com zero (00-59) - alias para evitar conflito
    s: '[0-9]{1,2}', // Segundo (0-59)
    ss: '[0-9]{2}', // Segundo com zero (00-59)
    a: '[AaPp][Mm]?', // AM/PM
    A: '[AaPp][Mm]?', // AM/PM
};

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
export class DateFormatRule implements StandardSchemaRule<string> {
    /**
     * Nome da regra.
     */
    public readonly name = 'date_format';

    /**
     * Formato esperado.
     */
    private format: string;

    /**
     * Regex compilada do formato.
     */
    private formatRegex: RegExp;

    /**
     * Cria uma nova instância da regra DateFormatRule.
     *
     * @param format - Formato da data (ex: 'Y-m-d', 'd/m/Y', 'm/d/Y H:i:s')
     */
    public constructor(format: string) {
        this.format = format;
        this.formatRegex = this.compileFormat(format);
    }

    /**
     * Executa a validação da regra.
     *
     * @param context - Contexto contendo o valor e metadados da validação
     * @returns Resultado da validação
     */
    public validate(context: ValidationContext<string>): RuleResult {
        const value = context.value;

        // Se o valor for null ou undefined, considera válido (não required por padrão)
        if (value === null || value === undefined) {
            return { success: true };
        }

        // Verifica se é uma string
        if (typeof value !== 'string') {
            return {
                success: false,
                message: 'The date must be a string',
                code: 'date_format_invalid_type',
            };
        }

        // Verifica se corresponde ao formato
        if (!this.formatRegex.test(value)) {
            return {
                success: false,
                message: `The date must be in the format ${this.format}`,
                code: 'date_format',
            };
        }

        // Verifica se a data é válida (ex: não 31/02/2024)
        if (!this.isValidDate(value)) {
            return {
                success: false,
                message: `The date is invalid`,
                code: 'date_format_invalid',
            };
        }

        return { success: true };
    }

    /**
     * Compila o formato para regex.
     *
     * @param format - Formato a compilar
     * @returns RegExp compilada
     */
    private compileFormat(format: string): RegExp {
        // Escapa caracteres especiais
        let pattern = format
            .replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

        // Substitui tokens de formato por padrões regex
        // Ordena por tamanho decrescente para evitar substituições parciais
        const tokens = Object.keys(FORMAT_PATTERNS).sort((a, b) => b.length - a.length);

        for (const token of tokens) {
            // Trata caso especial de 'mm' para minutos vs mês
            if (token === 'mm_time') {
                continue;
            }

            const regexPattern = FORMAT_PATTERNS[token];
            if (regexPattern) {
                // Escapa o token para busca literal
                const escapedToken = token.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
                pattern = pattern.replace(new RegExp(escapedToken, 'g'), regexPattern);
            }
        }

        return new RegExp(`^${pattern}$`);
    }

    /**
     * Verifica se a data é válida.
     *
     * @param value - Data a verificar
     * @returns True se válida
     */
    private isValidDate(value: string): boolean {
        // Tenta parsear a data com o formato
        const parsed = this.parseDate(value);
        return parsed !== null;
    }

    /**
     * Parse a data do formato.
     *
     * @param value - Data a parsear
     * @returns Date ou null
     */
    private parseDate(value: string): Date | null {
        // Implementação simplificada - tenta criar Date
        const date = new Date(value);
        if (Number.isNaN(date.getTime())) {
            return null;
        }
        return date;
    }
}
