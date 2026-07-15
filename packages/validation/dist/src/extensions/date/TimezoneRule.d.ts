/**
 * Regra para validação de timezone.
 *
 * @packageDocumentation
 * Valida se uma string é um timezone válido.
 */
import type { RuleResult, StandardSchemaRule, ValidationContext } from "../../contracts/StandardSchemaRule";
/**
 * Lista de timezones comuns para validação.
 */
export declare const COMMON_TIMEZONES: readonly ["UTC", "GMT", "America/New_York", "America/Chicago", "America/Denver", "America/Los_Angeles", "America/Sao_Paulo", "Europe/London", "Europe/Paris", "Europe/Berlin", "Europe/Moscow", "Asia/Tokyo", "Asia/Shanghai", "Asia/Kolkata", "Asia/Dubai", "Australia/Sydney", "Pacific/Auckland", "Africa/Cairo", "Africa/Johannesburg"];
/**
 * Regra para validar timezone.
 *
 * @example
 * // Validação básica de timezone
 * const rule = new TimezoneRule();
 */
export declare class TimezoneRule implements StandardSchemaRule<string> {
    /**
     * Nome da regra.
     */
    readonly name = "timezone";
    /**
     * Executa a validação da regra.
     *
     * @param context - Contexto contendo o valor e metadados da validação
     * @returns Resultado da validação
     */
    validate(context: ValidationContext<string>): RuleResult;
    /**
     * Verifica se um timezone é válido.
     *
     * @param timezone - Timezone a verificar
     * @returns True se válido
     */
    private isValidTimezone;
}
