/**
 * Regra para validação de confirmação de campo.
 *
 * @packageDocumentation
 * Valida se o valor de um campo corresponde ao valor de um campo {field}_confirmation.
 * Comum para validação de senha (password/password_confirmation).
 */

import type { StandardSchemaRule, ValidationContext, RuleResult } from '../../contracts/StandardSchemaRule';

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
export class ConfirmedRule implements StandardSchemaRule<unknown> {
    /**
     * Nome da regra.
     */
    public readonly name = 'confirmed';

    /**
     * Sufixo do campo de confirmação.
     */
    private readonly confirmationSuffix: string;

    /**
     * Cria uma nova instância da regra ConfirmedRule.
     *
     * @param confirmationSuffix - Sufixo do campo de confirmação (padrão: 'confirmation')
     */
    public constructor(confirmationSuffix = 'confirmation') {
        this.confirmationSuffix = confirmationSuffix;
    }

    /**
     * Executa a validação da regra.
     *
     * @param context - Contexto contendo o valor e metadados da validação
     * @returns Resultado da validação
     */
    public validate(context: ValidationContext<unknown>): RuleResult {
        const value = context.value;

        // Se o valor for null ou undefined, considera válido (não required por padrão)
        if (value === null || value === undefined) {
            return { success: true };
        }

        // Determina o nome do campo atual
        const fieldName = context.path[context.path.length - 1] as string;

        if (!fieldName) {
            return {
                success: false,
                message: 'Cannot determine field name for confirmation validation',
                code: 'confirmed_no_field',
            };
        }

        // Nome do campo de confirmação
        const confirmationField = `${fieldName}_${this.confirmationSuffix}`;

        // Obtém o valor do campo de confirmação
        const confirmationValue = context.data[confirmationField];

        // Verifica se os valores correspondem
        if (value !== confirmationValue) {
            return {
                success: false,
                message: `The ${confirmationField} field does not match ${fieldName}`,
                code: 'confirmed',
            };
        }

        return { success: true };
    }
}
