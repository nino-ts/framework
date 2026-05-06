/**
 * Regra para validação de dimensões de imagem.
 *
 * @packageDocumentation
 * Valida as dimensões (largura e altura) de uma imagem.
 * Suporta validação de largura/altura mínima, máxima e ratio.
 */

import type {
	RuleResult,
	StandardSchemaRule,
	ValidationContext,
} from "../../contracts/StandardSchemaRule";
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
export class DimensionsRule
	implements StandardSchemaRule<ImageFile | null | undefined>
{
	/**
	 * Nome da regra.
	 */
	public readonly name = "dimensions";

	/**
	 * Configuração de dimensões.
	 */
	private config: DimensionsConfig;

	/**
	 * Cria uma nova instância da regra DimensionsRule.
	 *
	 * @param config - Configuração de dimensões
	 */
	public constructor(config: DimensionsConfig) {
		this.config = config;
	}

	/**
	 * Executa a validação da regra.
	 *
	 * @param context - Contexto contendo o valor e metadados da validação
	 * @returns Resultado da validação
	 */
	public validate(
		context: ValidationContext<ImageFile | null | undefined>,
	): RuleResult {
		const value = context.value;

		// Se o valor for null ou undefined, considera válido (não required por padrão)
		if (value === null || value === undefined) {
			return { success: true };
		}

		// Verifica se é um objeto
		if (typeof value !== "object") {
			return {
				code: "dimensions_invalid_file",
				message: "The file must be an image",
				success: false,
			};
		}

		const image = value as ImageFile;

		// Verifica largura mínima
		if (
			this.config.minWidth !== undefined &&
			(image.width === undefined || image.width < this.config.minWidth)
		) {
			return {
				code: "dimensions_min_width",
				message: `The image width must be at least ${this.config.minWidth} pixels`,
				success: false,
			};
		}

		// Verifica largura máxima
		if (
			this.config.maxWidth !== undefined &&
			(image.width === undefined || image.width > this.config.maxWidth)
		) {
			return {
				code: "dimensions_max_width",
				message: `The image width must not be greater than ${this.config.maxWidth} pixels`,
				success: false,
			};
		}

		// Verifica altura mínima
		if (
			this.config.minHeight !== undefined &&
			(image.height === undefined || image.height < this.config.minHeight)
		) {
			return {
				code: "dimensions_min_height",
				message: `The image height must be at least ${this.config.minHeight} pixels`,
				success: false,
			};
		}

		// Verifica altura máxima
		if (
			this.config.maxHeight !== undefined &&
			(image.height === undefined || image.height > this.config.maxHeight)
		) {
			return {
				code: "dimensions_max_height",
				message: `The image height must not be greater than ${this.config.maxHeight} pixels`,
				success: false,
			};
		}

		// Verifica ratio
		if (
			this.config.ratio !== undefined &&
			image.width !== undefined &&
			image.height !== undefined
		) {
			const actualRatio = image.width / image.height;
			const tolerance = this.config.ratioTolerance ?? 0.01;
			const ratioDiff = Math.abs(actualRatio - this.config.ratio);

			if (ratioDiff > tolerance) {
				return {
					code: "dimensions_ratio",
					message: `The image must have a ratio of ${this.config.ratio}`,
					success: false,
				};
			}
		}

		return { success: true };
	}
}
