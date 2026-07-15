/**
 * Regra para validar existência em banco de dados.
 *
 * @packageDocumentation
 * Verifica se o valor fornecido existe em uma coluna específica de uma tabela.
 * Requer um repositório de database para executar a verificação.
 */
import type { RuleResult, StandardSchemaRule, ValidationContext } from "../../contracts/StandardSchemaRule";
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
export declare class ExistsRule implements StandardSchemaRule<string> {
    private readonly table;
    private readonly column?;
    /**
     * Nome da regra.
     */
    readonly name = "exists";
    /**
     * Cria uma nova instância da regra ExistsRule.
     *
     * @param table - Nome da tabela para verificar
     * @param column - Nome da coluna para verificar (padrão: o nome do campo)
     */
    constructor(table: string, column?: string | undefined);
    /**
     * Executa a validação da regra.
     *
     * @param context - Contexto contendo o valor e metadados da validação
     * @returns Resultado da validação
     */
    validate(context: DatabaseValidationContext<string>): RuleResult;
    /**
     * Versão assíncrona da validação.
     *
     * @param context - Contexto contendo o valor e metadados da validação
     * @returns Promise do resultado da validação
     */
    validateAsync(context: DatabaseValidationContext<string>): Promise<RuleResult>;
}
