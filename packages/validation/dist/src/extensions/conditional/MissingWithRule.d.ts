/**
 * Regra para validação condicional: ausente se campo estiver presente.
 *
 * @packageDocumentation
 * Torna o campo ausente obrigatório quando outro campo está presente.
 */
import type { RuleResult, StandardSchemaRule, ValidationContext } from "../../contracts/StandardSchemaRule";
/**
 * Regra para validar ausência condicional baseado na presença de outro campo.
 *
 * @example
 * // Campo deve estar ausente se credit_card estiver presente
 * const rule = new MissingWithRule('credit_card');
 */
export declare class MissingWithRule implements StandardSchemaRule<unknown> {
    private readonly field;
    /**
     * Nome da regra.
     */
    readonly name = "missing_with";
    /**
     * Cria uma nova instância da regra MissingWithRule.
     *
     * @param field - Nome do campo para verificar presença
     */
    constructor(field: string);
    /**
     * Executa a validação da regra.
     *
     * @param context - Contexto contendo o valor e metadados da validação
     * @returns Resultado da validação
     */
    validate(context: ValidationContext<unknown>): RuleResult;
}
