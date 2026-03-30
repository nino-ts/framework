/**
 * Regra para validação de senha atual do usuário autenticado.
 *
 * @packageDocumentation
 * Valida se a senha fornecida corresponde à senha do usuário autenticado.
 * Requer um serviço de autenticação para verificar a senha.
 */

import type { StandardSchemaRule, ValidationContext, RuleResult } from '../../contracts/StandardSchemaRule';

/**
 * Interface para serviço de autenticação.
 */
export interface AuthService {
    /**
     * Verifica se a senha fornecida é válida para o usuário atual.
     *
     * @param password - Senha a verificar
     * @returns Promise que resolve para true se válida
     */
    checkCurrentPassword(password: string): Promise<boolean>;
}

/**
 * Contexto estendido com serviço de autenticação.
 */
export interface AuthValidationContext<T = unknown> extends ValidationContext<T> {
    /**
     * Serviço de autenticação para verificação.
     */
    auth?: AuthService;
}

/**
 * Regra para validar senha atual do usuário.
 *
 * @example
 * // Valida senha atual
 * const rule = new CurrentPasswordRule();
 */
export class CurrentPasswordRule implements StandardSchemaRule<string> {
    /**
     * Nome da regra.
     */
    public readonly name = 'current_password';

    /**
     * Executa a validação da regra.
     *
     * @param context - Contexto contendo o valor e metadados da validação
     * @returns Resultado da validação
     */
    public validate(context: AuthValidationContext<string>): RuleResult {
        const value = context.value;

        // Se o valor for null ou undefined, considera válido (não required por padrão)
        if (value === null || value === undefined) {
            return { success: true };
        }

        // Verifica se é uma string
        if (typeof value !== 'string') {
            return {
                success: false,
                message: 'The password must be a string',
                code: 'current_password_invalid_type',
            };
        }

        // Verifica se o serviço de autenticação está disponível
        if (!context.auth) {
            return {
                success: false,
                message: 'Auth service not available for password validation',
                code: 'current_password_no_auth',
            };
        }

        // Nota: Verificação real de senha requer async
        // Retorna placeholder indicando necessidade de async
        return {
            success: false,
            message: 'Async validation required for password check',
            code: 'current_password_async_required',
        };
    }

    /**
     * Versão assíncrona da validação.
     *
     * @param context - Contexto contendo o valor e metadados da validação
     * @returns Promise do resultado da validação
     */
    public async validateAsync(context: AuthValidationContext<string>): Promise<RuleResult> {
        const value = context.value;

        // Se o valor for null ou undefined, considera válido (não required por padrão)
        if (value === null || value === undefined) {
            return { success: true };
        }

        // Verifica se é uma string
        if (typeof value !== 'string') {
            return {
                success: false,
                message: 'The password must be a string',
                code: 'current_password_invalid_type',
            };
        }

        // Verifica se o serviço de autenticação está disponível
        if (!context.auth) {
            return {
                success: false,
                message: 'Auth service not available for password validation',
                code: 'current_password_no_auth',
            };
        }

        // Verifica a senha
        const isValid = await context.auth.checkCurrentPassword(value);

        if (!isValid) {
            return {
                success: false,
                message: 'The current password is incorrect',
                code: 'current_password',
            };
        }

        return { success: true };
    }
}
