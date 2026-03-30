/**
 * Helpers de Assertão para Testes.
 *
 * @packageDocumentation
 * Funções auxiliares para assertões comuns em testes de validação.
 */

import { expect } from 'bun:test';
import type {
  StandardSchemaV1,
  StandardSchemaSuccessResult,
  StandardSchemaFailureResult,
  StandardSchemaIssue,
} from '../../src/types';

/**
 * Asserta que uma validação passou com sucesso.
 *
 * @template T - Tipo do valor validado
 * @param result - Resultado da validação
 * @param expectedValue - Valor esperado após transformação (opcional)
 *
 * @example
 * const result = schema.validate('value');
 * assertPass(result);
 * assertPass(result, 'transformed_value');
 */
export function assertPass<T>(
  result: StandardSchemaSuccessResult<T> | StandardSchemaFailureResult<unknown>,
  expectedValue?: T,
): asserts result is StandardSchemaSuccessResult<T> {
  if (!result.success) {
    const issues = (result as StandardSchemaFailureResult<unknown>).issues;
    throw new Error(`Expected validation to pass, but got issues: ${JSON.stringify(issues)}`);
  }

  if (expectedValue !== undefined) {
    expect(result.value).toEqual(expectedValue);
  }
}

/**
 * Asserta que uma validação falhou.
 *
 * @template T - Tipo do valor original
 * @param result - Resultado da validação
 * @param expectedIssueCount - Número esperado de issues (opcional)
 * @param expectedCodes - Códigos de erro esperados (opcional)
 *
 * @example
 * const result = schema.validate(null);
 * assertFail(result);
 * assertFail(result, 1, ['required']);
 */
export function assertFail(
  result: StandardSchemaSuccessResult<unknown> | StandardSchemaFailureResult<unknown>,
  expectedIssueCount?: number,
  expectedCodes?: string[],
): asserts result is StandardSchemaFailureResult<unknown> {
  if (result.success) {
    throw new Error('Expected validation to fail, but it passed');
  }

  const failResult = result as StandardSchemaFailureResult<unknown>;

  if (expectedIssueCount !== undefined) {
    expect(failResult.issues.length).toBe(expectedIssueCount);
  }

  if (expectedCodes !== undefined) {
    const actualCodes = failResult.issues.map((issue) => issue.code);
    expect(actualCodes).toEqual(expect.arrayContaining(expectedCodes));
  }
}

/**
 * Asserta que uma validação falhou com uma mensagem específica.
 *
 * @param result - Resultado da validação
 * @param expectedMessage - Mensagem esperada (ou parte dela)
 *
 * @example
 * const result = schema.validate('');
 * assertFailWithMessage(result, 'required');
 */
export function assertFailWithMessage(
  result: StandardSchemaSuccessResult<unknown> | StandardSchemaFailureResult<unknown>,
  expectedMessage: string,
): asserts result is StandardSchemaFailureResult<unknown> {
  if (result.success) {
    throw new Error('Expected validation to fail, but it passed');
  }

  const failResult = result as StandardSchemaFailureResult<unknown>;
  const messages = failResult.issues.map((issue) => issue.message);

  const found = messages.some((msg) => msg.toLowerCase().includes(expectedMessage.toLowerCase()));

  if (!found) {
    throw new Error(
      `Expected message to contain "${expectedMessage}", but got: ${JSON.stringify(messages)}`,
    );
  }
}

/**
 * Asserta que uma validação falhou com código específico.
 *
 * @param result - Resultado da validação
 * @param expectedCode - Código de erro esperado
 *
 * @example
 * const result = schema.validate(null);
 * assertFailWithCode(result, 'required');
 */
export function assertFailWithCode(
  result: StandardSchemaSuccessResult<unknown> | StandardSchemaFailureResult<unknown>,
  expectedCode: string,
): asserts result is StandardSchemaFailureResult<unknown> {
  if (result.success) {
    throw new Error('Expected validation to fail, but it passed');
  }

  const failResult = result as StandardSchemaFailureResult<unknown>;
  const codes = failResult.issues.map((issue) => issue.code);

  if (!codes.includes(expectedCode)) {
    throw new Error(
      `Expected code "${expectedCode}", but got: ${JSON.stringify(codes)}`,
    );
  }
}

/**
 * Asserta que uma validação falhou em um caminho específico.
 *
 * @param result - Resultado da validação
 * @param expectedPath - Caminho esperado
 *
 * @example
 * const result = schema.validate({ user: { email: 'invalid' } });
 * assertFailAtPath(result, ['user', 'email']);
 */
