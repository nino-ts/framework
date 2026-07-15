/**
 * Regra para validação condicional: required se campo estiver presente.
 *
 * @packageDocumentation
 * Torna o campo obrigatório apenas quando outro campo está presente nos dados.
 */
import type { RuleResult, StandardSchemaRule, ValidationContext } from "../../contracts/StandardSchemaRule";
/**
 * Regra para validar required condicional baseado na presença de outro campo.
 *
 * @example
 * // Campo é required se address estiver presente
 * const rule = new RequiredWithRule('address');
 */
export declare class RequiredWithRule implements StandardSchemaRule<unknown> {
    private readonly field;
    /**
     * Nome da regra.
     */
    readonly name = "required_with";
    /**
     * Cria uma nova instância da regra RequiredWithRule.
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
