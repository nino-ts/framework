/**
 * Regra para validação condicional: ausente se todos os campos estiverem presentes.
 *
 * @packageDocumentation
 * Torna o campo ausente obrigatório quando todos os campos especificados estão presentes.
 */
import type { RuleResult, StandardSchemaRule, ValidationContext } from "../../contracts/StandardSchemaRule";
/**
 * Regra para validar ausência condicional baseado na presença de múltiplos campos.
 *
 * @example
 * // Campo deve estar ausente se todos os campos estiverem presentes
 * const rule = new MissingWithAllRule('field1', 'field2', 'field3');
 */
export declare class MissingWithAllRule implements StandardSchemaRule<unknown> {
    private readonly fields;
    /**
     * Nome da regra.
     */
    readonly name = "missing_with_all";
    /**
     * Cria uma nova instância da regra MissingWithAllRule.
     *
     * @param fields - Nomes dos campos para verificar presença
     */
    constructor(fields: string[]);
    /**
     * Executa a validação da regra.
     *
     * @param context - Contexto contendo o valor e metadados da validação
     * @returns Resultado da validação
     */
    validate(context: ValidationContext<unknown>): RuleResult;
}
