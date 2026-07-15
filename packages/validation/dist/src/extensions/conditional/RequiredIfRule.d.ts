/**
 * Regra para validação condicional: required se campo for valor.
 *
 * @packageDocumentation
 * Torna o campo obrigatório apenas quando outro campo tem um valor específico.
 */
import type { RuleResult, StandardSchemaRule, ValidationContext } from "../../contracts/StandardSchemaRule";
/**
 * Regra para validar required condicional baseado em outro campo.
 *
 * @example
 * // Campo é required se payment_method for 'credit_card'
 * const rule = new RequiredIfRule('payment_method', 'credit_card');
 */
export declare class RequiredIfRule implements StandardSchemaRule<unknown> {
    private readonly field;
    private readonly value;
    /**
     * Nome da regra.
     */
    readonly name = "required_if";
    /**
     * Cria uma nova instância da regra RequiredIfRule.
     *
     * @param field - Nome do campo para verificar
     * @param value - Valor que dispara o required
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
