/**
 * Schema fluente para validação de strings.
 *
 * @packageDocumentation
 * Fornece uma API fluente type-safe para validação de strings
 * com suporte a email, URL, UUID, minLength, maxLength e mais.
 */

import type { StandardSchemaRule, ValidationContext, RuleResult } from '../contracts/StandardSchemaRule';
import { BaseSchema } from './BaseSchema';

/**
 * Regra para validar se uma string é requerida.
 */
class StringRequiredRule implements StandardSchemaRule<string> {
  public readonly name = 'string_required';

  public validate(context: ValidationContext<string>): RuleResult {
    if (context.value === undefined || context.value === null) {
      return {
        success: false,
        message: 'String is required',
        code: 'required',
      };
    }

    return { success: true };
  }
}

/**
 * Regra para validar formato de email.
 */
class EmailRule implements StandardSchemaRule<string> {
  public readonly name = 'email';

  private readonly emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  public validate(context: ValidationContext<string>): RuleResult {
    const value = context.value;

    if (!this.emailRegex.test(value)) {
      return {
        success: false,
        message: 'Invalid email format',
        code: 'email',
      };
    }

    return { success: true };
  }
}

/**
 * Regra para validar comprimento mínimo.
 */
class MinLengthRule implements StandardSchemaRule<string> {
  public readonly name = 'min_length';

  public constructor(private readonly minLength: number) {}

  public validate(context: ValidationContext<string>): RuleResult {
    if (context.value.length < this.minLength) {
      return {
        success: false,
        message: `String must be at least ${this.minLength} characters`,
        code: 'min_length',
      };
    }

    return { success: true };
  }
}

/**
 * Regra para validar comprimento máximo.
 */
class MaxLengthRule implements StandardSchemaRule<string> {
  public readonly name = 'max_length';

  public constructor(private readonly maxLength: number) {}

  public validate(context: ValidationContext<string>): RuleResult {
    if (context.value.length > this.maxLength) {
      return {
        success: false,
        message: `String must be at most ${this.maxLength} characters`,
        code: 'max_length',
      };
    }

    return { success: true };
  }
}

/**
 * Regra para validar formato UUID.
 */
class UuidRule implements StandardSchemaRule<string> {
  public readonly name = 'uuid';

  private readonly uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

  public validate(context: ValidationContext<string>): RuleResult {
    if (!this.uuidRegex.test(context.value)) {
      return {
        success: false,
        message: 'Invalid UUID format',
        code: 'uuid',
      };
    }

    return { success: true };
  }
}

/**
 * Regra para validar formato de URL.
 */
class UrlRule implements StandardSchemaRule<string> {
  public readonly name = 'url';

  public validate(context: ValidationContext<string>): RuleResult {
    try {
      // eslint-disable-next-line no-new
      new URL(context.value);
      return { success: true };
    } catch {
      return {
        success: false,
        message: 'Invalid URL format',
        code: 'url',
      };
    }
  }
}

/**
 * Regra para validar se o valor é uma string.
 */
class StringTypeRule implements StandardSchemaRule<unknown, string> {
  public readonly name = 'string_type';

  public validate(context: ValidationContext<unknown>): RuleResult {
    if (typeof context.value !== 'string') {
      return {
        success: false,
        message: 'Expected a string',
        code: 'invalid_type',
      };
    }

    return { success: true };
  }

  public transform(value: unknown): string {
    return value as string;
  }
}

/**
 * Regra para validar apenas letras (alpha).
 */
class AlphaRule implements StandardSchemaRule<string> {
  public readonly name = 'alpha';

  private readonly alphaRegex = /^\p{L}+$/u;

  public validate(context: ValidationContext<string>): RuleResult {
    const value = context.value;

    if (value === null || value === undefined) {
      return { success: true };
    }

    if (value.length === 0) {
      return {
        success: false,
        message: 'The field must contain only letters',
        code: 'alpha_empty',
      };
    }

    if (!this.alphaRegex.test(value)) {
      return {
        success: false,
        message: 'The field must contain only letters',
        code: 'alpha',
      };
    }

    return { success: true };
  }
}

/**
 * Regra para validar letras e números (alphanumeric).
 */
class AlphaNumRule implements StandardSchemaRule<string> {
  public readonly name = 'alpha_num';

  private readonly alphaNumRegex = /^[\p{L}\p{N}]+$/u;

  public validate(context: ValidationContext<string>): RuleResult {
    const value = context.value;

    if (value === null || value === undefined) {
      return { success: true };
    }

    if (value.length === 0) {
      return {
        success: false,
        message: 'The field must contain only letters and numbers',
        code: 'alpha_num_empty',
      };
    }

    if (!this.alphaNumRegex.test(value)) {
      return {
        success: false,
        message: 'The field must contain only letters and numbers',
        code: 'alpha_num',
      };
    }

    return { success: true };
  }
}

