/**
 * Regra para validação de arquivo de imagem.
 *
 * @packageDocumentation
 * Valida se o arquivo é uma imagem baseada no MIME type.
 * Suporta: jpg, jpeg, png, bmp, gif, webp
 */

import type { StandardSchemaRule, ValidationContext, RuleResult } from '../../contracts/StandardSchemaRule';

/**
 * MIME types de imagem suportados.
 */
export const IMAGE_MIME_TYPES = [
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/bmp',
    'image/gif',
    'image/webp',
] as const;

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
export class ImageRule implements StandardSchemaRule<FileLike | null | undefined> {
    /**
     * Nome da regra.
     */
    public readonly name = 'image';

    /**
     * MIME types permitidos.
     */
    private allowedMimeTypes: string[];

    /**
     * Cria uma nova instância da regra ImageRule.
     *
     * @param mimeTypes - MIME types permitidos (padrão: todos os tipos de imagem)
     */
    public constructor(mimeTypes?: string[]) {
        this.allowedMimeTypes = mimeTypes ?? [...IMAGE_MIME_TYPES];
    }

    /**
     * Executa a validação da regra.
     *
     * @param context - Contexto contendo o valor e metadados da validação
     * @returns Resultado da validação
     */
    public validate(context: ValidationContext<FileLike | null | undefined>): RuleResult {
        const value = context.value;

        // Se o valor for null ou undefined, considera válido (não required por padrão)
        if (value === null || value === undefined) {
            return { success: true };
        }

        // Verifica se é um objeto do tipo File/Blob
        if (typeof value !== 'object') {
            return {
                success: false,
                message: 'The file must be an image',
                code: 'image',
            };
        }

        const file = value as FileLike;

        // Verifica o MIME type
        const mimeType = file.type;

        if (!mimeType) {
            return {
                success: false,
                message: 'The file must be an image',
                code: 'image_no_mime',
            };
        }

        // Verifica se o MIME type é de imagem
        if (!this.allowedMimeTypes.includes(mimeType)) {
            return {
                success: false,
                message: `The file must be an image. Allowed types: ${this.allowedMimeTypes.join(', ')}`,
                code: 'image_invalid_mime',
            };
        }

        return { success: true };
    }
}
