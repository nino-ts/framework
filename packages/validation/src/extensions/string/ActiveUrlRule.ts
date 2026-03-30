/**
 * Regra para validação de URL ativa.
 *
 * @packageDocumentation
 * Valida se uma URL tem um DNS A/AAAA válido (URL ativa).
 */

import type { StandardSchemaRule, ValidationContext, RuleResult } from '../../contracts/StandardSchemaRule';

/**
 * Regra para validar URL ativa.
 *
 * @example
 * // Valida se URL tem DNS válido
 * const rule = new ActiveUrlRule();
 */
export class ActiveUrlRule implements StandardSchemaRule<string> {
    /**
     * Nome da regra.
     */
    public readonly name = 'active_url';

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
                message: 'The URL must be a string',
                code: 'active_url_invalid_type',
            };
        }

        // Verifica formato de URL
        try {
            new URL(value);
        } catch {
            return {
                success: false,
                message: 'The URL format is invalid',
                code: 'active_url_invalid_format',
            };
        }

        // Nota: Verificação DNS real requer ambiente Node/Bun com módulo 'dns'
        // Em ambiente browser, esta verificação não é possível
        // Retorna sucesso assumindo que a URL é válida
        // Para verificação real, usar validateAsync

        return { success: true };
    }

    /**
     * Versão assíncrona da validação (com verificação DNS).
     *
     * @param context - Contexto contendo o valor e metadados da validação
     * @returns Promise do resultado da validação
     */
    public async validateAsync(context: ValidationContext<string>): Promise<RuleResult> {
        const value = context.value;

        // Se o valor for null ou undefined, considera válido (não required por padrão)
        if (value === null || value === undefined) {
            return { success: true };
        }

        // Verifica formato de URL
        let url: URL;
        try {
            url = new URL(value);
        } catch {
            return {
                success: false,
                message: 'The URL format is invalid',
                code: 'active_url_invalid_format',
            };
        }

        // Tenta fazer fetch da URL (verificação básica de acessibilidade)
        try {
            // Usa método HEAD para não baixar conteúdo
            const response = await fetch(url.toString(), { method: 'HEAD' });

            // Verifica se recebeu resposta (qualquer status code)
            if (response.ok || response.status < 500) {
                return { success: true };
            }

            return {
                success: false,
                message: 'The URL is not accessible',
                code: 'active_url_not_accessible',
            };
        } catch {
            // Falha na conexão - URL não está ativa
            return {
                success: false,
                message: 'The URL is not active',
                code: 'active_url',
            };
        }
    }
}