export function assertFailAtPath(
  result: StandardSchemaSuccessResult<unknown> | StandardSchemaFailureResult<unknown>,
  expectedPath: (string | number)[],
): asserts result is StandardSchemaFailureResult<unknown> {
  if (result.success) {
    throw new Error('Expected validation to fail, but it passed');
  }

  const failResult = result as StandardSchemaFailureResult<unknown>;
  const paths = failResult.issues.map((issue) => issue.path);

  const found = paths.some((path) => {
    if (!path) return false;
    return JSON.stringify(path) === JSON.stringify(expectedPath);
  });

  if (!found) {
    throw new Error(
      `Expected path ${JSON.stringify(expectedPath)}, but got: ${JSON.stringify(paths)}`,
    );
  }
}

/**
 * Asserta que um valor é do tipo esperado.
 *
 * @template T - Tipo esperado
 * @param value - Valor a verificar
 * @param expectedType - Tipo esperado
 *
 * @example
 * assertType(value, 'string');
 * assertType(value, 'number');
 */
export function assertType<T>(value: unknown, expectedType: string): asserts value is T {
  const actualType = typeof value;

  if (actualType !== expectedType) {
    throw new Error(`Expected type "${expectedType}", but got "${actualType}"`);
  }
}

/**
 * Asserta que um array tem tamanho específico.
 *
 * @param array - Array a verificar
 * @param expectedLength - Tamanho esperado
 *
 * @example
 * assertArrayLength(items, 3);
 */
export function assertArrayLength<T>(array: T[], expectedLength: number): void {
  if (!Array.isArray(array)) {
    throw new Error(`Expected array, but got ${typeof array}`);
  }

  if (array.length !== expectedLength) {
    throw new Error(`Expected array length ${expectedLength}, but got ${array.length}`);
  }
}

/**
 * Asserta que um objeto tem chaves específicas.
 *
 * @param obj - Objeto a verificar
 * @param expectedKeys - Chaves esperadas
 *
 * @example
 * assertHasKeys(user, ['name', 'email']);
 */
export function assertHasKeys<T extends Record<string, unknown>>(
  obj: T,
  expectedKeys: string[],
): void {
  if (typeof obj !== 'object' || obj === null) {
    throw new Error(`Expected object, but got ${typeof obj}`);
  }

  const actualKeys = Object.keys(obj);
  const missingKeys = expectedKeys.filter((key) => !actualKeys.includes(key));

  if (missingKeys.length > 0) {
    throw new Error(`Missing keys: ${JSON.stringify(missingKeys)}`);
  }
}

/**
 * Asserta que uma função lança um erro.
 *
 * @param fn - Função a executar
 * @param expectedMessage - Mensagem de erro esperada (opcional)
 *
 * @example
 * assertThrows(() => schema.validate(null));
 * assertThrows(() => invalidFn(), 'Expected error message');
 */
export function assertThrows(fn: () => void, expectedMessage?: string): void {
  try {
    fn();
    throw new Error('Expected function to throw, but it did not');
  } catch (error) {
    if (expectedMessage && error instanceof Error) {
      if (!error.message.toLowerCase().includes(expectedMessage.toLowerCase())) {
        throw new Error(
          `Expected error message to contain "${expectedMessage}", but got "${error.message}"`,
        );
      }
    }
  }
}

/**
 * Asserta que uma função não lança erro.
 *
 * @param fn - Função a executar
 *
 * @example
 * assertDoesNotThrow(() => schema.validate('valid'));
 */
export function assertDoesNotThrow(fn: () => void): void {
  try {
    fn();
  } catch (error) {
    throw new Error(`Expected function not to throw, but it threw: ${error}`);
  }
}

/**
 * Asserta que uma validação é type-safe.
 *
 * @template T - Tipo do schema
 * @param schema - Schema a testar
 * @param validValue - Valor que deve passar
 * @param invalidValue - Valor que deve falhar
 *
 * @example
 * assertTypeSafety(schema, 'valid', null);
 */
export function assertTypeSafety<T extends StandardSchemaV1>(
  schema: T,
  validValue: unknown,
  invalidValue: unknown,
): void {
  const validResult = schema['~standard'].validate(validValue);
  const invalidResult = schema['~standard'].validate(invalidValue);

  if (!validResult.success) {
    throw new Error(`Expected valid value to pass, but got: ${JSON.stringify(validResult.issues)}`);
  }

  if (invalidResult.success) {
    throw new Error('Expected invalid value to fail, but it passed');
  }
}
