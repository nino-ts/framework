/**
 * Regra para validação condicional: ausente a menos que campo seja valor.
 *
 * @packageDocumentation
 * Torna o campo ausente obrigatório quando outro campo NÃO tem um valor específico.
 */
import type { RuleResult, StandardSchemaRule, ValidationContext } from "../../contracts/StandardSchemaRule";
/**
 * Regra para validar ausência condicional baseado em outro campo.
 *
 * @example
 * // Campo deve estar ausente a menos que status seja 'active'
 * const rule = new MissingUnlessRule('status', 'active');
 */
export declare class MissingUnlessRule implements StandardSchemaRule<unknown> {
    private readonly field;
    private readonly value;
    /**
     * Nome da regra.
     */
    readonly name = "missing_unless";
    /**
     * Cria uma nova instância da regra MissingUnlessRule.
     *
     * @param field - Nome do campo para verificar
     * @param value - Valor que dispensa a ausência
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