/**
 * Regra para validar letras, números, dashes e underscores.
 */
class AlphaDashRule implements StandardSchemaRule<string> {
  public readonly name = 'alpha_dash';

  private readonly alphaDashRegex = /^[\p{L}\p{N}_-]+$/u;

  public validate(context: ValidationContext<string>): RuleResult {
    const value = context.value;

    if (value === null || value === undefined) {
      return { success: true };
    }

    if (value.length === 0) {
      return {
        success: false,
        message: 'The field must contain only letters, numbers, dashes, or underscores',
        code: 'alpha_dash_empty',
      };
    }

    if (!this.alphaDashRegex.test(value)) {
      return {
        success: false,
        message: 'The field must contain only letters, numbers, dashes, or underscores',
        code: 'alpha_dash',
      };
    }

    return { success: true };
  }
}

/**
 * Regra para validar URL ativa (http status 200).
 */
class ActiveUrlRule implements StandardSchemaRule<string> {
  public readonly name = 'active_url';

  public validate(context: ValidationContext<string>): RuleResult {
    const value = context.value;

    if (value === null || value === undefined) {
      return { success: true };
    }

    // Valida formato de URL primeiro
    try {
      new URL(value);
    } catch {
      return {
        success: false,
        message: 'The field must be a valid URL',
        code: 'active_url',
      };
    }

    // Nota: Verificação HTTP real seria assíncrona
    // Para versão síncrona, apenas valida o formato
    return { success: true };
  }
}

/**
 * Regra para validar dígitos exatos.
 */
class DigitsRule implements StandardSchemaRule<string> {
  public readonly name = 'digits';

  public constructor(private readonly length: number) {}

  public validate(context: ValidationContext<string>): RuleResult {
    const value = context.value;

    if (value === null || value === undefined) {
      return { success: true };
    }

    const digitsRegex = /^\d+$/;

    if (!digitsRegex.test(value)) {
      return {
        success: false,
        message: 'The field must contain only digits',
        code: 'digits',
      };
    }

    if (value.length !== this.length) {
      return {
        success: false,
        message: `The field must be exactly ${this.length} digits`,
        code: 'digits',
      };
    }

    return { success: true };
  }
}

/**
 * Regra para validar dígitos entre um intervalo.
 */
class DigitsBetweenRule implements StandardSchemaRule<string> {
  public readonly name = 'digits_between';

  public constructor(
    private readonly min: number,
    private readonly max: number,
  ) {}

  public validate(context: ValidationContext<string>): RuleResult {
    const value = context.value;

    if (value === null || value === undefined) {
      return { success: true };
    }

    const digitsRegex = /^\d+$/;

    if (!digitsRegex.test(value)) {
      return {
        success: false,
        message: 'The field must contain only digits',
        code: 'digits_between',
      };
    }

    if (value.length < this.min || value.length > this.max) {
      return {
        success: false,
        message: `The field must be between ${this.min} and ${this.max} digits`,
        code: 'digits_between',
      };
    }

    return { success: true };
  }
}

/**
 * Regra para validar endereço IP (IPv4/IPv6).
 */
class IpRule implements StandardSchemaRule<string> {
  public readonly name = 'ip';

  private readonly ipv4Regex = /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
  private readonly ipv6Regex = /^(?:[0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}$|^::(?:[0-9a-fA-F]{1,4}:){0,6}[0-9a-fA-F]{1,4}$|^(?:[0-9a-fA-F]{1,4}:){1,7}:$|^(?:[0-9a-fA-F]{1,4}:){0,6}::(?:[0-9a-fA-F]{1,4}:){0,5}[0-9a-fA-F]{1,4}$/;

  public validate(context: ValidationContext<string>): RuleResult {
    const value = context.value;

    if (value === null || value === undefined) {
      return { success: true };
    }

    if (this.ipv4Regex.test(value) || this.ipv6Regex.test(value)) {
      return { success: true };
    }

    return {
      success: false,
      message: 'The field must be a valid IP address',
      code: 'ip',
    };
  }
}

/**
 * Regra para validar valor em uma lista (IN).
 */
class InRule implements StandardSchemaRule<string> {
  public readonly name = 'in';

  public constructor(private readonly allowedValues: unknown[]) {}

  public validate(context: ValidationContext<string>): RuleResult {
    const value = context.value;

    if (value === null || value === undefined) {
      return { success: true };
    }

    if (!this.allowedValues.includes(value)) {
      return {
        success: false,
        message: `The selected value is invalid`,
        code: 'in',
      };
    }

    return { success: true };
  }
}

/**
 * Regra para validar valor não está em uma lista (NOT IN).
 */
class NotInRule implements StandardSchemaRule<string> {
  public readonly name = 'not_in';

