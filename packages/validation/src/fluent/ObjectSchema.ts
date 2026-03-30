/**
 * Schema fluente para validação de objetos.
 *
 * @packageDocumentation
 * Fornece uma API fluente type-safe para validação de objetos
 * com suporte a shape aninhado e type inference.
 */

import type { StandardSchemaIssue, StandardSchemaV1 } from '../types';
import type { StandardSchemaRule, ValidationContext, RuleResult } from '../contracts/StandardSchemaRule';
import { BaseSchema } from './BaseSchema';

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
 * Regra para validar se o valor é um objeto.
 */
class ObjectTypeRule implements StandardSchemaRule<unknown, Record<string, unknown>> {
  public readonly name = 'object_type';

  public validate(context: ValidationContext<unknown>): RuleResult {
    if (typeof context.value !== 'object' || context.value === null || Array.isArray(context.value)) {
      return {
        success: false,
        message: 'Expected an object',
        code: 'invalid_type',
      };
    }

    return { success: true };
  }

  public transform(value: unknown): Record<string, unknown> {
    return value as Record<string, unknown>;
  }
}

/**
 * Regra para validar shape de objeto contra schemas de propriedades.
 */
class ObjectShapeRule<T extends Record<string, StandardSchemaV1<unknown, unknown>>>
  implements StandardSchemaRule<Record<string, unknown>>
{
  public readonly name = 'object_shape';

  public constructor(private readonly shape: T) {}

  public validate(context: ValidationContext<Record<string, unknown>>): RuleResult {
    const value = context.value;
    const issues: StandardSchemaIssue[] = [];

    for (const [key, schema] of Object.entries(this.shape)) {
      const propValue = value[key];
      const result = schema['~standard'].validate(propValue);

      if ('success' in result && !result.success) {
        for (const issue of result.issues) {
          issues.push({
            message: issue.message,
            path: [key, ...(issue.path ?? [])],
            value: issue.value,
          });
        }
      }
    }

    if (issues.length > 0) {
      return {
        success: false,
        message: `Object has ${issues.length} invalid field(s)`,
        code: 'invalid_shape',
      };
    }

    return { success: true };
  }
}

/**
 * Regra para validar se o objeto tem chaves extras não permitidas.
 */
class StrictKeysRule implements StandardSchemaRule<Record<string, unknown>> {
  public readonly name = 'object_strict_keys';

  public constructor(private readonly allowedKeys: readonly string[]) {}

  public validate(context: ValidationContext<Record<string, unknown>>): RuleResult {
    const value = context.value;
    const actualKeys = Object.keys(value);
    const allowedKeysSet = new Set(this.allowedKeys);

    for (const key of actualKeys) {
      if (!allowedKeysSet.has(key)) {
        return {
          success: false,
          message: `Unknown key "${key}" is not allowed`,
          code: 'unknown_key',
        };
      }
    }

    return { success: true };
  }
}

/**
 * Regra para validar número mínimo de chaves no objeto.
 */
class MinKeysRule implements StandardSchemaRule<Record<string, unknown>> {
  public readonly name = 'object_min_keys';

  public constructor(private readonly minKeys: number) {}

  public validate(context: ValidationContext<Record<string, unknown>>): RuleResult {
    const keyCount = Object.keys(context.value).length;

    if (keyCount < this.minKeys) {
      return {
        success: false,
        message: `Object must have at least ${this.minKeys} key(s)`,
        code: 'min_keys',
      };
    }

    return { success: true };
  }
}

/**
 * Regra para validar número máximo de chaves no objeto.
 */
class MaxKeysRule implements StandardSchemaRule<Record<string, unknown>> {
  public readonly name = 'object_max_keys';

  public constructor(private readonly maxKeys: number) {}

  public validate(context: ValidationContext<Record<string, unknown>>): RuleResult {
    const keyCount = Object.keys(context.value).length;

    if (keyCount > this.maxKeys) {
      return {
        success: false,
        message: `Object must have at most ${this.maxKeys} key(s)`,
        code: 'max_keys',
      };
    }

    return { success: true };
  }
}

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
export class ObjectSchema<
  T extends Record<string, StandardSchemaV1<unknown, unknown>> = Record<string, StandardSchemaV1<unknown, unknown>>,
