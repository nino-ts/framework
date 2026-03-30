/**
 * Contrato interno para regras de validação.
 *
 * @packageDocumentation
 * Define a interface base que todas as regras de validação devem implementar.
 * Este contrato é usado internamente pelo sistema de validação fluente.
 */

/**
 * Contexto de validação passado para cada regra.
 *
 * @template T - Tipo do valor sendo validado
 */
export interface ValidationContext<T = unknown> {
  /**
   * O valor atual sendo validado.
   */
  readonly value: T;

  /**
   * O valor original (antes de qualquer transformação).
   */
  readonly originalValue: T;

  /**
   * Caminho atual no objeto sendo validado.
   * Útil para mensagens de erro contextualizadas.
   */
  readonly path: readonly (string | number)[];

  /**
   * Dados completos sendo validados.
   * Útil para regras que dependem de múltiplos campos.
   */
  readonly data: Record<string, unknown>;
}

/**
 * Resultado da execução de uma regra de validação.
 */
export interface RuleResult {
  /**
   * Indica se a regra passou na validação.
   */
  readonly success: boolean;

  /**
   * Mensagem de erro descritiva (apenas se success for false).
   */
  readonly message?: string;

  /**
   * Código de erro para internacionalização.
   * Exemplo: 'required', 'min_length', 'invalid_email'
   */
  readonly code?: string;
}

/**
 * Contrato para regras de validação individuais.
 *
 * @template TInput - Tipo de entrada esperado pela regra
 * @template TOutput - Tipo de saída após a regra (pode ser diferente após transformação)
 */
export interface StandardSchemaRule<TInput = unknown, TOutput = TInput> {
  /**
   * Nome identificador da regra.
   * Usado para debugging e mensagens de erro.
   */
  readonly name: string;

  /**
   * Executa a validação da regra.
   *
   * @param context - Contexto contendo o valor e metadados da validação
   * @returns Resultado da validação
   * @example
   * const rule = new RequiredRule();
   * const result = rule.validate({ value: undefined, path: ['name'], data: {} });
   * // { success: false, message: 'Field is required', code: 'required' }
   */
  validate(context: ValidationContext<TInput>): RuleResult;

  /**
   * Transforma o valor após validação bem-sucedida.
   * Pode ser usado para normalização (ex: trim em strings).
   *
   * @param value - Valor validado
   * @returns Valor transformado
   * @default Retorna o valor inalterado
   */
  transform?(value: TInput): TOutput;
}

/**
 * Tipo para função de validação genérica.
 *
 * @template T - Tipo do valor sendo validado
 * @param value - Valor a ser validado
 * @returns True se válido, false se inválido
 */
export type ValidationFunction<T = unknown> = (value: T) => boolean;

/**
 * Tipo para função de transformação.
 *
 * @template TInput - Tipo de entrada
 * @template TOutput - Tipo de saída
 * @param value - Valor a ser transformado
 * @returns Valor transformado
 */
export type TransformFunction<TInput, TOutput> = (value: TInput) => TOutput;
