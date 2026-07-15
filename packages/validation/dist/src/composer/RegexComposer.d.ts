/**
 * Composer para regras baseadas em regex.
 *
 * @packageDocumentation
 * Fornece funções utilitárias para criar regras de validação baseadas em expressões regulares.
 */
import type { RuleResult, StandardSchemaRule, ValidationContext } from "../contracts/StandardSchemaRule";
/**
 * Regra para validar dígitos entre um intervalo.
 *
 * @example
 * const rule = new DigitsBetweenRule(3, 6);
 */
export declare class DigitsBetweenRule implements StandardSchemaRule<string | number> {
    private readonly min;
    private readonly max;
    readonly name = "digits_between";
    constructor(min: number, max: number);
    validate(context: ValidationContext<string | number>): RuleResult;
}
/**
 * Regra para validar máximo de dígitos.
 *
 * @example
 * const rule = new MaxDigitsRule(10);
 */
export declare class MaxDigitsRule implements StandardSchemaRule<string | number> {
    private readonly max;
    readonly name = "max_digits";
    constructor(max: number);
    validate(context: ValidationContext<string | number>): RuleResult;
}
/**
 * Regra para validar mínimo de dígitos.
 *
 * @example
 * const rule = new MinDigitsRule(3);
 */
export declare class MinDigitsRule implements StandardSchemaRule<string | number> {
    private readonly min;
    readonly name = "min_digits";
    constructor(min: number);
    validate(context: ValidationContext<string | number>): RuleResult;
}
/**
 * Regra para validar se não começa com valores específicos.
 *
 * @example
 * const rule = new DoesntStartWithRule('http://', 'https://');
 */
export declare class DoesntStartWithRule implements StandardSchemaRule<string> {
    private readonly values;
    readonly name = "doesnt_start_with";
    constructor(values: string[]);
    validate(context: ValidationContext<string>): RuleResult;
}
/**
 * Regra para validar se não termina com valores específicos.
 *
 * @example
 * const rule = new DoesntEndWithRule('.exe', '.bat');
 */
export declare class DoesntEndWithRule implements StandardSchemaRule<string> {
    private readonly values;
    readonly name = "doesnt_end_with";
    constructor(values: string[]);
    validate(context: ValidationContext<string>): RuleResult;
}
/**
 * Regra para validar se não corresponde a um padrão regex.
 *
 * @example
 * const rule = new NotRegexRule(/^[0-9]+$/);
 */
export declare class NotRegexRule implements StandardSchemaRule<string> {
    private readonly pattern;
    readonly name = "not_regex";
    constructor(pattern: RegExp);
    validate(context: ValidationContext<string>): RuleResult;
}