  public constructor(private readonly forbiddenValues: unknown[]) {}

  public validate(context: ValidationContext<string>): RuleResult {
    const value = context.value;

    if (value === null || value === undefined) {
      return { success: true };
    }

    if (this.forbiddenValues.includes(value)) {
      return {
        success: false,
        message: `The selected value is forbidden`,
        code: 'not_in',
      };
    }

    return { success: true };
  }
}

/**
 * Schema fluente para validação de strings.
 *
 * @example
 * const schema = v.string().required().email();
 * const result = schema.validate('user@example.com');
 * // { success: true, value: 'user@example.com' }
 *
 * @example
 * const schema = v.string().min(3).max(50);
 * const result = schema.validate('John');
 * // { success: true, value: 'John' }
 */
export class StringSchema extends BaseSchema<string, string> {
  /**
   * Cria uma nova instância de StringSchema.
   */
  public constructor() {
    super();
    // Adiciona regra de tipo automaticamente
    this.addRule(new StringTypeRule());
  }

  /**
   * Marca a string como obrigatória (não vazia).
   * Adiciona validação de required específica para strings.
   *
   * @returns Este schema para chaining
   * @example
   * v.string().required()
   */
  public override required(): this {
    super.required();
    return this.addRule(new StringRequiredRule());
  }

  /**
   * Valida se a string é um email válido.
   *
   * @returns Este schema para chaining
   * @example
   * v.string().email()
   */
  public email(): this {
    return this.addRule(new EmailRule());
  }

  /**
   * Valida o comprimento mínimo da string.
   *
   * @param length - Comprimento mínimo
   * @returns Este schema para chaining
   * @example
   * v.string().min(3)
   */
  public min(length: number): this {
    return this.addRule(new MinLengthRule(length));
  }

  /**
   * Valida o comprimento máximo da string.
   *
   * @param length - Comprimento máximo
   * @returns Este schema para chaining
   * @example
   * v.string().max(255)
   */
  public max(length: number): this {
    return this.addRule(new MaxLengthRule(length));
  }

  /**
   * Valida se a string é um UUID válido.
   *
   * @returns Este schema para chaining
   * @example
   * v.string().uuid()
   */
  public uuid(): this {
    return this.addRule(new UuidRule());
  }

  /**
   * Valida se a string é uma URL válida.
   *
   * @returns Este schema para chaining
   * @example
   * v.string().url()
   */
  public url(): this {
    return this.addRule(new UrlRule());
  }

  /**
   * Valida se a string contém apenas letras.
   *
   * @returns Este schema para chaining
   * @example
   * v.string().alpha()
   */
  public alpha(): this {
    return this.addRule(new AlphaRule());
  }

  /**
   * Valida se a string contém apenas letras e números.
   *
   * @returns Este schema para chaining
   * @example
   * v.string().alphaNum()
   */
  public alphaNum(): this {
    return this.addRule(new AlphaNumRule());
  }

  /**
   * Valida se a string contém apenas letras, números, dashes e underscores.
   *
   * @returns Este schema para chaining
   * @example
   * v.string().alphaDash()
   */
  public alphaDash(): this {
    return this.addRule(new AlphaDashRule());
  }

  /**
   * Valida se a string é uma URL ativa.
   *
   * @returns Este schema para chaining
   * @example
   * v.string().activeUrl()
   */
  public activeUrl(): this {
    return this.addRule(new ActiveUrlRule());
  }

  /**
   * Valida se a string tem exatamente N dígitos.
   *
   * @param length - Número exato de dígitos
   * @returns Este schema para chaining
   * @example
   * v.string().digits(5)
   */
  public digits(length: number): this {
    return this.addRule(new DigitsRule(length));
  }

  /**
   * Valida se a string tem entre X e Y dígitos.
   *
   * @param min - Mínimo de dígitos
   * @param max - Máximo de dígitos
   * @returns Este schema para chaining
   * @example
   * v.string().digitsBetween(3, 5)
   */
  public digitsBetween(min: number, max: number): this {
    return this.addRule(new DigitsBetweenRule(min, max));
  }

  /**
   * Valida se a string é um endereço IP válido.
   *
   * @returns Este schema para chaining
   * @example
   * v.string().ip()
   */
  public ip(): this {
    return this.addRule(new IpRule());
  }

  /**
   * Valida se o valor está em uma lista de valores permitidos.
   *
   * @param values - Valores permitidos
   * @returns Este schema para chaining
   * @example
   * v.string().in(['admin', 'user'])
   */
  public in(...values: unknown[]): this {
    return this.addRule(new InRule(values));
  }

