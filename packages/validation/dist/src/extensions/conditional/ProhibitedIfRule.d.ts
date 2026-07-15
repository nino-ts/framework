/**
 * Regra para validação condicional: proibido se campo for valor.
 *
 * @packageDocumentation
 * Torna o campo proibido quando outro campo tem um valor específico.
 */
import type { RuleResult, StandardSchemaRule, ValidationContext } from "../../contracts/StandardSchemaRule";
/**
 * Regra para validar campo proibido condicional baseado em outro campo.
 *
 * @example
 * // Campo é proibido se status for 'inactive'
 * const rule = new ProhibitedIfRule('status', 'inactive');
 */
export declare class ProhibitedIfRule implements StandardSchemaRule<unknown> {
    private readonly field;
    private readonly value;
    /**
     * Nome da regra.
     */
    readonly name = "prohibited_if";
    /**
     * Cria uma nova instância da regra ProhibitedIfRule.
     *
     * @param field - Nome do campo para verificar
     * @param value - Valor que dispara a proibição
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
