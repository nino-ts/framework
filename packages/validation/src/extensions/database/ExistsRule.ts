/**
 * Regra para validar existência em banco de dados.
 *
 * @packageDocumentation
 * Verifica se o valor fornecido existe em uma coluna específica de uma tabela.
 * Requer um repositório de database para executar a verificação.
 */

import type { StandardSchemaRule, ValidationContext, RuleResult } from '../../contracts/StandardSchemaRule';

/**
 * Interface para repositório de database.
 */
export interface DatabaseRepository {
    /**
     * Verifica se um valor existe em uma tabela/coluna.
     *
     * @param table - Nome da tabela
     * @param column - Nome da coluna
     * @param value - Valor a ser verificado
     * @returns Promise que resolve para true se existir
     */
    exists(table: string, column: string, value: unknown): Promise<boolean>;

    /**
     * Verifica se um valor é único em uma tabela/coluna.
     *
     * @param table - Nome da tabela
     * @param column - Nome da coluna
     * @param value - Valor a ser verificado
     * @param ignoreId - ID a ser ignorado (opcional, para updates)
     * @returns Promise que resolve para true se for único
     */
    unique(table: string, column: string, value: unknown, ignoreId?: number | string): Promise<boolean>;
}

/**
 * Contexto estendido com repositório de database.
 */
export interface DatabaseValidationContext<T = unknown> extends ValidationContext<T> {
    /**
     * Repositório de database para verificação.
     */
    database?: DatabaseRepository;
}

/**
 * Regra para validar existência em banco de dados.
 *
 * @example
 * // Uso básico
 * const rule = new ExistsRule('users', 'email');
 *
 * @example
 * // Com contexto de database
 * const context: DatabaseValidationContext<string> = {
 *     value: 'user@example.com',
 *     originalValue: 'user@example.com',
 *     path: ['email'],
 *     data: {},
 *     database: myDatabaseRepository
 * };
 */
export class ExistsRule implements StandardSchemaRule<string> {
    /**
     * Nome da regra.
     */
    public readonly name = 'exists';

    /**
     * Cria uma nova instância da regra ExistsRule.
     *
     * @param table - Nome da tabela para verificar
     * @param column - Nome da coluna para verificar (padrão: o nome do campo)
     */
    public constructor(
        private readonly table: string,
        private readonly column?: string,
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
                message: 'Database repository not available for exists validation',
                code: 'exists_no_database',
            };
        }

        // Determina a coluna a ser verificada
        const column = this.column ?? (context.path[context.path.length - 1] as string) ?? 'id';

        // Nota: Validação assíncrona requer tratamento especial
        // Retorna placeholder indicando necessidade de async
        return {
            success: false,
            message: `Async validation required for exists check on ${this.table}.${column}`,
            code: 'exists_async_required',
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
                message: 'Database repository not available for exists validation',
                code: 'exists_no_database',
            };
        }

        // Determina a coluna a ser verificada
        const column = this.column ?? (context.path[context.path.length - 1] as string) ?? 'id';

        // Verifica a existência no banco de dados
        const exists = await context.database.exists(this.table, column, value);

        if (!exists) {
            return {
                success: false,
                message: `The selected ${column} does not exist in ${this.table}`,
                code: 'exists',
            };
        }

        return { success: true };
    }
}
