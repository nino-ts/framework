/**
 * Regra para validação condicional: proibido a menos que campo seja valor.
 *
 * @packageDocumentation
 * Torna o campo proibido quando outro campo NÃO tem um valor específico.
 */
import type { RuleResult, StandardSchemaRule, ValidationContext } from "../../contracts/StandardSchemaRule";
/**
 * Regra para validar campo proibido condicional baseado em outro campo.
 *
 * @example
 * // Campo é proibido a menos que status seja 'active'
 * const rule = new ProhibitedUnlessRule('status', 'active');
 */
export declare class ProhibitedUnlessRule implements StandardSchemaRule<unknown> {
    private readonly field;
    private readonly value;
    /**
     * Nome da regra.
     */
    readonly name = "prohibited_unless";
    /**
     * Cria uma nova instância da regra ProhibitedUnlessRule.
     *
     * @param field - Nome do campo para verificar
     * @param value - Valor que dispensa a proibição
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
