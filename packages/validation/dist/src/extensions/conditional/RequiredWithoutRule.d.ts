/**
 * Regra para validação condicional: required se campo estiver ausente.
 *
 * @packageDocumentation
 * Torna o campo obrigatório apenas quando outro campo NÃO está presente nos dados.
 */
import type { RuleResult, StandardSchemaRule, ValidationContext } from "../../contracts/StandardSchemaRule";
/**
 * Regra para validar required condicional baseado na ausência de outro campo.
 *
 * @example
 * // Campo é required se phone não estiver presente
 * const rule = new RequiredWithoutRule('phone');
 */
export declare class RequiredWithoutRule implements StandardSchemaRule<unknown> {
    private readonly field;
    /**
     * Nome da regra.
     */
    readonly name = "required_without";
    /**
     * Cria uma nova instância da regra RequiredWithoutRule.
     *
     * @param field - Nome do campo para verificar ausência
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
