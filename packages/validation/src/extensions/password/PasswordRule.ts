/**
 * Regra para validação de senha com chaining fluente.
 *
 * @packageDocumentation
 * Fornece validação de senha com múltiplos critérios:
 * - Comprimento mínimo
 * * Letras (pelo menos uma)
 * * Letras maiúsculas e minúsculas (mixed case)
 * * Números
 * * Símbolos
 * * Senha não comprometida (verificação de vazamentos)
 */

import type { StandardSchemaRule, ValidationContext, RuleResult } from '../../contracts/StandardSchemaRule';

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
export class PasswordRule implements StandardSchemaRule<string> {
    /**
     * Nome da regra.
     */
    public readonly name = 'password';

    /**
     * Configuração atual da validação.
     */
    private config: PasswordConfig = {};

    /**
     * Define o comprimento mínimo da senha.
     *
     * @param length - Comprimento mínimo
     * @returns Este schema para chaining
     */
    public min(length: number): this {
        this.config.minLength = length;
        return this;
    }

    /**
     * Requer pelo menos uma letra na senha.
     *
     * @returns Este schema para chaining
     */
    public letters(): this {
        this.config.requireLetters = true;
        return this;
    }

    /**
     * Requer letras maiúsculas e minúsculas (mixed case).
     *
     * @returns Este schema para chaining
     */
    public mixedCase(): this {
        this.config.requireMixedCase = true;
        return this;
    }

    /**
     * Requer pelo menos um número na senha.
     *
     * @returns Este schema para chaining
     */
    public numbers(): this {
        this.config.requireNumbers = true;
        return this;
    }

    /**
     * Requer pelo menos um símbolo na senha.
     *
     * @returns Este schema para chaining
     */
    public symbols(): this {
        this.config.requireSymbols = true;
        return this;
    }

    /**
     * Verifica se a senha não foi comprometida em vazamentos.
     * Nota: Esta verificação requer uma API externa (ex: Have I Been Pwned).
     *
     * @returns Este schema para chaining
     */
    public uncompromised(): this {
        this.config.checkUncompromised = true;
        return this;
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

        // Verifica comprimento mínimo
        if (this.config.minLength !== undefined && value.length < this.config.minLength) {
            return {
                success: false,
                message: `Password must be at least ${this.config.minLength} characters`,
                code: 'password_min',
            };
        }

        // Verifica se tem pelo menos uma letra
        if (this.config.requireLetters && !/[a-zA-Z]/.test(value)) {
            return {
                success: false,
                message: 'Password must contain at least one letter',
                code: 'password_letters',
            };
        }

        // Verifica mixed case (maiúscula e minúscula)
        if (this.config.requireMixedCase) {
            const hasUpper = /[A-Z]/.test(value);
            const hasLower = /[a-z]/.test(value);
            if (!hasUpper || !hasLower) {
                return {
                    success: false,
                    message: 'Password must contain both uppercase and lowercase letters',
                    code: 'password_mixed_case',
                };
            }
        }

        // Verifica se tem pelo menos um número
        if (this.config.requireNumbers && !/[0-9]/.test(value)) {
            return {
                success: false,
                message: 'Password must contain at least one number',
                code: 'password_numbers',
            };
        }

        // Verifica se tem pelo menos um símbolo
        if (this.config.requireSymbols && !/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(value)) {
            return {
                success: false,
                message: 'Password must contain at least one symbol',
                code: 'password_symbols',
            };
        }

        // Verificação uncompromised requer API externa - retorna warning
        if (this.config.checkUncompromised) {
            // Em produção, chamaria API como Have I Been Pwned
            // Por enquanto, apenas passa a validação
            // Implementação real deve ser assíncrona
        }

        return { success: true };
    }

    /**
     * Versão assíncrona da validação (para uncompromised check).
     *
     * @param context - Contexto contendo o valor e metadados da validação
     * @returns Promise do resultado da validação
     */
    public async validateAsync(context: ValidationContext<string>): Promise<RuleResult> {
        // Primeiro executa validações síncronas
        const syncResult = this.validate(context);
        if (!syncResult.success) {
            return syncResult;
        }

        // Verificação uncompromised
        if (this.config.checkUncompromised) {
            const isCompromised = await this.checkIfCompromised(context.value);
            if (isCompromised) {
                return {
                    success: false,
                    message: 'This password has been compromised in a data breach',
                    code: 'password_compromised',
                };
            }
        }

        return { success: true };
    }

    /**
     * Verifica se a senha foi comprometida em vazamentos.
     * Implementação usando k-anonymity (Have I Been Pwned API).
     *
     * @param password - Senha a ser verificada
     * @returns Promise que resolve para true se comprometida
     */
    private async checkIfCompromised(password: string): Promise<boolean> {
        // Hash SHA-1 da senha
        const encoder = new TextEncoder();
        const data = encoder.encode(password);
        const hashBuffer = await crypto.subtle.digest('SHA-1', data);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        const sha1Hash = hashArray.map((b) => b.toString(16).padStart(2, '0')).join('').toUpperCase();

        // k-anonymity: usa primeiros 5 caracteres
        const prefix = sha1Hash.slice(0, 5);
        const suffix = sha1Hash.slice(5);

        try {
            // Fetch da API HIBP
            const response = await fetch(`https://api.pwnedpasswords.com/range/${prefix}`);
            if (!response.ok) {
                return false; // Se falhar, assume não comprometida (fail-safe)
            }

            const text = await response.text();
            const lines = text.split('\n');

            // Verifica se o suffix está na lista
            for (const line of lines) {
                const hashSuffix = (line.split(':')[0]) ?? '';
                if (hashSuffix.toUpperCase() === suffix) {
                    return true;
                }
            }

            return false;
        } catch {
            // Se não conseguir verificar, assume não comprometida
            return false;
        }
    }
}
