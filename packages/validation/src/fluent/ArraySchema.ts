/**
 * Schema fluente para validação de arrays.
 *
 * @packageDocumentation
 * Fornece uma API fluente type-safe para validação de arrays
 * com suporte a min, max, length e validação de itens.
 */

import type { StandardSchemaIssue, StandardSchemaV1 } from '../types';
import type { StandardSchemaRule, ValidationContext, RuleResult } from '../contracts/StandardSchemaRule';
import { BaseSchema } from './BaseSchema';

/**
 * Regra para validar se o valor é um array.
 */
class ArrayTypeRule<T> implements StandardSchemaRule<unknown, T[]> {
  public readonly name = 'array_type';

  public validate(context: ValidationContext<unknown>): RuleResult {
    if (!Array.isArray(context.value)) {
      return {
        success: false,
        message: 'Expected an array',
        code: 'invalid_type',
      };
    }

    return { success: true };
  }

  public transform(value: unknown): T[] {
    return value as T[];
  }
}

/**
 * Regra para validar comprimento mínimo do array.
 */
class MinLengthRule<T> implements StandardSchemaRule<T[]> {
  public readonly name = 'array_min_length';

  public constructor(private readonly minLength: number) {}

  public validate(context: ValidationContext<T[]>): RuleResult {
    if (context.value.length < this.minLength) {
      return {
        success: false,
        message: `Array must have at least ${this.minLength} items`,
        code: 'min_length',
      };
    }

    return { success: true };
  }
}

/**
 * Regra para validar comprimento máximo do array.
 */
class MaxLengthRule<T> implements StandardSchemaRule<T[]> {
  public readonly name = 'array_max_length';

  public constructor(private readonly maxLength: number) {}

  public validate(context: ValidationContext<T[]>): RuleResult {
    if (context.value.length > this.maxLength) {
      return {
        success: false,
        message: `Array must have at most ${this.maxLength} items`,
        code: 'max_length',
      };
    }

    return { success: true };
  }
}

/**
 * Regra para validar comprimento exato do array.
 */
class ExactLengthRule<T> implements StandardSchemaRule<T[]> {
  public readonly name = 'array_exact_length';

  public constructor(private readonly length: number) {}

  public validate(context: ValidationContext<T[]>): RuleResult {
    if (context.value.length !== this.length) {
      return {
        success: false,
        message: `Array must have exactly ${this.length} items`,
        code: 'exact_length',
      };
    }

    return { success: true };
  }
}

/**
 * Regra para validar itens do array contra um schema.
 */
class ItemsRule<T> implements StandardSchemaRule<T[]> {
  public readonly name = 'array_items';

  public constructor(private readonly itemSchema: StandardSchemaV1<T>) {}

  public validate(context: ValidationContext<T[]>): RuleResult {
    const issues: StandardSchemaIssue[] = [];

    for (let i = 0; i < context.value.length; i++) {
      const item = context.value[i];
      if (item === undefined) {
        continue;
      }
      const result = this.itemSchema['~standard'].validate(item);

      if ('success' in result && !result.success) {
        for (const issue of result.issues) {
          issues.push({
            message: issue.message,
            path: [i, ...(issue.path ?? [])],
            value: issue.value,
          });
        }
      }
    }

    if (issues.length > 0) {
      return {
        success: false,
        message: `Array has ${issues.length} invalid item(s)`,
        code: 'invalid_items',
      };
    }

    return { success: true };
  }
}

/**
 * Regra para validar se o array não está vazio.
 */
class NonEmptyRule<T> implements StandardSchemaRule<T[]> {
  public readonly name = 'array_non_empty';

  public validate(context: ValidationContext<T[]>): RuleResult {
    if (context.value.length === 0) {
      return {
        success: false,
        message: 'Array cannot be empty',
        code: 'non_empty',
      };
    }

    return { success: true };
  }
}

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
export class ArraySchema<T = unknown> extends BaseSchema<T[], T[]> {
  /**
   * Cria uma nova instância de ArraySchema.
   *
   * @param itemSchema - Schema opcional para validar cada item do array
   */
  public constructor(itemSchema?: StandardSchemaV1<T>) {
    super();
    // Adiciona regra de tipo automaticamente
    this.addRule(new ArrayTypeRule<T>());
    // Adiciona regra de itens se schema fornecido
    if (itemSchema) {
      this.addRule(new ItemsRule<T>(itemSchema));
    }
  }

  /**
   * Valida o número mínimo de itens no array.
   *
   * @param count - Número mínimo de itens
   * @returns Este schema para chaining
   * @example
   * v.array().min(1)
   */
  public min(count: number): this {
    return this.addRule(new MinLengthRule<T>(count));
  }

  /**
   * Valida o número máximo de itens no array.
   *
   * @param count - Número máximo de itens
   * @returns Este schema para chaining
   * @example
   * v.array().max(10)
   */
  public max(count: number): this {
    return this.addRule(new MaxLengthRule<T>(count));
  }

  /**
   * Valida o número exato de itens no array.
   *
   * @param count - Número exato de itens
   * @returns Este schema para chaining
   * @example
   * v.array().length(3)
   */
  public length(count: number): this {
    return this.addRule(new ExactLengthRule<T>(count));
  }

  /**
   * Valida se o array não está vazio.
   *
   * @returns Este schema para chaining
   * @example
   * v.array().nonEmpty()
   */
  public nonEmpty(): this {
    return this.addRule(new NonEmptyRule<T>());
  }

  /**
   * Valida cada item do array contra um schema.
   *
   * @param schema - Schema para validar cada item
   * @returns Novo ArraySchema com o schema de itens especificado
   * @example
   * v.array().items(v.string().email())
   */
  public items<V>(schema: StandardSchemaV1<V>): ArraySchema<V> {
    return new ArraySchema<V>(schema);
  }

  /**
   * Valida se o array é vazio.
   *
   * @returns Este schema para chaining
   * @example
   * v.array().empty()
   */
  public empty(): this {
    return this.addRule({
      name: 'array_empty',
      validate: (context: ValidationContext<T[]>): RuleResult => {
        if (context.value.length !== 0) {
          return {
            success: false,
            message: 'Array must be empty',
            code: 'empty',
          };
        }
        return { success: true };
      },
    });
  }

  /**
   * Valida se o array contém um valor específico.
   *
   * @param value - Valor esperado
   * @returns Este schema para chaining
   * @example
   * v.array().includes('admin')
   */
  public includes(value: T): this {
    return this.addRule({
      name: 'array_includes',
      validate: (context: ValidationContext<T[]>): RuleResult => {
        if (!context.value.includes(value)) {
          return {
            success: false,
            message: `Array must include ${JSON.stringify(value)}`,
            code: 'includes',
          };
        }
        return { success: true };
      },
    });
  }

  /**
   * Remove itens duplicados do array (baseado em igualdade estrita).
   *
   * @returns Este schema para chaining
   * @example
   * v.array().unique()
   */
  public unique(): this {
    return this.addRule({
      name: 'array_unique',
      validate: () => ({ success: true }),
      transform: (value: T[]): T[] => [...new Set(value)],
    });
  }
}