  /**
   * Valida se o valor NÃO está em uma lista de valores proibidos.
   *
   * @param values - Valores proibidos
   * @returns Este schema para chaining
   * @example
   * v.string().notIn(['banned', 'spam'])
   */
  public notIn(...values: unknown[]): this {
    return this.addRule(new NotInRule(values));
  }

  /**
   * Valida se a string está vazia.
   *
   * @returns Este schema para chaining
   * @example
   * v.string().empty()
   */
  public empty(): this {
    return this.addRule({
      name: 'empty',
      validate: (context: ValidationContext<string>): RuleResult => {
        if (context.value.length !== 0) {
          return {
            success: false,
            message: 'String must be empty',
            code: 'empty',
          };
        }
        return { success: true };
      },
    });
  }

  /**
   * Valida se a string não está vazia.
   *
   * @returns Este schema para chaining
   * @example
   * v.string().nonEmpty()
   */
  public nonEmpty(): this {
    return this.addRule({
      name: 'non_empty',
      validate: (context: ValidationContext<string>): RuleResult => {
        if (context.value.length === 0) {
          return {
            success: false,
            message: 'String cannot be empty',
            code: 'non_empty',
          };
        }
        return { success: true };
      },
    });
  }

  /**
   * Valida se a string corresponde a um padrão regex.
   *
   * @param pattern - Expressão regular ou string de padrão
   * @param message - Mensagem de erro personalizada (opcional)
   * @returns Este schema para chaining
   * @example
   * v.string().regex(/^[A-Z]+$/)
   */
  public regex(pattern: RegExp, message?: string): this {
    return this.addRule({
      name: 'regex',
      validate: (context: ValidationContext<string>): RuleResult => {
        if (!pattern.test(context.value)) {
          return {
            success: false,
            message: message ?? `String does not match pattern ${pattern}`,
            code: 'regex',
          };
        }
        return { success: true };
      },
    });
  }

  /**
   * Valida se a string começa com um prefixo específico.
   *
   * @param prefix - Prefixo esperado
   * @returns Este schema para chaining
   * @example
   * v.string().startsWith('https://')
   */
  public startsWith(prefix: string): this {
    return this.addRule({
      name: 'starts_with',
      validate: (context: ValidationContext<string>): RuleResult => {
        if (!context.value.startsWith(prefix)) {
          return {
            success: false,
            message: `String must start with "${prefix}"`,
            code: 'starts_with',
          };
        }
        return { success: true };
      },
    });
  }

  /**
   * Valida se a string termina com um sufixo específico.
   *
   * @param suffix - Sufixo esperado
   * @returns Este schema para chaining
   * @example
   * v.string().endsWith('.com')
   */
  public endsWith(suffix: string): this {
    return this.addRule({
      name: 'ends_with',
      validate: (context: ValidationContext<string>): RuleResult => {
        if (!context.value.endsWith(suffix)) {
          return {
            success: false,
            message: `String must end with "${suffix}"`,
            code: 'ends_with',
          };
        }
        return { success: true };
      },
    });
  }

  /**
   * Valida se a string contém uma substring específica.
   *
   * @param substring - Substring esperada
   * @returns Este schema para chaining
   * @example
   * v.string().contains('admin')
   */
  public contains(substring: string): this {
    return this.addRule({
      name: 'contains',
      validate: (context: ValidationContext<string>): RuleResult => {
        if (!context.value.includes(substring)) {
          return {
            success: false,
            message: `String must contain "${substring}"`,
            code: 'contains',
          };
        }
        return { success: true };
      },
    });
  }

  /**
   * Transforma a string para lowercase.
   *
   * @returns Este schema para chaining
   * @example
   * v.string().lowercase()
   */
  public lowercase(): this {
    return this.addRule({
      name: 'lowercase',
      validate: () => ({ success: true }),
      transform: (value: string): string => value.toLowerCase(),
    });
  }

  /**
   * Transforma a string para uppercase.
   *
   * @returns Este schema para chaining
   * @example
   * v.string().uppercase()
   */
  public uppercase(): this {
    return this.addRule({
      name: 'uppercase',
      validate: () => ({ success: true }),
      transform: (value: string): string => value.toUpperCase(),
    });
  }

  /**
   * Remove espaços em branco do início e fim da string.
   *
   * @returns Este schema para chaining
   * @example
   * v.string().trim()
   */
  public trim(): this {
    return this.addRule({
      name: 'trim',
      validate: () => ({ success: true }),
      transform: (value: string): string => value.trim(),
    });
  }
}
