/**
 * Regra para validar unicidade em banco de dados.
 *
 * @packageDocumentation
 * Verifica se o valor fornecido não existe em uma coluna específica de uma tabela.
 * Útil para validar unicidade de emails, usernames, etc.
 */
import type { RuleResult, StandardSchemaRule } from "../../contracts/StandardSchemaRule";
import type { DatabaseValidationContext } from "./ExistsRule";
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
export declare class UniqueRule implements StandardSchemaRule<string> {
    private readonly table;
    private readonly column?;
    private readonly ignoreId?;
    /**
     * Nome da regra.
     */
    readonly name = "unique";
    /**
     * Cria uma nova instância da regra UniqueRule.
     *
     * @param table - Nome da tabela para verificar
     * @param column - Nome da coluna para verificar (padrão: o nome do campo)
     * @param ignoreId - ID a ser ignorado na verificação (útil para updates)
     */
    constructor(table: string, column?: string | undefined, ignoreId?: number | string | undefined);
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
