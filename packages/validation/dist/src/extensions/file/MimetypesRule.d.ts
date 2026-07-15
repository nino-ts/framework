/**
 * Regra para validação de MIME types de arquivo.
 *
 * @packageDocumentation
 * Valida se o arquivo tem um dos MIME types permitidos.
 */
import type { RuleResult, StandardSchemaRule, ValidationContext } from "../../contracts/StandardSchemaRule";
import type { FileLike } from "./ImageRule";
/**
 * Regra para validar MIME types de arquivo.
 *
 * @example
 * // Validação de PDF
 * const rule = new MimetypesRule(['application/pdf']);
 *
 * @example
 * // Múltiplos MIME types
 * const rule = new MimetypesRule(['image/jpeg', 'image/png', 'application/pdf']);
 */
export declare class MimetypesRule implements StandardSchemaRule<FileLike | null | undefined> {
    /**
     * Nome da regra.
     */
    readonly name = "mimetypes";
    /**
     * MIME types permitidos.
     */
    private allowedMimeTypes;
    /**
     * Cria uma nova instância da regra MimetypesRule.
     *
     * @param mimeTypes - Lista de MIME types permitidos
     */
    constructor(mimeTypes: string[]);
    /**
     * Executa a validação da regra.
     *
     * @param context - Contexto contendo o valor e metadados da validação
     * @returns Resultado da validação
     */
    validate(context: ValidationContext<FileLike | null | undefined>): RuleResult;
}
