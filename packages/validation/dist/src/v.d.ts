/**
 * Entrypoint da API Fluente do Ninots Validation.
 *
 * @packageDocumentation
 * Fornece a interface principal `v` para construção de schemas de validação.
 * Esta é a API primária recomendada para validação no framework Ninots.
 *
 * @example
 * // Validação simples de string
 * const schema = v.string().required().email();
 * const result = schema.validate('user@example.com');
 *
 * @example
 * // Validação de objeto complexo
 * const userSchema = v.object({
 *     name: v.string().required().min(2),
 *     email: v.string().email(),
 *     age: v.number().min(0).optional(),
 *     roles: v.array(v.string()).min(1),
 * });
 *
 * @example
 * // Type inference
 * type UserInput = InferInput<typeof userSchema>;
 * type UserOutput = InferOutput<typeof userSchema>;
 */
import { ArraySchema } from "./fluent/ArraySchema";
import { BooleanSchema } from "./fluent/BooleanSchema";
import { NumberSchema } from "./fluent/NumberSchema";
import { ObjectSchema } from "./fluent/ObjectSchema";
import { StringSchema } from "./fluent/StringSchema";
import type { StandardSchemaV1 } from "./types";
/**
 * Objeto namespace para a API fluente de validação.
 *
 * @example
 * // String validation
 * v.string().required().min(3).max(50)
 *
 * // Number validation
 * v.number().required().min(0).max(100)
 *
 * // Boolean validation
 * v.boolean().required()
 *
 * // Array validation
 * v.array(v.string().email()).min(1)
 *
 * // Object validation
 * v.object({
 *     name: v.string().required(),
 *     age: v.number().min(0).optional(),
 * })
 */
