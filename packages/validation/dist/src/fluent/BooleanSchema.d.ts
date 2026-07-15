/**
 * Schema fluente para validação de booleanos.
 *
 * @packageDocumentation
 * Fornece uma API fluente type-safe para validação de booleanos
 * com suporte a required, optional e nullable.
 */
import { BaseSchema } from "./BaseSchema";
/**
 * Schema fluente para validação de booleanos.
 *
 * @example
 * const schema = v.boolean().required();
 * const result = schema.validate(true);
 * // { success: true, value: true }
 *
 * @example
 * const schema = v.boolean().optional();
 * const result = schema.validate(undefined);
 * // { success: true, value: undefined }
 */
export declare class BooleanSchema extends BaseSchema<boolean, boolean> {
    /**
     * Cria uma nova instância de BooleanSchema.
     */
    constructor();
    /**
     * Valida se o valor é true.
     *
     * @returns Este schema para chaining
     * @example
     * v.boolean().true()
     */
    true(): this;
    /**
     * Valida se o valor é false.
     *
     * @returns Este schema para chaining
     * @example
     * v.boolean().false()
     */
    false(): this;
}
