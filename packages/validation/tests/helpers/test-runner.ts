/**
 * Helpers de Test Runner para Testes em Lote.
 *
 * @packageDocumentation
 * Funções auxiliares para executar testes de regras e schemas em lote.
 */

import { test, expect } from 'bun:test';
import type { StandardSchemaV1, StandardSchemaIssue } from '../../src/types';
import type { StandardSchemaRule, ValidationContext, RuleResult } from '../../src/contracts/StandardSchemaRule';

/**
 * Configuração para teste de regra individual.
 */
export interface RuleTestCase<T = unknown> {
  /**
   * Descrição do teste.
   */
  description: string;

  /**
   * Valor de entrada.
   */
  input: T;

  /**
   * Dados contextuais (para regras cross-field).
   */
  data?: Record<string, unknown>;

  /**
   * Se o teste deve passar.
   */
  shouldPass: boolean;

  /**
   * Código de erro esperado (se falhar).
   */
  expectedCode?: string;

  /**
   * Mensagem de erro esperada (se falhar).
   */
  expectedMessage?: string;
}

/**
 * Configuração para teste de schema individual.
 */
export interface SchemaTestCase<TInput = unknown, TOutput = TInput> {
  /**
   * Descrição do teste.
   */
  description: string;

  /**
   * Valor de entrada.
   */
  input: TInput;

  /**
   * Se o teste deve passar.
   */
  shouldPass: boolean;

  /**
   * Valor de saída esperado (se passar e houver transformação).
   */
  expectedOutput?: TOutput;

  /**
   * Número de issues esperadas (se falhar).
   */
  expectedIssueCount?: number;

  /**
   * Códigos de erro esperados (se falhar).
   */
  expectedCodes?: string[];
}

/**
 * Executa uma regra de validação.
 *
 * @template T - Tipo do valor
 * @param rule - Regra a testar
 * @param value - Valor a validar
 * @param data - Dados contextuais
 * @returns Resultado da validação
 */
export function runRule<T = unknown>(
  rule: StandardSchemaRule<T>,
  value: T,
  data: Record<string, unknown> = {},
): RuleResult {
  const context: ValidationContext<T> = {
    value,
    originalValue: value,
    path: [],
    data,
  };

  return rule.validate(context);
}

/**
 * Executa um schema de validação.
 *
 * @template T - Tipo do schema
 * @param schema - Schema a testar
 * @param value - Valor a validar
 * @returns Resultado da validação
 */
export function runSchema<T extends StandardSchemaV1>(
  schema: T,
  value: T['~standard']['types'] extends { input: infer I } ? I : unknown,
): { success: boolean; value?: unknown; issues?: StandardSchemaIssue[] } {
  return schema['~standard'].validate(value);
}

/**
 * Executa múltiplos testes de regra em lote.
 *
 * @template T - Tipo do valor
 * @param ruleName - Nome da regra para descrição dos testes
 * @param rule - Regra a testar
 * @param testCases - Array de casos de teste
 *
 * @example
 * runRuleTests('required', rule, [
 *   { description: 'should pass with value', input: 'test', shouldPass: true },
 *   { description: 'should fail without value', input: null, shouldPass: false, expectedCode: 'required' },
 * ]);
 */
export function runRuleTests<T = unknown>(
  ruleName: string,
  rule: StandardSchemaRule<T>,
  testCases: RuleTestCase<T>[],
): void {
  testCases.forEach(({ description, input, data = {}, shouldPass, expectedCode, expectedMessage }) => {
    test(`${ruleName}: ${description}`, () => {
      const result = runRule(rule, input, data);

      if (shouldPass) {
        expect(result.success).toBe(true);
      } else {
        expect(result.success).toBe(false);

        if (expectedCode) {
          expect(result.code).toBe(expectedCode);
        }

        if (expectedMessage) {
          expect(result.message).toContain(expectedMessage);
        }
      }
    });
  });
}

