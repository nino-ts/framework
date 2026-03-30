/**
 * Utilitários de Type Inference para Standard Schema.
 *
 * @packageDocumentation
 * Fornece helpers para inferência de tipos de input/output de schemas.
 * Estes utilitários permitem extrair tipos TypeScript de schemas validados.
 */

import type { StandardSchemaV1 } from './types';

/**
 * Extrai o tipo de entrada de um Standard Schema.
 *
 * @template T - Tipo do schema que estende StandardSchemaV1
 * @example
 * type UserInput = InferInput<typeof userSchema>
 * // Equivale ao tipo esperado pelo schema para validação
 */
export type InferInput<T extends StandardSchemaV1> = T extends StandardSchemaV1<infer Input, unknown> ? Input : never;

/**
 * Extrai o tipo de saída de um Standard Schema.
 *
 * @template T - Tipo do schema que estende StandardSchemaV1
 * @example
 * type UserOutput = InferOutput<typeof userSchema>
 * // Equivale ao tipo retornado após validação bem-sucedida
 * @remarks
 * O tipo de saída pode ser diferente do tipo de entrada se o schema
 * realizar transformações nos dados durante a validação.
 */
export type InferOutput<T extends StandardSchemaV1> =
  T extends StandardSchemaV1<unknown, infer Output> ? Output : never;

/**
 * Verifica se um valor é um Standard Schema válido.
 *
 * @param value - Valor a ser verificado
 * @returns True se o valor segue o contrato StandardSchemaV1
 * @example
 * if (isStandardSchema(maybeSchema)) {
 *     // TypeScript sabe que maybeSchema é StandardSchemaV1 aqui
 * }
 */
export function isStandardSchema(value: unknown): value is StandardSchemaV1 {
  if (typeof value !== 'object' || value === null) {
    return false;
  }

  const obj = value as Record<string, unknown>;

  if (!('~standard' in obj) || typeof obj['~standard'] !== 'object' || obj['~standard'] === null) {
    return false;
  }

  const standard = obj['~standard'] as Record<string, unknown>;

  return (
    typeof standard.vendor === 'string' &&
    typeof standard.version === 'string' &&
    typeof standard.validate === 'function'
  );
}
