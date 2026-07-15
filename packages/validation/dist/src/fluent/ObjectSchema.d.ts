/**
 * Schema fluente para validação de objetos.
 *
 * @packageDocumentation
 * Fornece uma API fluente type-safe para validação de objetos
 * com suporte a shape aninhado e type inference.
 */
import type { StandardSchemaV1 } from "../types";
import { BaseSchema } from "./BaseSchema";
/**
 * Mapeamento de shape de objeto para tipos de input.
 * Extrai o tipo de entrada de cada schema no shape.
 *
 * @template T - Shape do objeto com schemas
 */
export type InferObjectInput<T extends Record<string, StandardSchemaV1<unknown, unknown>>> = {
    [K in keyof T]: T[K] extends StandardSchemaV1<infer Input, unknown> ? Input : never;
};
/**
 * Mapeamento de shape de objeto para tipos de output.
 * Extrai o tipo de saída de cada schema no shape.
 *
 * @template T - Shape do objeto com schemas
 */
export type InferObjectOutput<T extends Record<string, StandardSchemaV1<unknown, unknown>>> = {
    [K in keyof T]: T[K] extends StandardSchemaV1<unknown, infer Output> ? Output : never;
};
/**
 * Schema fluente para validação de objetos.
 *
 * @template T - Shape do objeto com schemas para cada propriedade
 * @example
 * const userSchema = v.object({
 *     name: v.string().required(),
 *     email: v.string().email(),
 *     age: v.number().min(0).optional(),
 * });
 *
 * const result = userSchema.validate({ name: 'John', email: 'john@example.com' });
 * // { success: true, value: { name: 'John', email: 'john@example.com' } }
 *
 * @example
 * const nestedSchema = v.object({
 *     user: v.object({
 *         name: v.string().required(),
 *     }),
 * });
 */
export declare class ObjectSchema<T extends Record<string, StandardSchemaV1<unknown, unknown>> = Record<string, StandardSchemaV1<unknown, unknown>>> extends BaseSchema<Record<string, unknown>, InferObjectOutput<T>> {
    /**
     * Shape do objeto com schemas para cada propriedade.
     */
    private readonly shape;
    /**
     * Cria uma nova instância de ObjectSchema.
     *
     * @param shape - Shape definindo schemas para cada propriedade do objeto
     */
    constructor(shape: T);
    /**
     * Habilita modo estrito que rejeita chaves extras não definidas no shape.
     *
     * @returns Este schema para chaining
     * @example
     * v.object({ name: v.string() }).strict()
     */
    strict(): this;
    /**
     * Permite chaves extras não definidas no shape (comportamento padrão).
     *
     * @returns Este schema para chaining
     * @example
     * v.object({ name: v.string() }).passthrough()
     */
    passthrough(): this;
    /**
     * Valida o número mínimo de chaves no objeto.
     *
     * @param count - Número mínimo de chaves
     * @returns Este schema para chaining
     * @example
     * v.object({}).minKeys(2)
     */
    minKeys(count: number): this;
    /**
     * Valida o número máximo de chaves no objeto.
     *
     * @param count - Número máximo de chaves
     * @returns Este schema para chaining
     * @example
     * v.object({}).maxKeys(5)
     */
    maxKeys(count: number): this;
    /**
     * Estende o shape com propriedades adicionais.
     *
     * @template U - Shape adicional a ser merged
     * @param shape - Novo shape com propriedades adicionais
     * @returns Novo ObjectSchema com shape estendido
     * @example
     * const baseSchema = v.object({ name: v.string() });
     * const extendedSchema = baseSchema.extend({ age: v.number() });
     */
    extend<U extends Record<string, StandardSchemaV1<unknown, unknown>>>(shape: U): ObjectSchema<T & U>;
    /**
     * Cria um novo schema omitindo propriedades específicas.
     *
     * @template K - Chaves a serem omitidas
     * @param keys - Array de chaves para omitir
     * @returns Novo ObjectSchema sem as propriedades omitidas
     * @example
     * const userSchema = v.object({ name: v.string(), password: v.string() });
     * const publicSchema = userSchema.omit(['password']);
     */
    omit<K extends keyof T>(keys: readonly K[]): ObjectSchema<Omit<T, K>>;
    /**
     * Cria um novo schema incluindo apenas propriedades específicas.
     *
     * @template K - Chaves a serem incluídas
     * @param keys - Array de chaves para incluir
     * @returns Novo ObjectSchema apenas com as propriedades incluídas
     * @example
     * const userSchema = v.object({ name: v.string(), email: v.string(), age: v.number() });
     * const nameOnlySchema = userSchema.pick(['name', 'email']);
     */
    pick<K extends keyof T>(keys: readonly K[]): ObjectSchema<Pick<T, K>>;
    /**
     * Torna todas as propriedades do shape opcionais.
     *
     * @returns Novo ObjectSchema com todas as propriedades opcionais
     * @example
     * const requiredSchema = v.object({ name: v.string().required() });
     * const optionalSchema = requiredSchema.partial();
     */
    partial(): ObjectSchema<{
        [K in keyof T]: T[K] extends StandardSchemaV1<infer Input, infer Output> ? StandardSchemaV1<Input | undefined, Output> : T[K];
    }>;
    /**
     * Retorna o shape atual do schema.
     *
     * @returns O shape definido para este schema
     */
    getShape(): T;
}
