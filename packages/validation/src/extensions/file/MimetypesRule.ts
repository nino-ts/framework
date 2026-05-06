/**
 * Regra para validação de MIME types de arquivo.
 *
 * @packageDocumentation
 * Valida se o arquivo tem um dos MIME types permitidos.
 */

import type {
	RuleResult,
	StandardSchemaRule,
	ValidationContext,
} from "../../contracts/StandardSchemaRule";
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
export class MimetypesRule
	implements StandardSchemaRule<FileLike | null | undefined>
{
	/**
	 * Nome da regra.
	 */
	public readonly name = "mimetypes";

	/**
	 * MIME types permitidos.
	 */
	private allowedMimeTypes: string[];

	/**
	 * Cria uma nova instância da regra MimetypesRule.
	 *
	 * @param mimeTypes - Lista de MIME types permitidos
	 */
	public constructor(mimeTypes: string[]) {
		this.allowedMimeTypes = mimeTypes;
	}

	/**
	 * Executa a validação da regra.
	 *
	 * @param context - Contexto contendo o valor e metadados da validação
	 * @returns Resultado da validação
	 */
	public validate(
		context: ValidationContext<FileLike | null | undefined>,
	): RuleResult {
		const value = context.value;

		// Se o valor for null ou undefined, considera válido (não required por padrão)
		if (value === null || value === undefined) {
			return { success: true };
		}

		// Verifica se é um objeto
		if (typeof value !== "object") {
			return {
				code: "mimetypes_invalid_file",
				message: "Invalid file",
				success: false,
			};
		}

		const file = value as FileLike;

		// Verifica o MIME type
		const mimeType = file.type;

		if (!mimeType) {
			return {
				code: "mimetypes_no_mime",
				message: "The file must have a valid MIME type",
				success: false,
			};
		}

		// Verifica se o MIME type está na lista de permitidos
		if (!this.allowedMimeTypes.includes(mimeType)) {
			return {
				code: "mimetypes_not_allowed",
				message: `The file must be one of the following types: ${this.allowedMimeTypes.join(", ")}`,
				success: false,
			};
		}

		return { success: true };
	}
}
