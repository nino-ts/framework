/**
 * Regra para validação condicional: exclui se campo for valor.
 *
 * @packageDocumentation
 * Exclui o campo da validação quando outro campo tem um valor específico.
 * Diferente de prohibited, exclude remove o campo do dataset validado.
 */
import type { RuleResult, StandardSchemaRule, ValidationContext } from "../../contracts/StandardSchemaRule";
/**
 * Regra para validar exclusão condicional baseado em outro campo.
 *
 * @example
 * // Campo é excluído se type for 'guest'
 * const rule = new ExcludeIfRule('type', 'guest');
 */
export declare class ExcludeIfRule implements StandardSchemaRule<unknown> {
    private readonly field;
    private readonly value;
    /**
     * Nome da regra.
     */
    readonly name = "exclude_if";
    /**
     * Cria uma nova instância da regra ExcludeIfRule.
     *
     * @param field - Nome do campo para verificar
     * @param value - Valor que dispara a exclusão
     */
    constructor(field: string, value: unknown);
    /**
     * Executa a validação da regra.
     *
     * @param context - Contexto contendo o valor e metadados da validação
     * @returns Resultado da validação
     */
    validate(context: ValidationContext<unknown>): RuleResult;
    /**
     * Verifica se o campo deve ser excluído.
     *
     * @param data - Dados completos sendo validados
     * @returns True se o campo deve ser excluído
     */
    shouldExclude(data: Record<string, unknown>): boolean;
}
