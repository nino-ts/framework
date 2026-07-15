/**
 * Regra para validação condicional: ausente se campo for valor.
 *
 * @packageDocumentation
 * Torna o campo ausente obrigatório quando outro campo tem um valor específico.
 */
import type { RuleResult, StandardSchemaRule, ValidationContext } from "../../contracts/StandardSchemaRule";
/**
 * Regra para validar ausência condicional baseado em outro campo.
 *
 * @example
 * // Campo deve estar ausente se status for 'inactive'
 * const rule = new MissingIfRule('status', 'inactive');
 */
export declare class MissingIfRule implements StandardSchemaRule<unknown> {
    private readonly field;
    private readonly value;
    /**
     * Nome da regra.
     */
    readonly name = "missing_if";
    /**
     * Cria uma nova instância da regra MissingIfRule.
     *
     * @param field - Nome do campo para verificar
     * @param value - Valor que dispara a ausência
     */
    constructor(field: string, value: unknown);
    /**
     * Executa a validação da regra.
     *
     * @param context - Contexto contendo o valor e metadados da validação
     * @returns Resultado da validação
     */
    validate(context: ValidationContext<unknown>): RuleResult;
}