/**
 * Executa múltiplos testes de schema em lote.
 *
 * @template T - Tipo do schema
 * @param schemaName - Nome do schema para descrição dos testes
 * @param schema - Schema a testar
 * @param testCases - Array de casos de teste
 *
 * @example
 * runSchemaTests('email', schema, [
 *   { description: 'should pass with valid email', input: 'test@example.com', shouldPass: true },
 *   { description: 'should fail with invalid email', input: 'invalid', shouldPass: false, expectedCodes: ['email'] },
 * ]);
 */
export function runSchemaTests<T extends StandardSchemaV1>(
  schemaName: string,
  schema: T,
  testCases: SchemaTestCase<
    T['~standard']['types'] extends { input: infer I } ? I : unknown,
    T['~standard']['types'] extends { output: infer O } ? O : unknown
  >[],
): void {
  testCases.forEach(({
    description,
    input,
    shouldPass,
    expectedOutput,
    expectedIssueCount,
    expectedCodes,
  }) => {
    test(`${schemaName}: ${description}`, () => {
      const result = runSchema(schema, input);

      if (shouldPass) {
        if (!result.success) {
          throw new Error(`Expected validation to pass, but got issues: ${JSON.stringify(result.issues)}`);
        }

        if (expectedOutput !== undefined) {
          expect(result.value).toEqual(expectedOutput);
        }
      } else {
        if (result.success) {
          throw new Error('Expected validation to fail, but it passed');
        }

        if (expectedIssueCount !== undefined) {
          expect(result.issues?.length).toBe(expectedIssueCount);
        }

        if (expectedCodes !== undefined) {
          const actualCodes = result.issues?.map((issue) => issue.code) ?? [];
          expect(actualCodes).toEqual(expect.arrayContaining(expectedCodes));
        }
      }
    });
  });
}

/**
 * Executa testes de transformação.
 *
 * @template TInput - Tipo de entrada
 * @template TOutput - Tipo de saída
 * @param schemaName - Nome do schema
 * @param schema - Schema a testar
 * @param transformations - Array de testes de transformação
 *
 * @example
 * runTransformTests('string', schema, [
 *   { description: 'should trim', input: '  test  ', expected: 'test' },
 *   { description: 'should lowercase', input: 'TEST', expected: 'test' },
 * ]);
 */
export function runTransformTests<TInput = unknown, TOutput = TInput>(
  schemaName: string,
  schema: StandardSchemaV1<TInput, TOutput>,
  transformations: Array<{
    description: string;
    input: TInput;
    expected: TOutput;
  }>,
): void {
  transformations.forEach(({ description, input, expected }) => {
    test(`${schemaName}: transform - ${description}`, () => {
      const result = schema['~standard'].validate(input);

      if (!result.success) {
        throw new Error(`Transform failed: ${JSON.stringify(result.issues)}`);
      }

      expect(result.value).toEqual(expected);
    });
  });
}

/**
 * Executa testes de type inference.
 *
 * @template T - Tipo inferido
 * @param schemaName - Nome do schema
 * @param schema - Schema a testar
 * @param typeTests - Array de testes de tipo
 *
 * @example
 * runTypeInferenceTests('string', schema, [
 *   { description: 'should infer string', value: 'test', shouldPass: true },
 *   { description: 'should reject number', value: 123, shouldPass: false },
 * ]);
 */
export function runTypeInferenceTests<T extends StandardSchemaV1>(
  schemaName: string,
  schema: T,
  typeTests: Array<{
    description: string;
    value: unknown;
    shouldPass: boolean;
  }>,
): void {
  typeTests.forEach(({ description, value, shouldPass }) => {
    test(`${schemaName}: type inference - ${description}`, () => {
      const result = schema['~standard'].validate(value);

      if (shouldPass) {
        expect(result.success).toBe(true);
      } else {
        expect(result.success).toBe(false);
      }
    });
  });
}
