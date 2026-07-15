/**
 * Regra para validação de senha atual do usuário autenticado.
 *
 * @packageDocumentation
 * Valida se a senha fornecida corresponde à senha do usuário autenticado.
 * Requer um serviço de autenticação para verificar a senha.
 */
import type { RuleResult, StandardSchemaRule, ValidationContext } from "../../contracts/StandardSchemaRule";
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
export declare class CurrentPasswordRule implements StandardSchemaRule<string> {
    /**
     * Nome da regra.
     */
    readonly name = "current_password";
    /**
     * Executa a validação da regra.
     *
     * @param context - Contexto contendo o valor e metadados da validação
     * @returns Resultado da validação
     */
    validate(context: AuthValidationContext<string>): RuleResult;
    /**
     * Versão assíncrona da validação.
     *
     * @param context - Contexto contendo o valor e metadados da validação
     * @returns Promise do resultado da validação
     */
    validateAsync(context: AuthValidationContext<string>): Promise<RuleResult>;
}
