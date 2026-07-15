/**
 * Regra para validação de dimensões de imagem.
 *
 * @packageDocumentation
 * Valida as dimensões (largura e altura) de uma imagem.
 * Suporta validação de largura/altura mínima, máxima e ratio.
 */
import type { RuleResult, StandardSchemaRule, ValidationContext } from "../../contracts/StandardSchemaRule";
import type { FileLike } from "./ImageRule";
/**
 * Interface para arquivo de imagem com dimensões.
 */
export interface ImageFile extends FileLike {
    /**
     * Largura da imagem em pixels.
     */
    width?: number;
    /**
     * Altura da imagem em pixels.
     */
    height?: number;
}
/**
 * Configuração de dimensões.
 */
export interface DimensionsConfig {
    /**
     * Largura mínima em pixels.
     */
    minWidth?: number;
    /**
     * Largura máxima em pixels.
     */
    maxWidth?: number;
    /**
     * Altura mínima em pixels.
     */
    minHeight?: number;
    /**
     * Altura máxima em pixels.
     */
    maxHeight?: number;
    /**
     * Ratio (proporção) esperada (width/height).
     */
    ratio?: number;
    /**
     * Tolerância para o ratio (padrão: 0.01).
     */
    ratioTolerance?: number;
}
/**
 * Regra para validar dimensões de imagem.
 *
 * @example
 * // Validação básica
 * const rule = new DimensionsRule({ minWidth: 100, minHeight: 100 });
 *
 * @example
 * // Validação completa
 * const rule = new DimensionsRule({
 *     minWidth: 100,
 *     maxWidth: 1920,
 *     minHeight: 100,
 *     maxHeight: 1080,
 *     ratio: 16/9
 * });
 */
export declare class DimensionsRule implements StandardSchemaRule<ImageFile | null | undefined> {
    /**
     * Nome da regra.
     */
    readonly name = "dimensions";
    /**
     * Configuração de dimensões.
     */
    private config;
    /**
     * Cria uma nova instância da regra DimensionsRule.
     *
     * @param config - Configuração de dimensões
     */
    constructor(config: DimensionsConfig);
    /**
     * Executa a validação da regra.
     *
     * @param context - Contexto contendo o valor e metadados da validação
     * @returns Resultado da validação
     */
    validate(context: ValidationContext<ImageFile | null | undefined>): RuleResult;
}
