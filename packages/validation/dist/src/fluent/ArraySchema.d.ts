/**
 * Schema fluente para validação de arrays.
 *
 * @packageDocumentation
 * Fornece uma API fluente type-safe para validação de arrays
 * com suporte a min, max, length e validação de itens.
 */
import type { StandardSchemaV1 } from "../types";
import { BaseSchema } from "./BaseSchema";
/**
 * Schema fluente para validação de arrays.
 *
 * @template T - Tipo dos itens do array
 * @example
 * const schema = v.array(v.string().required()).min(1);
 * const result = schema.validate(['hello', 'world']);
 * // { success: true, value: ['hello', 'world'] }
 *
 * @example
 * const schema = v.array(v.number().positive()).max(5);
 * const result = schema.validate([1, 2, 3]);
 * // { success: true, value: [1, 2, 3] }
 */
export declare class ArraySchema<T = unknown> extends BaseSchema<T[], T[]> {
    /**
     * Cria uma nova instância de ArraySchema.
     *
     * @param itemSchema - Schema opcional para validar cada item do array
     */
    constructor(itemSchema?: StandardSchemaV1<T>);
    /**
     * Valida o número mínimo de itens no array.
     *
     * @param count - Número mínimo de itens
     * @returns Este schema para chaining
     * @example
     * v.array().min(1)
     */
    min(count: number): this;
    /**
     * Valida o número máximo de itens no array.
     *
     * @param count - Número máximo de itens
     * @returns Este schema para chaining
     * @example
     * v.array().max(10)
     */
    max(count: number): this;
    /**
     * Valida o número exato de itens no array.
     *
     * @param count - Número exato de itens
     * @returns Este schema para chaining
     * @example
     * v.array().length(3)
     */
    length(count: number): this;
    /**
     * Valida se o array não está vazio.
     *
     * @returns Este schema para chaining
     * @example
     * v.array().nonEmpty()
     */
    nonEmpty(): this;
    /**
     * Valida cada item do array contra um schema.
     *
     * @param schema - Schema para validar cada item
     * @returns Novo ArraySchema com o schema de itens especificado
     * @example
     * v.array().items(v.string().email())
     */
    items<V>(schema: StandardSchemaV1<V>): ArraySchema<V>;
    /**
     * Valida se o array é vazio.
     *
     * @returns Este schema para chaining
     * @example
     * v.array().empty()
     */
    empty(): this;
    /**
     * Valida se o array contém um valor específico.
     *
     * @param value - Valor esperado
     * @returns Este schema para chaining
     * @example
     * v.array().includes('admin')
     */
    includes(value: T): this;
    /**
     * Remove itens duplicados do array (baseado em igualdade estrita).
     *
     * @returns Este schema para chaining
     * @example
     * v.array().unique()
     */
    unique(): this;
}
