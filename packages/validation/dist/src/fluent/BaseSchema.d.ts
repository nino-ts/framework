/**
 * Classe base abstrata para todos os schemas fluentes.
 *
 * @packageDocumentation
 * Implementa a interface StandardSchemaV1 e fornece funcionalidades
 * comuns para todos os tipos de schema (string, number, boolean, etc.).
 */
import type { StandardSchemaRule } from "../contracts/StandardSchemaRule";
import type { StandardSchemaFailureResult, StandardSchemaIssue, StandardSchemaSuccessResult, StandardSchemaV1 } from "../types";
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
export declare const DEFAULT_NULLABILITY: NullabilityConfig;
/**
 * Classe base abstrata para todos os schemas fluentes.
 *
 * @template TInput - Tipo de entrada esperado pelo schema
 * @template TOutput - Tipo de saída após validação e transformação
 */
export declare abstract class BaseSchema<TInput = unknown, TOutput = TInput> implements StandardSchemaV1<TInput, TOutput> {
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
    protected constructor();
    /**
     * Implementação do contrato StandardSchemaV1.
     * Namespace obrigatório para identificação como Standard Schema.
     */
    readonly "~standard": {
        readonly format: "validation";
        readonly validate: (value: TInput) => StandardSchemaSuccessResult<TOutput> | StandardSchemaFailureResult<TInput>;
        readonly vendor: "ninots";
        readonly version: "1.0.0";
    };
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
    validate(value: TInput): StandardSchemaSuccessResult<TOutput> | StandardSchemaFailureResult<TInput>;
    /**
     * Valida a nullabilidade do valor (required/optional/nullable).
     *
     * @param value - Valor a ser verificado
     * @returns Resultado da verificação
     */
    protected validateNullability(value: unknown): {
        success: true;
    } | {
        success: false;
        issue: StandardSchemaIssue;
    };
    /**
     * Marca o campo como obrigatório (não pode ser undefined).
     *
     * @returns Este schema para chaining
     * @example
     * v.string().required()
     */
    required(): this;
    /**
     * Marca o campo como opcional (pode ser undefined).
     *
     * @returns Este schema para chaining
     * @example
     * v.string().optional()
     */
    optional(): this;
    /**
     * Marca o campo como nullable (pode ser null).
     *
     * @returns Este schema para chaining
     * @example
     * v.string().nullable()
     */
    nullable(): this;
    /**
     * Adiciona uma regra de validação ao schema.
     *
     * @param rule - Regra a ser adicionada
     * @returns Este schema para chaining
     */
    protected addRule(rule: StandardSchemaRule<unknown, unknown>): this;
}
