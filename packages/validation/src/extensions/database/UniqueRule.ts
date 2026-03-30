/**
 * Regra para validar unicidade em banco de dados.
 *
 * @packageDocumentation
 * Verifica se o valor fornecido não existe em uma coluna específica de uma tabela.
 * Útil para validar unicidade de emails, usernames, etc.
 */

import type { StandardSchemaRule, RuleResult } from '../../contracts/StandardSchemaRule';
import type { DatabaseValidationContext } from './ExistsRule';

/**
 * Regra para validar unicidade em banco de dados.
 *
 * @example
 * // Uso básico
 * const rule = new UniqueRule('users', 'email');
 *
 * @example
 * // Com exceção de ID (para updates)
 * const rule = new UniqueRule('users', 'email', 123);
 */
export class UniqueRule implements StandardSchemaRule<string> {
    /**
     * Nome da regra.
     */
    public readonly name = 'unique';

    /**
     * Cria uma nova instância da regra UniqueRule.
     *
     * @param table - Nome da tabela para verificar
     * @param column - Nome da coluna para verificar (padrão: o nome do campo)
     * @param ignoreId - ID a ser ignorado na verificação (útil para updates)
     */
    public constructor(
        private readonly table: string,
        private readonly column?: string,
        private readonly ignoreId?: number | string,
    ) {}

    /**
     * Executa a validação da regra.
     *
     * @param context - Contexto contendo o valor e metadados da validação
     * @returns Resultado da validação
     */
    public validate(context: DatabaseValidationContext<string>): RuleResult {
        const value = context.value;

        // Se o valor for null ou undefined, considera válido (não required por padrão)
        if (value === null || value === undefined) {
            return { success: true };
        }

        // Verifica se o repositório de database está disponível
        if (!context.database) {
            return {
                success: false,
                message: 'Database repository not available for unique validation',
                code: 'unique_no_database',
            };
        }

        // Determina a coluna a ser verificada
        const column = this.column ?? (context.path[context.path.length - 1] as string) ?? 'id';

        // Nota: Validação assíncrona requer tratamento especial
        return {
            success: false,
            message: `Async validation required for unique check on ${this.table}.${column}`,
            code: 'unique_async_required',
        };
    }

    /**
     * Versão assíncrona da validação.
     *
     * @param context - Contexto contendo o valor e metadados da validação
     * @returns Promise do resultado da validação
     */
    public async validateAsync(context: DatabaseValidationContext<string>): Promise<RuleResult> {
        const value = context.value;

        // Se o valor for null ou undefined, considera válido (não required por padrão)
        if (value === null || value === undefined) {
            return { success: true };
        }

        // Verifica se o repositório de database está disponível
        if (!context.database) {
            return {
                success: false,
                message: 'Database repository not available for unique validation',
                code: 'unique_no_database',
            };
        }

        // Determina a coluna a ser verificada
        const column = this.column ?? (context.path[context.path.length - 1] as string) ?? 'id';

        // Verifica a unicidade no banco de dados
        const isUnique = await context.database.unique(this.table, column, value, this.ignoreId);

        if (!isUnique) {
            return {
                success: false,
                message: `The ${column} has already been taken`,
                code: 'unique',
            };
        }

        return { success: true };
    }
}
