/**
 * Regra para validação condicional: required a menos que campo seja valor.
 *
 * @packageDocumentation
 * Torna o campo obrigatório apenas quando outro campo NÃO tem um valor específico.
 */
import type { RuleResult, StandardSchemaRule, ValidationContext } from "../../contracts/StandardSchemaRule";
/**
 * Regra para validar required condicional baseado em outro campo.
 *
 * @example
 * // Campo é required a menos que status seja 'inactive'
 * const rule = new RequiredUnlessRule('status', 'inactive');
 */
export declare class RequiredUnlessRule implements StandardSchemaRule<unknown> {
    private readonly field;
    private readonly value;
    /**
     * Nome da regra.
     */
    readonly name = "required_unless";
    /**
     * Cria uma nova instância da regra RequiredUnlessRule.
     *
     * @param field - Nome do campo para verificar
     * @param value - Valor que dispensa o required
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