> extends BaseSchema<Record<string, unknown>, InferObjectOutput<T>> {
  /**
   * Shape do objeto com schemas para cada propriedade.
   */
  private readonly shape: T;

  /**
   * Cria uma nova instância de ObjectSchema.
   *
   * @param shape - Shape definindo schemas para cada propriedade do objeto
   */
  public constructor(shape: T) {
    super();
    this.shape = shape;
    // Adiciona regra de tipo automaticamente - usando as const para inferência correta
    this.addRule(new ObjectTypeRule() as unknown as StandardSchemaRule<Record<string, unknown>, InferObjectOutput<T>>);
    // Adiciona regra de shape
    this.addRule(new ObjectShapeRule<T>(shape) as unknown as StandardSchemaRule<Record<string, unknown>, InferObjectOutput<T>>);
  }

  /**
   * Habilita modo estrito que rejeita chaves extras não definidas no shape.
   *
   * @returns Este schema para chaining
   * @example
   * v.object({ name: v.string() }).strict()
   */
  public strict(): this {
    const allowedKeys = Object.keys(this.shape);
    return this.addRule(new StrictKeysRule(allowedKeys) as unknown as StandardSchemaRule<Record<string, unknown>, InferObjectOutput<T>>);
  }

  /**
   * Permite chaves extras não definidas no shape (comportamento padrão).
   *
   * @returns Este schema para chaining
   * @example
   * v.object({ name: v.string() }).passthrough()
   */
  public passthrough(): this {
    return this;
  }

  /**
   * Valida o número mínimo de chaves no objeto.
   *
   * @param count - Número mínimo de chaves
   * @returns Este schema para chaining
   * @example
   * v.object({}).minKeys(2)
   */
  public minKeys(count: number): this {
    return this.addRule(new MinKeysRule(count) as unknown as StandardSchemaRule<Record<string, unknown>, InferObjectOutput<T>>);
  }

  /**
   * Valida o número máximo de chaves no objeto.
   *
   * @param count - Número máximo de chaves
   * @returns Este schema para chaining
   * @example
   * v.object({}).maxKeys(5)
   */
  public maxKeys(count: number): this {
    return this.addRule(new MaxKeysRule(count) as unknown as StandardSchemaRule<Record<string, unknown>, InferObjectOutput<T>>);
  }

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
  public extend<U extends Record<string, StandardSchemaV1<unknown, unknown>>>(
    shape: U,
  ): ObjectSchema<T & U> {
    const extendedShape = { ...this.shape, ...shape } as T & U;
    return new ObjectSchema<T & U>(extendedShape);
  }

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
  public omit<K extends keyof T>(keys: readonly K[]): ObjectSchema<Omit<T, K>> {
    const newShape = { ...this.shape };
    for (const key of keys) {
      delete newShape[key];
    }
    return new ObjectSchema<Omit<T, K>>(newShape as Omit<T, K>);
  }

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
  public pick<K extends keyof T>(keys: readonly K[]): ObjectSchema<Pick<T, K>> {
    const newShape = {} as Pick<T, K>;
    for (const key of keys) {
      if (key in this.shape) {
        newShape[key] = this.shape[key];
      }
    }
    return new ObjectSchema<Pick<T, K>>(newShape);
  }

  /**
   * Torna todas as propriedades do shape opcionais.
   *
   * @returns Novo ObjectSchema com todas as propriedades opcionais
   * @example
   * const requiredSchema = v.object({ name: v.string().required() });
   * const optionalSchema = requiredSchema.partial();
   */
  public partial(): ObjectSchema<{
    [K in keyof T]: T[K] extends StandardSchemaV1<infer Input, infer Output>
      ? StandardSchemaV1<Input | undefined, Output>
      : T[K];
  }> {
    const partialShape = {} as {
      [K in keyof T]: T[K] extends StandardSchemaV1<infer Input, infer Output>
        ? StandardSchemaV1<Input | undefined, Output>
        : T[K];
    };

    for (const [key, schema] of Object.entries(this.shape)) {
      const optionalSchema = {
        ...schema,
        '~standard': {
          ...schema['~standard'],
          validate: (value: unknown) => {
            if (value === undefined) {
              return { success: true, value: undefined };
            }
            return schema['~standard'].validate(value);
          },
        },
      };
      partialShape[key as keyof T] = optionalSchema as unknown as {
        [K in keyof T]: T[K] extends StandardSchemaV1<infer Input, infer Output>
          ? StandardSchemaV1<Input | undefined, Output>
          : T[K];
      }[typeof key];
    }

    return new ObjectSchema(partialShape);
  }

  /**
   * Retorna o shape atual do schema.
   *
   * @returns O shape definido para este schema
   */
  public getShape(): T {
    return this.shape;
  }
}
