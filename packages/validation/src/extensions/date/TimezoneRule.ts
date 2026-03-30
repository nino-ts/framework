/**
 * Regra para validação de timezone.
 *
 * @packageDocumentation
 * Valida se uma string é um timezone válido.
 */

import type { StandardSchemaRule, ValidationContext, RuleResult } from '../../contracts/StandardSchemaRule';

/**
 * Lista de timezones comuns para validação.
 */
export const COMMON_TIMEZONES = [
    'UTC',
    'GMT',
    'America/New_York',
    'America/Chicago',
    'America/Denver',
    'America/Los_Angeles',
    'America/Sao_Paulo',
    'Europe/London',
    'Europe/Paris',
    'Europe/Berlin',
    'Europe/Moscow',
    'Asia/Tokyo',
    'Asia/Shanghai',
    'Asia/Kolkata',
    'Asia/Dubai',
    'Australia/Sydney',
    'Pacific/Auckland',
    'Africa/Cairo',
    'Africa/Johannesburg',
] as const;

/**
 * Regra para validar timezone.
 *
 * @example
 * // Validação básica de timezone
 * const rule = new TimezoneRule();
 */
export class TimezoneRule implements StandardSchemaRule<string> {
    /**
     * Nome da regra.
     */
    public readonly name = 'timezone';

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
                message: 'The timezone must be a string',
                code: 'timezone_invalid_type',
            };
        }

        // Verifica se é um timezone válido
        if (!this.isValidTimezone(value)) {
            return {
                success: false,
                message: 'The selected timezone is invalid',
                code: 'timezone',
            };
        }

        return { success: true };
    }

    /**
     * Verifica se um timezone é válido.
     *
     * @param timezone - Timezone a verificar
     * @returns True se válido
     */
    private isValidTimezone(timezone: string): boolean {
        try {
            // Tenta criar uma data com o timezone
            // Intl.DateTimeFormat aceita timezones IANA
            new Intl.DateTimeFormat('en-US', { timeZone: timezone });
            return true;
        } catch {
            return false;
        }
    }
}
