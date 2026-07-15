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
export declare const EXTENSION_MIME_MAP: Record<string, string>;
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
export declare class MimesRule implements StandardSchemaRule<FileLike | null | undefined> {
    /**
     * Nome da regra.
     */
    readonly name = "mimes";
    /**
     * Extensões permitidas (normalizadas para lowercase).
     */
    private allowedExtensions;
    /**
     * Cria uma nova instância da regra MimesRule.
     *
     * @param extensions - Lista de extensões permitidas (sem o ponto)
     */
    constructor(extensions: string[]);
    /**
     * Executa a validação da regra.
     *
     * @param context - Contexto contendo o valor e metadados da validação
     * @returns Resultado da validação
     */
    validate(context: ValidationContext<FileLike | null | undefined>): RuleResult;
}
