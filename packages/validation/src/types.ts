/**
 * Standard Schema V1 - Interface completa conforme https://standardschema.dev/schema
 *
 * @packageDocumentation
 * Define o contrato Standard Schema V1 que todos os schemas devem implementar.
 * Esta interface garante interoperabilidade com outras bibliotecas que seguem o standard.
 */

/**
 * Resultado de uma validação bem-sucedida.
 *
 * @template T - Tipo do valor validado
 */
export interface StandardSchemaSuccessResult<T> {
  /**
   * Indica que a validação foi bem-sucedida.
   */
  readonly success: true;

  /**
   * O valor validado e possivelmente transformado.
   */
  readonly value: T;
}

/**
 * Resultado de uma validação falha.
 *
 * @template T - Tipo do valor original (antes da validação)
 */
export interface StandardSchemaFailureResult<T> {
  /**
   * Indica que a validação falhou.
   */
  readonly success: false;

  /**
   * O valor original que falhou na validação.
   */
  readonly value: T;

  /**
   * Lista de erros de validação encontrados.
   * Cada erro representa uma violação específica das regras do schema.
   */
  readonly issues: readonly StandardSchemaIssue[];
}

/**
 * Representa um único erro de validação.
 *
 * @template T - Tipo do valor onde o erro ocorreu
 */
export interface StandardSchemaIssue<T = unknown> {
  /**
   * Mensagem de erro descritiva para humanos.
   * Deve ser clara e indicar como corrigir o problema.
   */
  readonly message: string;

  /**
   * Caminho até o valor que falhou na validação.
   * Pode ser uma string (para chaves de objeto) ou número (para índices de array).
   * Undefined indica que o erro é no valor raiz.
   */
  readonly path?: readonly (string | number)[];

  /**
   * O valor que falhou na validação.
   * Útil para debugging e mensagens de erro personalizadas.
   */
  readonly value?: T;

  /**
   * Código de erro para internacionalização e identificação programática.
   * Exemplo: 'required', 'min_length', 'invalid_email', 'invalid_type'
   */
  readonly code?: string;
}

/**
 * Função de validação assíncrona do Standard Schema.
 *
 * @template T - Tipo de entrada esperado
 * @template U - Tipo de saída após validação (pode ser diferente de T após transformação)
 * @param value - Valor a ser validado
 * @returns Promise que resolve para SuccessResult ou FailureResult
 */
export type StandardSchemaValidateAsync<T = unknown, U = T> = (
  value: T,
) => Promise<StandardSchemaSuccessResult<U> | StandardSchemaFailureResult<T>>;

/**
 * Função de validação síncrona do Standard Schema.
 *
 * @template T - Tipo de entrada esperado
 * @template U - Tipo de saída após validação (pode ser diferente de T após transformação)
 * @param value - Valor a ser validado
 * @returns SuccessResult ou FailureResult
 */
export type StandardSchemaValidateSync<T = unknown, U = T> = (
  value: T,
) => StandardSchemaSuccessResult<U> | StandardSchemaFailureResult<T>;

/**
 * Objeto ~standard conforme especificação Standard Schema V1.
 *
 * @template T - Tipo de entrada esperado
 * @template U - Tipo de saída após validação
 */
export interface StandardSchemaV1<T = unknown, U = T> {
  /**
   * Namespace obrigatório para identificação como Standard Schema.
   * Deve conter exatamente { vendor: string, version: string, format: string }.
   */
  readonly '~standard': {
    /**
     * Identificador do vendor/autor do schema.
     * Exemplo: 'ninots', 'zod', 'valibot'
     */
    readonly vendor: string;

    /**
     * Versão do formato do schema.
     * Para Standard Schema V1, deve ser '1.0.0' ou similar.
     */
    readonly version: string;

    /**
     * Formato do schema (ex: 'validation', 'serialization').
     */
    readonly format?: string;

    /**
     * Função de validação principal.
     * Pode ser síncrona ou assíncrona.
     */
    readonly validate: StandardSchemaValidateAsync<T, U> | StandardSchemaValidateSync<T, U>;
  };
}

/**
 * Tipo utilitário para extrair o tipo de entrada de um Standard Schema.
 *
 * @template S - Tipo do schema que estende StandardSchemaV1
 */
export type StandardSchemaInput<S extends StandardSchemaV1> = S extends StandardSchemaV1<infer T> ? T : never;

/**
 * Tipo utilitário para extrair o tipo de saída de um Standard Schema.
 *
 * @template S - Tipo do schema que estende StandardSchemaV1
 */
export type StandardSchemaOutput<S extends StandardSchemaV1> = S extends StandardSchemaV1<unknown, infer U> ? U : never;
