/**
 * Schema fluente para validação de números.
 *
 * @packageDocumentation
 * Fornece uma API fluente type-safe para validação de números
 * com suporte a min, max, positive, negative, integer e mais.
 */

import type { StandardSchemaRule, ValidationContext, RuleResult } from '../contracts/StandardSchemaRule';
import { BaseSchema } from './BaseSchema';

/**
 * Regra para validar se o valor é um número.
 */
class NumberTypeRule implements StandardSchemaRule<unknown, number> {
  public readonly name = 'number_type';

  public validate(context: ValidationContext<unknown>): RuleResult {
    if (typeof context.value !== 'number' || Number.isNaN(context.value)) {
      return {
        success: false,
        message: 'Expected a number',
        code: 'invalid_type',
      };
    }

    return { success: true };
  }

  public transform(value: unknown): number {
    return value as number;
  }
}

/**
 * Regra para validar valor mínimo.
 */
class MinValueRule implements StandardSchemaRule<number> {
  public readonly name = 'min_value';

  public constructor(private readonly minValue: number) {}

  public validate(context: ValidationContext<number>): RuleResult {
    if (context.value < this.minValue) {
      return {
        success: false,
        message: `Number must be at least ${this.minValue}`,
        code: 'min_value',
      };
    }

    return { success: true };
  }
}

/**
 * Regra para validar valor máximo.
 */
class MaxValueRule implements StandardSchemaRule<number> {
  public readonly name = 'max_value';

  public constructor(private readonly maxValue: number) {}

  public validate(context: ValidationContext<number>): RuleResult {
    if (context.value > this.maxValue) {
      return {
        success: false,
        message: `Number must be at most ${this.maxValue}`,
        code: 'max_value',
      };
    }

    return { success: true };
  }
}

/**
 * Regra para validar se o número é positivo.
 */
class PositiveRule implements StandardSchemaRule<number> {
  public readonly name = 'positive';

  public validate(context: ValidationContext<number>): RuleResult {
    if (context.value <= 0) {
      return {
        success: false,
        message: 'Number must be positive',
        code: 'positive',
      };
    }

    return { success: true };
  }
}

/**
 * Regra para validar se o número é negativo.
 */
class NegativeRule implements StandardSchemaRule<number> {
  public readonly name = 'negative';

  public validate(context: ValidationContext<number>): RuleResult {
    if (context.value >= 0) {
      return {
        success: false,
        message: 'Number must be negative',
        code: 'negative',
      };
    }

    return { success: true };
  }
}

/**
 * Regra para validar se o número é inteiro.
 */
class IntegerRule implements StandardSchemaRule<number> {
  public readonly name = 'integer';

  public validate(context: ValidationContext<number>): RuleResult {
    if (!Number.isInteger(context.value)) {
      return {
        success: false,
        message: 'Number must be an integer',
        code: 'integer',
      };
    }

    return { success: true };
  }
}

/**
 * Schema fluente para validação de números.
 *
 * @example
 * const schema = v.number().required().min(0).max(100);
 * const result = schema.validate(50);
 * // { success: true, value: 50 }
 *
 * @example
 * const schema = v.number().positive().integer();
 * const result = schema.validate(42);
 * // { success: true, value: 42 }
 */
export class NumberSchema extends BaseSchema<number, number> {
  /**
   * Cria uma nova instância de NumberSchema.
   */
  public constructor() {
    super();
    // Adiciona regra de tipo automaticamente
    this.addRule(new NumberTypeRule());
  }

  /**
   * Valida o valor mínimo do número.
   *
   * @param value - Valor mínimo permitido
   * @returns Este schema para chaining
   * @example
   * v.number().min(0)
   */
  public min(value: number): this {
    return this.addRule(new MinValueRule(value));
  }

  /**
   * Valida o valor máximo do número.
   *
   * @param value - Valor máximo permitido
   * @returns Este schema para chaining
   * @example
   * v.number().max(100)
   */
  public max(value: number): this {
    return this.addRule(new MaxValueRule(value));
  }

  /**
   * Valida se o número é positivo (> 0).
   *
   * @returns Este schema para chaining
   * @example
   * v.number().positive()
   */
  public positive(): this {
    return this.addRule(new PositiveRule());
  }

  /**
   * Valida se o número é negativo (< 0).
   *
   * @returns Este schema para chaining
   * @example
   * v.number().negative()
   */
  public negative(): this {
    return this.addRule(new NegativeRule());
  }

  /**
   * Valida se o número é inteiro (sem casas decimais).
   *
   * @returns Este schema para chaining
   * @example
   * v.number().integer()
   */
  public integer(): this {
    return this.addRule(new IntegerRule());
  }

  /**
   * Valida se o número é igual a um valor específico.
   *
   * @param value - Valor esperado
   * @returns Este schema para chaining
   * @example
   * v.number().equal(42)
   */
  public equal(value: number): this {
    return this.addRule({
      name: 'equal',
      validate: (context: ValidationContext<number>): RuleResult => {
        if (context.value !== value) {
          return {
            success: false,
            message: `Number must be equal to ${value}`,
            code: 'equal',
          };
        }
        return { success: true };
      },
    });
  }

  /**
   * Valida se o número está dentro de um intervalo.
   *
   * @param min - Valor mínimo (inclusivo)
   * @param max - Valor máximo (inclusivo)
   * @returns Este schema para chaining
   * @example
   * v.number().range(1, 10)
   */
  public range(min: number, max: number): this {
    return this.addRule(new MinValueRule(min)).addRule(new MaxValueRule(max));
  }

  /**
   * Valida se o número é múltiplo de um valor base.
   *
   * @param base - Valor base para múltiplo
   * @returns Este schema para chaining
   * @example
   * v.number().multipleOf(5)
   */
  public multipleOf(base: number): this {
    return this.addRule({
      name: 'multiple_of',
      validate: (context: ValidationContext<number>): RuleResult => {
        if (context.value % base !== 0) {
          return {
            success: false,
            message: `Number must be a multiple of ${base}`,
            code: 'multiple_of',
          };
        }
        return { success: true };
      },
    });
  }

  /**
   * Valida se o número é finito (não Infinity ou -Infinity).
   *
   * @returns Este schema para chaining
   * @example
   * v.number().finite()
   */
  public finite(): this {
    return this.addRule({
      name: 'finite',
      validate: (context: ValidationContext<number>): RuleResult => {
        if (!Number.isFinite(context.value)) {
          return {
            success: false,
            message: 'Number must be finite',
            code: 'finite',
          };
        }
        return { success: true };
      },
    });
  }

  /**
   * Valida se o número é safe integer (dentro do limite do JavaScript).
   *
   * @returns Este schema para chaining
   * @example
   * v.number().safe()
   */
  public safe(): this {
    return this.addRule({
      name: 'safe_integer',
      validate: (context: ValidationContext<number>): RuleResult => {
        if (!Number.isSafeInteger(context.value)) {
          return {
            success: false,
            message: 'Number must be a safe integer',
            code: 'safe_integer',
          };
        }
        return { success: true };
      },
    });
  }

  /**
   * Valida se o número é safe integer (alias para safe()).
   *
   * @returns Este schema para chaining
   * @example
   * v.number().safeInteger()
   */
  public safeInteger(): this {
    return this.safe();
  }
}
