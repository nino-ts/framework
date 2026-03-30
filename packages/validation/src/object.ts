/**
 * Função utilitária para criação de schemas de objeto.
 *
 * @packageDocumentation
 * Fornece uma função standalone para criação de ObjectSchema.
 * Esta é uma alternativa ao uso de v.object() para quem prefere imports nomeados.
 */

import { ObjectSchema } from './fluent/ObjectSchema';
import type { StandardSchemaV1 } from './types';

/**
 * Cria um schema para validação de objetos.
 *
 * @template T - Shape do objeto com schemas para cada propriedade
 * @param shape - Objeto definindo schemas para cada propriedade
 * @returns ObjectSchema para validação do objeto
 * @example
 * // Uso básico
 * const userSchema = object({
 *     name: v.string().required(),
 *     email: v.string().email(),
 *     age: v.number().min(0).optional(),
 * });
 *
 * @example
 * // Objetos aninhados
 * const postSchema = object({
 *     author: object({
 *         name: v.string().required(),
 *         bio: v.string().optional(),
 *     }),
 *     content: v.string().required(),
 * });
 *
 * @example
 * // Com type inference
 * type UserInput = InferInput<typeof userSchema>;
 * type UserOutput = InferOutput<typeof userSchema>;
 */
export function object<T extends Record<string, StandardSchemaV1>>(shape: T): ObjectSchema<T> {
  return new ObjectSchema(shape);
}

/**
 * Alias para a função object().
 *
 * @template T - Shape do objeto com schemas para cada propriedade
 * @param shape - Objeto definindo schemas para cada propriedade
 * @returns ObjectSchema para validação do objeto
 * @example
 * const schema = obj({ name: v.string().required() });
 */
export function obj<T extends Record<string, StandardSchemaV1>>(shape: T): ObjectSchema<T> {
  return new ObjectSchema(shape);
}
