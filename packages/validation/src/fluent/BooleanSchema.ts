/**
 * Schema fluente para validação de booleanos.
 *
 * @packageDocumentation
 * Fornece uma API fluente type-safe para validação de booleanos
 * com suporte a required, optional e nullable.
 */

import type { StandardSchemaRule, ValidationContext, RuleResult } from '../contracts/StandardSchemaRule';
import { BaseSchema } from './BaseSchema';

/**
 * Regra para validar se o valor é um booleano.
 */
class BooleanTypeRule implements StandardSchemaRule<unknown, boolean> {
  public readonly name = 'boolean_type';

  public validate(context: ValidationContext<unknown>): RuleResult {
    if (typeof context.value !== 'boolean') {
      return {
        success: false,
        message: 'Expected a boolean',
        code: 'invalid_type',
      };
    }

    return { success: true };
  }

  public transform(value: unknown): boolean {
    return value as boolean;
  }
}

/**
 * Schema fluente para validação de booleanos.
 *
 * @example
 * const schema = v.boolean().required();
 * const result = schema.validate(true);
 * // { success: true, value: true }
 *
 * @example
 * const schema = v.boolean().optional();
 * const result = schema.validate(undefined);
 * // { success: true, value: undefined }
 */
export class BooleanSchema extends BaseSchema<boolean, boolean> {
  /**
   * Cria uma nova instância de BooleanSchema.
   */
  public constructor() {
    super();
    // Adiciona regra de tipo automaticamente
    this.addRule(new BooleanTypeRule());
  }

  /**
   * Valida se o valor é true.
   *
   * @returns Este schema para chaining
   * @example
   * v.boolean().true()
   */
  public true(): this {
    return this.addRule({
      name: 'is_true',
      validate: (context: ValidationContext<boolean>): RuleResult => {
        if (context.value !== true) {
          return {
            success: false,
            message: 'Value must be true',
            code: 'is_true',
          };
        }
        return { success: true };
      },
    });
  }

  /**
   * Valida se o valor é false.
   *
   * @returns Este schema para chaining
   * @example
   * v.boolean().false()
   */
  public false(): this {
    return this.addRule({
      name: 'is_false',
      validate: (context: ValidationContext<boolean>): RuleResult => {
        if (context.value !== false) {
          return {
            success: false,
            message: 'Value must be false',
            code: 'is_false',
          };
        }
        return { success: true };
      },
    });
  }
}
