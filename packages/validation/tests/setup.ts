/**
 * Setup de Testes TDD para @ninots/validation.
 *
 * @packageDocumentation
 * Fornece helpers, factories e fixtures para testes unitários e de integração.
 * Este módulo é a base para desenvolvimento orientado a testes (TDD).
 */

import { describe, expect, test, beforeEach, afterEach, mock } from 'bun:test';
import type { StandardSchemaV1, StandardSchemaSuccessResult, StandardSchemaFailureResult } from '../src/types';
import type { StandardSchemaRule, ValidationContext, RuleResult } from '../src/contracts/StandardSchemaRule';

// ============================================
// Types de Teste
// ============================================

/**
 * Resultado esperado de um teste de validação.
 */
export interface TestValidationResult<T = unknown> {
  /**
   * Indica se a validação deve passar.
   */
  shouldPass: boolean;

  /**
   * Valor validado (se aplicável).
   */
  value?: T;

  /**
   * Issues esperadas (se validação deve falhar).
   */
  issues?: Array<{
    message?: string;
    code?: string;
  }>;
}

/**
 * Configuração para teste de regra.
 */
export interface RuleTestConfig<T = unknown> {
  /**
   * Nome descritivo do teste.
   */
  description: string;

  /**
   * Valor de entrada para validação.
   */
  input: T;

  /**
   * Dados contextuais (para regras cross-field).
   */
  data?: Record<string, unknown>;

  /**
   * Resultado esperado.
   */
  expected: TestValidationResult<T>;
}

/**
 * Configuração para teste de schema.
 */
export interface SchemaTestConfig<TInput = unknown, TOutput = TInput> {
  /**
   * Nome descritivo do teste.
   */
  description: string;

  /**
   * Valor de entrada para validação.
   */
  input: TInput;

  /**
   * Resultado esperado.
   */
  expected: {
    shouldPass: boolean;
    output?: TOutput;
    issueCount?: number;
    issueCodes?: string[];
  };
}

// ============================================
// Helpers de Validação
// ============================================

/**
 * Executa uma regra de validação e retorna o resultado.
 *
 * @template T - Tipo do valor sendo validado
 * @param rule - Regra a ser testada
 * @param value - Valor a ser validado
 * @param data - Dados contextuais (opcional)
 * @returns Resultado da validação
 *
 * @example
 * const rule = new RequiredRule();
 * const result = testRule(rule, 'value');
 * expect(result.success).toBe(true);
 */
