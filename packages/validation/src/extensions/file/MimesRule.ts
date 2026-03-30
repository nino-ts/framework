/**
 * Regra para validação de extensões de arquivo.
 *
 * @packageDocumentation
 * Valida se o arquivo tem uma das extensões permitidas.
 * Diferente de mimetypes, esta regra verifica a extensão do nome do arquivo.
 */

import type { StandardSchemaRule, ValidationContext, RuleResult } from '../../contracts/StandardSchemaRule';
import type { FileLike } from './ImageRule';

/**
 * Mapeamento de extensões para MIME types comuns.
 */
export const EXTENSION_MIME_MAP: Record<string, string> = {
    jpg: 'image/jpeg',
    jpeg: 'image/jpeg',
    png: 'image/png',
    gif: 'image/gif',
    bmp: 'image/bmp',
    webp: 'image/webp',
    svg: 'image/svg+xml',
    pdf: 'application/pdf',
    doc: 'application/msword',
    docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    xls: 'application/vnd.ms-excel',
    xlsx: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    ppt: 'application/vnd.ms-powerpoint',
    pptx: 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    txt: 'text/plain',
    csv: 'text/csv',
    zip: 'application/zip',
    rar: 'application/vnd.rar',
    '7z': 'application/x-7z-compressed',
    mp3: 'audio/mpeg',
    mp4: 'video/mp4',
    avi: 'video/x-msvideo',
    mov: 'video/quicktime',
    mkv: 'video/x-matroska',
};

/**
 * Regra para validar extensões de arquivo.
 *
 * @example
 * // Validação de imagens
 * const rule = new MimesRule(['jpg', 'png', 'gif']);
 *
 * @example
 * // Validação de documentos
 * const rule = new MimesRule(['pdf', 'doc', 'docx']);
 */
export class MimesRule implements StandardSchemaRule<FileLike | null | undefined> {
    /**
     * Nome da regra.
     */
    public readonly name = 'mimes';

    /**
     * Extensões permitidas (normalizadas para lowercase).
     */
    private allowedExtensions: string[];

    /**
     * Cria uma nova instância da regra MimesRule.
     *
     * @param extensions - Lista de extensões permitidas (sem o ponto)
     */
    public constructor(extensions: string[]) {
        this.allowedExtensions = extensions.map((ext) => ext.toLowerCase().replace('.', ''));
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

        // Verifica se é um objeto
        if (typeof value !== 'object') {
            return {
                success: false,
                message: 'Invalid file',
                code: 'mimes_invalid_file',
            };
        }

        const file = value as FileLike;

        // Verifica o nome do arquivo
        const fileName = file.name;

        if (!fileName) {
            return {
                success: false,
                message: 'The file must have a name',
                code: 'mimes_no_name',
            };
        }

        // Extrai a extensão do arquivo
        const parts = fileName.split('.');
        if (parts.length < 2) {
            return {
                success: false,
                message: 'The file must have an extension',
                code: 'mimes_no_extension',
            };
        }

        const extension = parts[parts.length - 1];

        if (!extension) {
            return {
                success: false,
                message: 'The file must have an extension',
                code: 'mimes_no_extension',
            };
        }

        const normalizedExtension = extension.toLowerCase();

        // Verifica se a extensão está na lista de permitidas
        if (!this.allowedExtensions.includes(normalizedExtension)) {
            return {
                success: false,
                message: `The file must be one of the following types: ${this.allowedExtensions.join(', ')}`,
                code: 'mimes_not_allowed',
            };
        }

        return { success: true };
    }
}