export declare const v: {
    /**
     * Cria uma regra active_url.
     *
     * @returns Instância da regra ActiveUrlRule
     */
    readonly activeUrl: () => any;
    /**
     * Cria uma regra after.
     *
     * @param dateOrField - Data ou campo para comparar
     * @returns Instância da regra AfterRule
     */
    readonly after: (dateOrField: string) => any;
    /**
     * Cria uma regra after_or_equal.
     *
     * @param dateOrField - Data ou campo para comparar
     * @returns Instância da regra AfterOrEqualRule
     */
    readonly afterOrEqual: (dateOrField: string) => any;
    /**
     * Cria uma regra alpha.
     *
     * @returns Instância da regra AlphaRule
     */
    readonly alpha: () => any;
    /**
     * Cria uma regra alpha_dash.
     *
     * @returns Instância da regra AlphaDashRule
     */
    readonly alphaDash: () => any;
    /**
     * Cria uma regra alpha_num.
     *
     * @returns Instância da regra AlphaNumRule
     */
    readonly alphaNum: () => any;
    /**
     * Cria um schema para validação de arrays.
     *
     * @template T - Tipo dos itens do array (opcional, inferido do schema)
     * @param itemSchema - Schema opcional para validar cada item do array
     * @returns ArraySchema para chaining fluente
     * @example
     * v.array(v.string().email())
     * @example
     * v.array().min(1).max(10)
     */
    readonly array: <T = unknown>(itemSchema?: StandardSchemaV1<T>) => ArraySchema<T>;
    /**
     * Cria uma regra bail.
     *
     * @returns Instância da regra BailRule
     */
    readonly bail: () => any;
    /**
     * Cria uma regra before.
     *
     * @param dateOrField - Data ou campo para comparar
     * @returns Instância da regra BeforeRule
     */
    readonly before: (dateOrField: string) => any;
    /**
     * Cria uma regra before_or_equal.
     *
     * @param dateOrField - Data ou campo para comparar
     * @returns Instância da regra BeforeOrEqualRule
     */
    readonly beforeOrEqual: (dateOrField: string) => any;
    /**
     * Cria um schema para validação de booleanos.
     *
     * @returns BooleanSchema para chaining fluente
     * @example
     * v.boolean().required()
     * @example
     * v.boolean().optional()
     */
    readonly boolean: () => BooleanSchema;
    /**
     * Cria uma regra confirmed.
     *
     * @param confirmationSuffix - Sufixo do campo de confirmação (padrão: 'confirmation')
     * @returns Instância da regra ConfirmedRule
     */
    readonly confirmed: (confirmationSuffix?: string) => any;
    /**
     * Cria uma regra current_password.
     *
     * @returns Instância da regra CurrentPasswordRule
     */
    readonly currentPassword: () => any;
    /**
     * Cria uma regra date_equals.
     *
     * @param dateOrField - Data ou campo para comparar
     * @returns Instância da regra DateEqualsRule
     */
    readonly dateEquals: (dateOrField: string) => any;
    /**
     * Cria uma regra date_format.
     *
     * @param format - Formato da data
     * @returns Instância da regra DateFormatRule
     */
    readonly dateFormat: (format: string) => any;
    /**
     * Cria uma regra different.
     *
     * @param field - Campo para comparar
     * @returns Instância da regra DifferentRule
     */
    readonly different: (field: string) => any;
    /**
     * Cria uma regra digits_between.
     *
     * @param min - Mínimo de dígitos
     * @param max - Máximo de dígitos
     * @returns Instância da regra DigitsBetweenRule
     */
    readonly digitsBetween: (min: number, max: number) => any;
    /**
     * Cria uma regra dimensions.
     *
     * @param config - Configuração de dimensões
     * @returns Instância da regra DimensionsRule
     */
    readonly dimensions: (config: {
        minWidth?: number;
        maxWidth?: number;
        minHeight?: number;
        maxHeight?: number;
        ratio?: number;
        ratioTolerance?: number;
    }) => any;
    /**
     * Cria uma regra distinct.
     *
     * @returns Instância da regra DistinctRule
     */
    readonly distinct: () => any;
    /**
     * Cria uma regra doesnt_end_with.
     *
     * @param values - Valores proibidos no fim
     * @returns Instância da regra DoesntEndWithRule
     */
    readonly doesntEndWith: (...values: string[]) => any;
    /**
     * Cria uma regra doesnt_start_with.
     *
     * @param values - Valores proibidos no início
     * @returns Instância da regra DoesntStartWithRule
     */
    readonly doesntStartWith: (...values: string[]) => any;
    /**
     * Cria uma regra exclude_if.
     *
     * @param field - Campo para verificar
     * @param value - Valor que dispara a exclusão
     * @returns Instância da regra ExcludeIfRule
     */
    readonly excludeIf: (field: string, value: unknown) => any;
    /**
     * Cria uma regra para validar existência em banco de dados.
     *
     * @param table - Nome da tabela
     * @param column - Nome da coluna (opcional)
     * @returns Instância da regra ExistsRule
     * @example
     * v.exists('users', 'email')
     */
    readonly exists: (table: string, column?: string) => any;
    /**
     * Cria uma regra filled.
     *
     * @returns Instância da regra FilledRule
     */
    readonly filled: () => any;
    /**
     * Cria uma regra image.
     *
     * @param mimeTypes - MIME types permitidos (opcional)
     * @returns Instância da regra ImageRule
     */
    readonly image: (mimeTypes?: string[]) => any;
    /**
     * Cria uma regra in_array.
     *
     * @param field - Campo que contém o array
     * @returns Instância da regra InArrayRule
     */
    readonly inArray: (field: string) => any;
    /**
     * Cria uma regra in_array_keys.
     *
     * @param keys - Chaves para verificar
     * @returns Instância da regra InArrayKeysRule
     */
    readonly inArrayKeys: (...keys: string[]) => any;
    /**
     * Cria uma regra list.
     *
     * @returns Instância da regra ListRule
     */
    readonly list: () => any;
    /**
     * Cria uma regra max_digits.
     *
     * @param max - Máximo de dígitos
     * @returns Instância da regra MaxDigitsRule
     */
    readonly maxDigits: (max: number) => any;
    /**
     * Cria uma regra mimes.
     *
     * @param extensions - Extensões permitidas
     * @returns Instância da regra MimesRule
     */
    readonly mimes: (...extensions: string[]) => any;
    /**
     * Cria uma regra mimetypes.
     *
     * @param mimeTypes - MIME types permitidos
     * @returns Instância da regra MimetypesRule
     */
    readonly mimetypes: (...mimeTypes: string[]) => any;
    /**
     * Cria uma regra min_digits.
     *
     * @param min - Mínimo de dígitos
     * @returns Instância da regra MinDigitsRule
     */
    readonly minDigits: (min: number) => any;
    /**
     * Cria uma regra missing.
     *
     * @returns Instância da regra MissingRule
     */
    readonly missing: () => any;
    /**
     * Cria uma regra missing_if.
     *
     * @param field - Campo para verificar
     * @param value - Valor que dispara a ausência
     * @returns Instância da regra MissingIfRule
     */
    readonly missingIf: (field: string, value: unknown) => any;
    /**
     * Cria uma regra missing_unless.
     *
     * @param field - Campo para verificar
     * @param value - Valor que dispensa a ausência
     * @returns Instância da regra MissingUnlessRule
     */
    readonly missingUnless: (field: string, value: unknown) => any;
    /**
     * Cria uma regra missing_with.
     *
     * @param field - Campo para verificar presença
     * @returns Instância da regra MissingWithRule
     */
    readonly missingWith: (field: string) => any;
    /**
     * Cria uma regra missing_with_all.
     *
     * @param fields - Campos para verificar presença
     * @returns Instância da regra MissingWithAllRule
     */
    readonly missingWithAll: (...fields: string[]) => any;
    /**
     * Cria uma regra multiple_of.
     *
     * @param divisor - Divisor para múltiplo
     * @returns Instância da regra MultipleOfRule
     */
    readonly multipleOf: (divisor: number) => any;
    /**
     * Cria uma regra not_in.
     *
     * @param values - Valores proibidos
     * @returns Instância da regra NotInRule
     */
    readonly notIn: (...values: unknown[]) => any;
    /**
     * Cria uma regra not_regex.
     *
     * @param pattern - Padrão regex proibido
     * @returns Instância da regra NotRegexRule
     */
    readonly notRegex: (pattern: RegExp) => any;
    /**
     * Cria um schema para validação de números.
     *
     * @returns NumberSchema para chaining fluente
     * @example
     * v.number().required().min(0).max(100)
     * @example
     * v.number().positive().integer()
     */
    readonly number: () => NumberSchema;
    /**
     * Cria um schema para validação de objetos.
     *
     * @template T - Shape do objeto com schemas para cada propriedade
     * @param shape - Objeto definindo schemas para cada propriedade
     * @returns ObjectSchema para chaining fluente
     * @example
     * v.object({
     *     name: v.string().required(),
     *     email: v.string().email(),
     * })
     */
    readonly object: <T extends Record<string, StandardSchemaV1>>(shape: T) => ObjectSchema<T>;
    /**
     * Cria uma regra para validação de senha com chaining.
     *
     * @returns Instância da regra PasswordRule para chaining
     * @example
     * v.password().min(8).letters().mixedCase().numbers().symbols()
     */
    readonly password: () => any;
    /**
     * Cria uma regra present.
     *
     * @returns Instância da regra PresentRule
     */
    readonly present: () => any;
    /**
     * Cria uma regra present_if.
     *
     * @param field - Campo para verificar
     * @param value - Valor que dispara a presença
     * @returns Instância da regra PresentIfRule
     */
    readonly presentIf: (field: string, value: unknown) => any;
    /**
     * Cria uma regra present_unless.
     *
     * @param field - Campo para verificar
     * @param value - Valor que dispensa a presença
     * @returns Instância da regra PresentUnlessRule
     */
    readonly presentUnless: (field: string, value: unknown) => any;
    /**
     * Cria uma regra prohibited_if.
     *
     * @param field - Campo para verificar
     * @param value - Valor que dispara a proibição
     * @returns Instância da regra ProhibitedIfRule
     */
    readonly prohibitedIf: (field: string, value: unknown) => any;
    /**
     * Cria uma regra prohibited_unless.
     *
     * @param field - Campo para verificar
     * @param value - Valor que dispensa a proibição
     * @returns Instância da regra ProhibitedUnlessRule
     */
    readonly prohibitedUnless: (field: string, value: unknown) => any;
    /**
     * Cria uma regra required_array_keys.
     *
     * @param keys - Chaves requeridas
     * @returns Instância da regra RequiredArrayKeysRule
     */
    readonly requiredArrayKeys: (...keys: string[]) => any;
    /**
     * Cria uma regra required_if.
     *
     * @param field - Campo para verificar
     * @param value - Valor que dispara o required
     * @returns Instância da regra RequiredIfRule
     */
    readonly requiredIf: (field: string, value: unknown) => any;
    /**
     * Cria uma regra required_unless.
     *
     * @param field - Campo para verificar
     * @param value - Valor que dispensa o required
     * @returns Instância da regra RequiredUnlessRule
     */
    readonly requiredUnless: (field: string, value: unknown) => any;
    /**
     * Cria uma regra required_with.
     *
     * @param field - Campo para verificar presença
     * @returns Instância da regra RequiredWithRule
     */
    readonly requiredWith: (field: string) => any;
    /**
     * Cria uma regra required_without.
     *
     * @param field - Campo para verificar ausência
     * @returns Instância da regra RequiredWithoutRule
     */
    readonly requiredWithout: (field: string) => any;
    /**
     * Cria uma regra same.
     *
     * @param field - Campo para comparar
     * @returns Instância da regra SameRule
     */
    readonly same: (field: string) => any;
    /**
     * Cria um schema para validação de strings.
     *
     * @returns StringSchema para chaining fluente
     * @example
     * v.string().required().email()
     * @example
     * v.string().min(3).max(255).uuid()
     */
    readonly string: () => StringSchema;
    /**
     * Cria uma regra timezone.
     *
     * @returns Instância da regra TimezoneRule
     */
    readonly timezone: () => any;
    /**
     * Cria uma regra para validar unicidade em banco de dados.
     *
     * @param table - Nome da tabela
     * @param column - Nome da coluna (opcional)
     * @param ignoreId - ID a ignorar (opcional, para updates)
     * @returns Instância da regra UniqueRule
     * @example
     * v.unique('users', 'email')
     * @example
     * v.unique('users', 'email', userId)
     */
    readonly unique: (table: string, column?: string, ignoreId?: number | string) => any;
};
export { ArraySchema } from "./fluent/ArraySchema";
export { BaseSchema } from "./fluent/BaseSchema";
export { BooleanSchema } from "./fluent/BooleanSchema";
export { NumberSchema } from "./fluent/NumberSchema";
export { ObjectSchema } from "./fluent/ObjectSchema";
/**
 * Re-exporta schemas individuais para uso direto.
 */
export { StringSchema } from "./fluent/StringSchema";
/**
 * Re-exporta tipos do Standard Schema.
 */
export type { StandardSchemaFailureResult, StandardSchemaInput, StandardSchemaIssue, StandardSchemaOutput, StandardSchemaSuccessResult, StandardSchemaV1, } from "./types";
/**
 * Re-exporta tipos utilitários para type inference.
 */
export type { InferInput, InferOutput } from "./utilities";
/**
 * Re-exporta função utilitária de verificação.
 */
export { isStandardSchema } from "./utilities";