export function testRule<T = unknown>(
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
 * Executa um schema de validação e retorna o resultado.
 *
 * @template T - Tipo do schema
 * @param schema - Schema a ser testado
 * @param value - Valor a ser validado
 * @returns Resultado da validação
 *
 * @example
 * const schema = v.string().required();
 * const result = testSchema(schema, 'value');
 * expect(result.success).toBe(true);
 */
export function testSchema<T extends StandardSchemaV1>(
  schema: T,
  value: T['~standard']['types'] extends { input: infer I } ? I : unknown,
): StandardSchemaSuccessResult<unknown> | StandardSchemaFailureResult<unknown> {
  const result = schema['~standard'].validate(value);
  return result;
}

/**
 * Asserta que uma validação passou.
 *
 * @template T - Tipo do valor
 * @param result - Resultado da validação
 * @param expectedValue - Valor esperado (opcional, para transformação)
 *
 * @example
 * const result = testSchema(schema, 'value');
 * assertValidationPass(result, 'transformed_value');
 */
export function assertValidationPass<T>(
  result: StandardSchemaSuccessResult<T> | StandardSchemaFailureResult<unknown>,
  expectedValue?: T,
): asserts result is StandardSchemaSuccessResult<T> {
  if (!result.success) {
    throw new Error(`Expected validation to pass, but got issues: ${JSON.stringify(result.issues)}`);
  }

  if (expectedValue !== undefined) {
    expect(result.value).toEqual(expectedValue);
  }
}

/**
 * Asserta que uma validação falhou.
 *
 * @template T - Tipo do valor
 * @param result - Resultado da validação
 * @param expectedIssueCount - Número esperado de issues (opcional)
 * @param expectedCodes - Códigos de erro esperados (opcional)
 *
 * @example
 * const result = testSchema(schema, null);
 * assertValidationFail(result, 1, ['required']);
 */
export function assertValidationFail(
  result: StandardSchemaSuccessResult<unknown> | StandardSchemaFailureResult<unknown>,
  expectedIssueCount?: number,
  expectedCodes?: string[],
): asserts result is StandardSchemaFailureResult<unknown> {
  if (result.success) {
    throw new Error('Expected validation to fail, but it passed');
  }

  if (expectedIssueCount !== undefined) {
    expect(result.issues.length).toBe(expectedIssueCount);
  }

  if (expectedCodes !== undefined) {
    const actualCodes = result.issues.map((issue) => issue.code);
    expect(actualCodes).toEqual(expect.arrayContaining(expectedCodes));
  }
}

// ============================================
// Factories de Regras
// ============================================

/**
 * Cria uma regra mock para testes.
 *
 * @template TInput - Tipo de entrada
 * @template TOutput - Tipo de saída
 * @param name - Nome da regra
 * @param shouldPass - Se a regra deve passar
 * @param message - Mensagem de erro (se falhar)
 * @returns Regra mock
 */
export function createMockRule<TInput = unknown, TOutput = TInput>(
  name: string,
  shouldPass: boolean = true,
  message?: string,
): StandardSchemaRule<TInput, TOutput> {
  return {
    name,
    validate: (): RuleResult => {
      if (shouldPass) {
        return { success: true };
      }
      return {
        success: false,
        message: message ?? 'Validation failed',
        code: 'mock_failure',
      };
    },
  };
}

/**
 * Cria uma regra mock com transformação.
 *
 * @template TInput - Tipo de entrada
 * @template TOutput - Tipo de saída
 * @param transformFn - Função de transformação
 * @returns Regra mock com transformação
 */
export function createMockTransformRule<TInput, TOutput>(
  transformFn: (value: TInput) => TOutput,
): StandardSchemaRule<TInput, TOutput> {
  return {
    name: 'mock_transform',
    validate: () => ({ success: true }),
    transform: transformFn,
  };
}

// ============================================
// Fixtures de Dados
// ============================================

/**
 * Fixtures de dados para testes de validação.
 */
export const fixtures = {
  /**
   * Emails válidos para testes.
   */
  validEmails: [
    'test@example.com',
    'user.name@domain.org',
    'admin+tag@subdomain.example.co.uk',
    'test123@test.io',
  ],

  /**
   * Emails inválidos para testes.
   */
  invalidEmails: [
    'invalid',
    'invalid@',
    '@example.com',
    'test@',
    '',
    'test @example.com',
  ],

  /**
   * UUIDs válidos para testes.
   */
  validUuids: [
    '550e8400-e29b-41d4-a716-446655440000',
    '123e4567-e89b-12d3-a456-426614174000',
    '00000000-0000-0000-0000-000000000000',
  ],

  /**
   * UUIDs inválidos para testes.
   */
  invalidUuids: [
    'not-a-uuid',
    '550e8400-e29b-41d4-a716',
    'invalid-uuid-format',
    '',
  ],

  /**
   * URLs válidas para testes.
   */
  validUrls: [
    'https://example.com',
    'http://localhost:3000',
    'https://subdomain.example.co.uk/path?query=value',
  ],

  /**
   * URLs inválidas para testes.
   */
  invalidUrls: [
    'not-a-url',
    'ftp://example.com',
    'example.com',
    '',
  ],

  /**
   * Números válidos para testes.
   */
  validNumbers: [0, 1, -1, 100, 3.14, Number.MAX_SAFE_INTEGER],

  /**
   * Números inválidos para testes.
   */
  invalidNumbers: [NaN, Infinity, -Infinity, 'not-a-number', null, undefined],

  /**
   * Strings válidas para testes.
   */
  validStrings: ['hello', 'world', 'test123', ''],

  /**
   * Strings inválidas para testes (não-string).
   */
  invalidStrings: [123, true, {}, [], null, undefined],

  /**
   * Arrays válidos para testes.
   */
  validArrays: [[], [1, 2, 3], ['a', 'b'], [null, undefined]],

  /**
   * Arrays inválidos para testes (não-array).
   */
  invalidArrays: ['not-array', 123, {}, null, undefined],

  /**
   * Booleans válidos para testes.
   */
  validBooleans: [true, false],

  /**
   * Booleans inválidos para testes (não-boolean).
   */
  invalidBooleans: [1, 0, 'true', 'false', {}, [], null, undefined],

  /**
   * Datas válidas para testes.
   */
  validDates: [
    new Date(),
    '2024-01-01',
    '2024-12-31',
    '2024-06-15T10:30:00Z',
  ],

  /**
   * Datas inválidas para testes.
   */
  invalidDates: [
    'not-a-date',
    '2024-13-01',
    '2024-02-30',
    '',
  ],

  /**
   * Usuário válido para testes.
   */
  validUser: {
    name: 'John Doe',
    email: 'john@example.com',
    age: 30,
    active: true,
  },

  /**
   * Usuário inválido para testes.
   */
  invalidUser: {
    name: '',
    email: 'invalid-email',
    age: -5,
    active: 'not-boolean',
  },
};

// ============================================
// Helpers de Teste em Lote
// ============================================

/**
 * Executa múltiplos testes de regra em lote.
 *
 * @template T - Tipo do valor
 * @param rule - Regra a ser testada
 * @param testCases - Array de casos de teste
 *
 * @example
 * runRuleTests(rule, [
 *   { description: 'should pass with valid value', input: 'valid', expected: { shouldPass: true } },
 *   { description: 'should fail with invalid value', input: 'invalid', expected: { shouldPass: false } },
 * ]);
 */
export function runRuleTests<T = unknown>(
  rule: StandardSchemaRule<T>,
  testCases: RuleTestConfig<T>[],
): void {
  testCases.forEach(({ description, input, data = {}, expected }) => {
    test(description, () => {
      const result = testRule(rule, input, data);

      if (expected.shouldPass) {
        expect(result.success).toBe(true);
      } else {
        expect(result.success).toBe(false);
        if (expected.issues) {
          expected.issues.forEach((expectedIssue) => {
            if (expectedIssue.message) {
              expect(result.message).toContain(expectedIssue.message);
            }
            if (expectedIssue.code) {
              expect(result.code).toBe(expectedIssue.code);
            }
          });
        }
      }
    });
  });
}

/**
 * Executa múltiplos testes de schema em lote.
 *
 * @template T - Tipo do schema
 * @param schema - Schema a ser testado
 * @param testCases - Array de casos de teste
 *
 * @example
 * runSchemaTests(schema, [
 *   { description: 'should pass', input: 'valid', expected: { shouldPass: true } },
 *   { description: 'should fail', input: 'invalid', expected: { shouldPass: false, issueCount: 1 } },
 * ]);
 */
export function runSchemaTests<T extends StandardSchemaV1>(
  schema: T,
  testCases: SchemaTestConfig<
    T['~standard']['types'] extends { input: infer I } ? I : unknown,
    T['~standard']['types'] extends { output: infer O } ? O : unknown
  >[],
): void {
  testCases.forEach(({ description, input, expected }) => {
    test(description, () => {
      const result = testSchema(schema, input);

      if (expected.shouldPass) {
        assertValidationPass(result, expected.output);
      } else {
        assertValidationFail(result, expected.issueCount, expected.issueCodes);
      }
    });
  });
}

// ============================================
// Mocks de Dependências Externas
// ============================================

/**
 * Mock de repositório de database para testes.
 */
export interface MockDatabaseRepository {
  /**
   * Simula existência de registro.
   */
  exists: (table: string, column: string, value: unknown) => Promise<boolean>;

  /**
   * Simula contagem de registros.
   */
  count: (table: string, column: string, value: unknown, ignoreId?: string | number) => Promise<number>;

  /**
   * Simula busca de registro.
   */
  find: (table: string, column: string, value: unknown) => Promise<Record<string, unknown> | null>;
}

/**
 * Cria um mock de repositório de database.
 *
 * @param config - Configuração do mock
 * @returns Repositório mock
 */
export function createMockDatabaseRepository(config: {
  exists?: boolean;
  count?: number;
  record?: Record<string, unknown> | null;
}): MockDatabaseRepository {
  return {
    exists: async () => config.exists ?? false,
    count: async () => config.count ?? 0,
    find: async () => config.record ?? null,
  };
}

/**
 * Mock de serviço de autenticação para testes.
 */
export interface MockAuthService {
  /**
   * Verifica senha atual.
   */
  verifyPassword: (password: string) => Promise<boolean>;

  /**
   * Obtém usuário atual.
   */
  getCurrentUser: () => Promise<Record<string, unknown> | null>;
}

/**
 * Cria um mock de serviço de autenticação.
 *
 * @param config - Configuração do mock
 * @returns Serviço mock
 */
export function createMockAuthService(config: {
  passwordValid?: boolean;
  user?: Record<string, unknown> | null;
}): MockAuthService {
  return {
    verifyPassword: async () => config.passwordValid ?? false,
    getCurrentUser: async () => config.user ?? null,
  };
}

// ============================================
// Helpers de Performance
// ============================================

/**
 * Mede o tempo de execução de uma função.
 *
 * @param fn - Função a ser medida
 * @returns Tempo em milissegundos e resultado da função
 *
 * @example
 * const { time, result } = benchmark(() => schema.validate(data));
 * console.log(`Validation took ${time}ms`);
 */
export function benchmark<T>(fn: () => T): { time: number; result: T } {
  const start = performance.now();
  const result = fn();
  const end = performance.now();
  return {
    time: end - start,
    result,
  };
}

/**
 * Executa benchmark múltiplas vezes e retorna estatísticas.
 *
 * @param fn - Função a ser medida
 * @param iterations - Número de iterações
 * @returns Estatísticas de performance
 *
 * @example
 * const stats = benchmarkIterations(() => schema.validate(data), 1000);
 * console.log(`Average: ${stats.average}ms, Min: ${stats.min}ms, Max: ${stats.max}ms`);
 */
export function benchmarkIterations<T>(fn: () => T, iterations: number = 1000): {
  average: number;
  min: number;
  max: number;
  total: number;
  results: T[];
} {
  const times: number[] = [];
  const results: T[] = [];

  for (let i = 0; i < iterations; i++) {
    const { time, result } = benchmark(fn);
    times.push(time);
    results.push(result);
  }

  const total = times.reduce((a, b) => a + b, 0);
  const average = total / iterations;
  const min = Math.min(...times);
  const max = Math.max(...times);

  return { average, min, max, total, results };
}

// ============================================
// Export para Compatibilidade
// ============================================

/**
 * Valida configuração do pacote (para compatibilidade com testes existentes).
 * @returns Sempre true
 */
export function validatePackageConfig(): boolean {
  return true;
}

// ============================================
// Helpers de i18n para Testes
// ============================================

/**
 * Configura locale para testes de i18n.
 *
 * @param locale - Locale a ser usado
 */
export function setTestLocale(locale: 'en' | 'pt-BR' | 'es'): void {
  // Mock implementation para testes
}

/**
 * Traduz mensagem para testes.
 *
 * @param code - Código da mensagem
 * @param locale - Locale
 * @returns Mensagem traduzida
 */
export function translateTest(code: string, locale: string = 'en'): string {
  const messages: Record<string, Record<string, string>> = {
    en: {
      required: 'The field is required.',
      email: 'The field must be a valid email address.',
    },
    'pt-BR': {
      required: 'O campo é obrigatório.',
      email: 'O campo deve ser um email válido.',
    },
    es: {
      required: 'El campo es obligatorio.',
      email: 'El campo debe ser un correo válido.',
    },
  };

  return messages[locale]?.[code] ?? messages.en[code] ?? 'Validation failed';
}

// ============================================
// Helpers de Database para Testes
// ============================================

/**
 * Configura mock de database para testes.
 *
 * @param config - Configuração do mock
 */
export function setupDatabaseMock(config: {
  exists?: boolean;
  count?: number;
  record?: Record<string, unknown> | null;
}): void {
  // Mock implementation para testes
}

/**
 * Limpa mock de database após testes.
 */
export function cleanupDatabaseMock(): void {
  // Cleanup para testes
}
