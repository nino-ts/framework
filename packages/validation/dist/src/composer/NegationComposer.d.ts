/**
 * Composer para regras de negação/composição.
 *
 * @packageDocumentation
 * Fornece funções utilitárias para criar regras de validação por negação ou composição.
 */
import type { RuleResult, StandardSchemaRule, ValidationContext } from "../contracts/StandardSchemaRule";
/**
 * Regra para validar se valor não está em uma lista.
 *
 * @example
 * const rule = new NotInRule(['admin', 'root']);
 */
export declare class NotInRule implements StandardSchemaRule<unknown> {
    private readonly values;
    readonly name = "not_in";
    constructor(values: unknown[]);
    validate(context: ValidationContext<unknown>): RuleResult;
    private valuesEqual;
}
/**
 * Regra para validar se valor é múltiplo de um divisor.
 *
 * @example
 * const rule = new MultipleOfRule(5);
 */
export declare class MultipleOfRule implements StandardSchemaRule<number> {
    private readonly divisor;
    readonly name = "multiple_of";
    constructor(divisor: number);
    validate(context: ValidationContext<number>): RuleResult;
}
/**
 * Regra para validar se campo não está vazio quando presente.
 *
 * @example
 * const rule = new FilledRule();
 */
export declare class FilledRule implements StandardSchemaRule<unknown> {
    readonly name = "filled";
    validate(context: ValidationContext<unknown>): RuleResult;
}
/**
 * Regra para validar se campo deve estar presente.
 *
 * @example
 * const rule = new PresentRule();
 */
export declare class PresentRule implements StandardSchemaRule<unknown> {
    readonly name = "present";
    validate(context: ValidationContext<unknown>): RuleResult;
}
/**
 * Regra para validar presença condicional: presente se campo for valor.
 *
 * @example
 * const rule = new PresentIfRule('status', 'active');
 */
export declare class PresentIfRule implements StandardSchemaRule<unknown> {
    private readonly field;
    private readonly value;
    readonly name = "present_if";
    constructor(field: string, value: unknown);
    validate(context: ValidationContext<unknown>): RuleResult;
}
/**
 * Regra para validar presença condicional: presente a menos que campo seja valor.
 *
 * @example
 * const rule = new PresentUnlessRule('status', 'inactive');
 */
export declare class PresentUnlessRule implements StandardSchemaRule<unknown> {
    private readonly field;
    private readonly value;
    readonly name = "present_unless";
    constructor(field: string, value: unknown);
    validate(context: ValidationContext<unknown>): RuleResult;
}
