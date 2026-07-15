/**
 * Regra para validação de senha com chaining fluente.
 *
 * @packageDocumentation
 * Fornece validação de senha com múltiplos critérios:
 * - Comprimento mínimo
 * Letras (pelo menos uma)
 * Letras maiúsculas e minúsculas (mixed case)
 * Números
 * Símbolos
 * Senha não comprometida (verificação de vazamentos)
 */
import type { RuleResult, StandardSchemaRule, ValidationContext } from "../../contracts/StandardSchemaRule";
/**
 * Configuração de validação de senha.
 */
export interface PasswordConfig {
    /**
     * Comprimento mínimo da senha.
     */
    minLength?: number;
    /**
     * Requer pelo menos uma letra.
     */
    requireLetters?: boolean;
    /**
     * Requer letras maiúsculas e minúsculas.
     */
    requireMixedCase?: boolean;
    /**
     * Requer pelo menos um número.
     */
    requireNumbers?: boolean;
    /**
     * Requer pelo menos um símbolo.
     */
    requireSymbols?: boolean;
    /**
     * Verifica se a senha foi comprometida em vazamentos.
     */
    checkUncompromised?: boolean;
}
/**
 * Regra para validação de senha.
 *
 * @example
 * // Validação básica
 * const rule = new PasswordRule().min(8);
 *
 * @example
 * // Validação completa
 * const rule = new PasswordRule()
 *     .min(8)
 *     .letters()
 *     .mixedCase()
 *     .numbers()
 *     .symbols()
 *     .uncompromised();
 */
export declare class PasswordRule implements StandardSchemaRule<string> {
    /**
     * Nome da regra.
     */
    readonly name = "password";
    /**
     * Configuração atual da validação.
     */
    private config;
    /**
     * Define o comprimento mínimo da senha.
     *
     * @param length - Comprimento mínimo
     * @returns Este schema para chaining
     */
    min(length: number): this;
    /**
     * Requer pelo menos uma letra na senha.
     *
     * @returns Este schema para chaining
     */
    letters(): this;
    /**
     * Requer letras maiúsculas e minúsculas (mixed case).
     *
     * @returns Este schema para chaining
     */
    mixedCase(): this;
    /**
     * Requer pelo menos um número na senha.
     *
     * @returns Este schema para chaining
     */
    numbers(): this;
    /**
     * Requer pelo menos um símbolo na senha.
     *
     * @returns Este schema para chaining
     */
    symbols(): this;
    /**
     * Verifica se a senha não foi comprometida em vazamentos.
     * Nota: Esta verificação requer uma API externa (ex: Have I Been Pwned).
     *
     * @returns Este schema para chaining
     */
    uncompromised(): this;
    /**
     * Executa a validação da regra.
     *
     * @param context - Contexto contendo o valor e metadados da validação
     * @returns Resultado da validação
     */
    validate(context: ValidationContext<string>): RuleResult;
    /**
     * Versão assíncrona da validação (para uncompromised check).
     *
     * @param context - Contexto contendo o valor e metadados da validação
     * @returns Promise do resultado da validação
     */
    validateAsync(context: ValidationContext<string>): Promise<RuleResult>;
    /**
     * Verifica se a senha foi comprometida em vazamentos.
     * Implementação usando k-anonymity (Have I Been Pwned API).
     *
     * @param password - Senha a ser verificada
     * @returns Promise que resolve para true se comprometida
     */
    private checkIfCompromised;
}
