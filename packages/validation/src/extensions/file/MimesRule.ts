/**
 * Regra para validação de extensões de arquivo.
 *
 * @packageDocumentation
 * Valida se o arquivo tem uma das extensões permitidas.
 * Diferente de mimetypes, esta regra verifica a extensão do nome do arquivo.
 */

import type { RuleResult, StandardSchemaRule, ValidationContext } from "../../contracts/StandardSchemaRule";
import type { FileLike } from "./ImageRule";

/**
 * Mapeamento de extensões para MIME types comuns.
 */
export const EXTENSION_MIME_MAP: Record<string, string> = {
    "7z": "application/x-7z-compressed",
    avi: "video/x-msvideo",
    bmp: "image/bmp",
    csv: "text/csv",
    doc: "application/msword",
    docx: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    gif: "image/gif",
    jpeg: "image/jpeg",
    jpg: "image/jpeg",
    mkv: "video/x-matroska",
    mov: "video/quicktime",
    mp3: "audio/mpeg",
    mp4: "video/mp4",
    pdf: "application/pdf",
    png: "image/png",
    ppt: "application/vnd.ms-powerpoint",
    pptx: "application/vnd.openxmlformats-officedocument.presentationml.presentation",
    rar: "application/vnd.rar",
    svg: "image/svg+xml",
    txt: "text/plain",
    webp: "image/webp",
    xls: "application/vnd.ms-excel",
    xlsx: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    zip: "application/zip",
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
    public readonly name = "mimes";

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
        this.allowedExtensions = extensions.map((ext) => ext.toLowerCase().replace(".", ""));
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
        if (typeof value !== "object") {
            return {
                code: "mimes_invalid_file",
                message: "Invalid file",
                success: false,
            };
        }

        const file = value as FileLike;

        // Verifica o nome do arquivo
        const fileName = file.name;

        if (!fileName) {
            return {
                code: "mimes_no_name",
                message: "The file must have a name",
                success: false,
            };
        }

        // Extrai a extensão do arquivo
        const parts = fileName.split(".");
        if (parts.length < 2) {
            return {
                code: "mimes_no_extension",
                message: "The file must have an extension",
                success: false,
            };
        }

        const extension = parts[parts.length - 1];

        if (!extension) {
            return {
                code: "mimes_no_extension",
                message: "The file must have an extension",
                success: false,
            };
        }

        const normalizedExtension = extension.toLowerCase();

        // Verifica se a extensão está na lista de permitidas
        if (!this.allowedExtensions.includes(normalizedExtension)) {
            return {
                code: "mimes_not_allowed",
                message: `The file must be one of the following types: ${this.allowedExtensions.join(", ")}`,
                success: false,
            };
        }

        return { success: true };
    }
}
