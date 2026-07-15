/**
 * Regra para validação de confirmação de campo.
 *
 * @packageDocumentation
 * Valida se o valor de um campo corresponde ao valor de um campo {field}_confirmation.
 * Comum para validação de senha (password/password_confirmation).
 */
import type { RuleResult, StandardSchemaRule, ValidationContext } from "../../contracts/StandardSchemaRule";
/**
 * Regra para validar confirmação de campo.
 *
 * @example
 * // Valida password contra password_confirmation
 * const rule = new ConfirmedRule();
 *
 * @example
 * // Valida contra campo personalizado
 * const rule = new ConfirmedRule('email_verify');
 */
export declare class ConfirmedRule implements StandardSchemaRule<unknown> {
    /**
     * Nome da regra.
     */
    readonly name = "confirmed";
    /**
     * Sufixo do campo de confirmação.
     */
    private readonly confirmationSuffix;
    /**
     * Cria uma nova instância da regra ConfirmedRule.
     *
     * @param confirmationSuffix - Sufixo do campo de confirmação (padrão: 'confirmation')
     */
    constructor(confirmationSuffix?: string);
    /**
     * Executa a validação da regra.
     *
     * @param context - Contexto contendo o valor e metadados da validação
     * @returns Resultado da validação
     */
    validate(context: ValidationContext<unknown>): RuleResult;
}
