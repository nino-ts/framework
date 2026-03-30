/**
 * Classe base abstrata para todos os schemas fluentes.
 *
 * @packageDocumentation
 * Implementa a interface StandardSchemaV1 e fornece funcionalidades
 * comuns para todos os tipos de schema (string, number, boolean, etc.).
 */

import type {
  StandardSchemaV1,
  StandardSchemaSuccessResult,
  StandardSchemaFailureResult,
  StandardSchemaIssue,
} from '../types';
import type { StandardSchemaRule, ValidationContext } from '../contracts/StandardSchemaRule';

/**
 * Configuração de modificadores de nullabilidade.
 */
export interface NullabilityConfig {
  /**
   * Se true, o valor é obrigatório (não pode ser undefined).
   */
  required: boolean;

  /**
   * Se true, o valor pode ser null.
   */
  nullable: boolean;

  /**
   * Se true, o valor pode ser undefined (opcional).
   */
  optional: boolean;
}

/**
 * Configuração padrão para schemas requeridos.
 */
export const DEFAULT_NULLABILITY: NullabilityConfig = {
  required: true,
  nullable: false,
  optional: false,
};

/**
 * Classe base abstrata para todos os schemas fluentes.
 *
 * @template TInput - Tipo de entrada esperado pelo schema
 * @template TOutput - Tipo de saída após validação e transformação
 */
export abstract class BaseSchema<TInput = unknown, TOutput = TInput> implements StandardSchemaV1<TInput, TOutput> {
  /**
   * Configuração de nullabilidade atual.
   */
  protected nullability: NullabilityConfig;

  /**
   * Lista de regras de validação aplicadas.
   */
  protected rules: StandardSchemaRule<unknown, unknown>[];

  /**
   * Cria uma nova instância de schema base.
   */
  protected constructor() {
    this.nullability = { ...DEFAULT_NULLABILITY };
    this.rules = [];
  }

  /**
   * Implementação do contrato StandardSchemaV1.
   * Namespace obrigatório para identificação como Standard Schema.
   */
  public readonly '~standard' = {
    vendor: 'ninots',
    version: '1.0.0',
    format: 'validation',
    validate: this.validate.bind(this),
  } as const;

  /**
   * Valida um valor contra este schema.
   * Aceita unknown para compatibilidade com Standard Schema V1,
   * mas type-check em tempo de compilação espera TInput.
   *
   * @param value - Valor a ser validado
   * @returns Resultado da validação (sucesso ou falha com issues)
   * @example
   * const schema = v.string().required();
   * const result = schema.validate('hello');
   * // { success: true, value: 'hello' }
   */
  public validate(value: TInput): StandardSchemaSuccessResult<TOutput> | StandardSchemaFailureResult<TInput> {
    // Type narrowing para unknown para validação runtime
    const unknownValue = value as unknown;
    
    // Verifica nullabilidade primeiro
    const nullabilityResult = this.validateNullability(unknownValue);
    if (!nullabilityResult.success) {
      return {
        success: false,
        value,
        issues: [nullabilityResult.issue],
      };
    }

    // Se o valor for null ou undefined e permitido, retorna sucesso
    if (unknownValue === null || unknownValue === undefined) {
      return { success: true, value: value as unknown as TOutput };
    }

    // Executa todas as regras de validação
    const issues: StandardSchemaIssue[] = [];
    let currentValue: unknown = unknownValue;

    for (const rule of this.rules) {
      const context: ValidationContext<unknown> = {
        value: currentValue,
        originalValue: unknownValue,
        path: [],
        data: {},
      };

      const result = rule.validate(context);

      if (!result.success) {
        issues.push({
          message: result.message ?? 'Validation failed',
          code: result.code,
          value: currentValue,
        });
      } else if (rule.transform) {
        currentValue = rule.transform(currentValue);
      }
    }

    if (issues.length > 0) {
      return {
        success: false,
        value,
        issues,
      };
    }

    return {
      success: true,
      value: currentValue as unknown as TOutput,
    };
  }

  /**
   * Valida a nullabilidade do valor (required/optional/nullable).
   *
   * @param value - Valor a ser verificado
   * @returns Resultado da verificação
   */
  protected validateNullability(value: unknown): { success: true } | { success: false; issue: StandardSchemaIssue } {
    // Verifica se é required
    if (this.nullability.required && !this.nullability.optional) {
      if (value === undefined) {
        return {
          success: false,
          issue: {
            message: 'Value is required',
            code: 'required',
            value,
          },
        };
      }
    }

    // Verifica se nullable é false e valor é null
    if (!this.nullability.nullable && value === null) {
      return {
        success: false,
        issue: {
          message: 'Value cannot be null',
          code: 'not_nullable',
          value,
        },
      };
    }

    return { success: true };
  }

  /**
   * Marca o campo como obrigatório (não pode ser undefined).
   *
   * @returns Este schema para chaining
   * @example
   * v.string().required()
   */
  public required(): this {
    this.nullability.required = true;
    this.nullability.optional = false;
    return this;
  }

  /**
   * Marca o campo como opcional (pode ser undefined).
   *
   * @returns Este schema para chaining
   * @example
   * v.string().optional()
   */
  public optional(): this {
    this.nullability.required = false;
    this.nullability.optional = true;
    return this;
  }

  /**
   * Marca o campo como nullable (pode ser null).
   *
   * @returns Este schema para chaining
   * @example
   * v.string().nullable()
   */
  public nullable(): this {
    this.nullability.nullable = true;
    return this;
  }

  /**
   * Adiciona uma regra de validação ao schema.
   *
   * @param rule - Regra a ser adicionada
   * @returns Este schema para chaining
   */
  protected addRule(rule: StandardSchemaRule<unknown, unknown>): this {
    this.rules.push(rule);
    return this;
  }
}
