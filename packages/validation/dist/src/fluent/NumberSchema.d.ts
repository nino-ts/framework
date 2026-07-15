/**
 * Schema fluente para validação de números.
 *
 * @packageDocumentation
 * Fornece uma API fluente type-safe para validação de números
 * com suporte a min, max, positive, negative, integer e mais.
 */
import { BaseSchema } from "./BaseSchema";
/**
 * Schema fluente para validação de números.
 *
 * @example
 * const schema = v.number().required().min(0).max(100);
 * const result = schema.validate(50);
 * // { success: true, value: 50 }
 *
 * @example
 * const schema = v.number().positive().integer();
 * const result = schema.validate(42);
 * // { success: true, value: 42 }
 */
export declare class NumberSchema extends BaseSchema<number, number> {
    /**
     * Cria uma nova instância de NumberSchema.
     */
    constructor();
    /**
     * Valida o valor mínimo do número.
     *
     * @param value - Valor mínimo permitido
     * @returns Este schema para chaining
     * @example
     * v.number().min(0)
     */
    min(value: number): this;
    /**
     * Valida o valor máximo do número.
     *
     * @param value - Valor máximo permitido
     * @returns Este schema para chaining
     * @example
     * v.number().max(100)
     */
    max(value: number): this;
    /**
     * Valida se o número é positivo (> 0).
     *
     * @returns Este schema para chaining
     * @example
     * v.number().positive()
     */
    positive(): this;
    /**
     * Valida se o número é negativo (< 0).
     *
     * @returns Este schema para chaining
     * @example
     * v.number().negative()
     */
    negative(): this;
    /**
     * Valida se o número é inteiro (sem casas decimais).
     *
     * @returns Este schema para chaining
     * @example
     * v.number().integer()
     */
    integer(): this;
    /**
     * Valida se o número é igual a um valor específico.
     *
     * @param value - Valor esperado
     * @returns Este schema para chaining
     * @example
     * v.number().equal(42)
     */
    equal(value: number): this;
    /**
     * Valida se o número está dentro de um intervalo.
     *
     * @param min - Valor mínimo (inclusivo)
     * @param max - Valor máximo (inclusivo)
     * @returns Este schema para chaining
     * @example
     * v.number().range(1, 10)
     */
    range(min: number, max: number): this;
    /**
     * Valida se o número é múltiplo de um valor base.
     *
     * @param base - Valor base para múltiplo
     * @returns Este schema para chaining
     * @example
     * v.number().multipleOf(5)
     */
    multipleOf(base: number): this;
    /**
     * Valida se o número é finito (não Infinity ou -Infinity).
     *
     * @returns Este schema para chaining
     * @example
     * v.number().finite()
     */
    finite(): this;
    /**
     * Valida se o número é safe integer (dentro do limite do JavaScript).
     *
     * @returns Este schema para chaining
     * @example
     * v.number().safe()
     */
    safe(): this;
    /**
     * Valida se o número é safe integer (alias para safe()).
     *
     * @returns Este schema para chaining
     * @example
     * v.number().safeInteger()
     */
    safeInteger(): this;
}
