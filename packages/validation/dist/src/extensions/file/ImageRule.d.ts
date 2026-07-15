/**
 * Regra para validação de arquivo de imagem.
 *
 * @packageDocumentation
 * Valida se o arquivo é uma imagem baseada no MIME type.
 * Suporta: jpg, jpeg, png, bmp, gif, webp
 */
import type { RuleResult, StandardSchemaRule, ValidationContext } from "../../contracts/StandardSchemaRule";
/**
 * MIME types de imagem suportados.
 */
export declare const IMAGE_MIME_TYPES: readonly ["image/jpeg", "image/jpg", "image/png", "image/bmp", "image/gif", "image/webp"];
/**
 * Tipo para MIME types de imagem.
 */
export type ImageMimeType = (typeof IMAGE_MIME_TYPES)[number];
/**
 * Interface para arquivo sendo validado.
 */
export interface FileLike {
    /**
     * Nome do arquivo.
     */
    name?: string;
    /**
     * MIME type do arquivo.
     */
    type?: string;
    /**
     * Tamanho do arquivo em bytes.
     */
    size?: number;
}
/**
 * Regra para validar se o arquivo é uma imagem.
 *
 * @example
 * // Validação básica de imagem
 * const rule = new ImageRule();
 *
 * @example
 * // Com MIME types específicos
 * const rule = new ImageRule(['image/jpeg', 'image/png']);
 */
export declare class ImageRule implements StandardSchemaRule<FileLike | null | undefined> {
    /**
     * Nome da regra.
     */
    readonly name = "image";
    /**
     * MIME types permitidos.
     */
    private allowedMimeTypes;
    /**
     * Cria uma nova instância da regra ImageRule.
     *
     * @param mimeTypes - MIME types permitidos (padrão: todos os tipos de imagem)
     */
    constructor(mimeTypes?: string[]);
    /**
     * Executa a validação da regra.
     *
     * @param context - Contexto contendo o valor e metadados da validação
     * @returns Resultado da validação
     */
    validate(context: ValidationContext<FileLike | null | undefined>): RuleResult;
}
