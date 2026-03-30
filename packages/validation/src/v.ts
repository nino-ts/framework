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

import { StringSchema } from './fluent/StringSchema';
import { NumberSchema } from './fluent/NumberSchema';
import { BooleanSchema } from './fluent/BooleanSchema';
import { ArraySchema } from './fluent/ArraySchema';
import { ObjectSchema } from './fluent/ObjectSchema';
import type { StandardSchemaV1 } from './types';

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
export const v = {
    /**
     * Cria um schema para validação de strings.
     *
     * @returns StringSchema para chaining fluente
     * @example
     * v.string().required().email()
     * @example
     * v.string().min(3).max(255).uuid()
     */
    string: (): StringSchema => new StringSchema(),

    /**
     * Cria um schema para validação de números.
     *
     * @returns NumberSchema para chaining fluente
     * @example
     * v.number().required().min(0).max(100)
     * @example
     * v.number().positive().integer()
     */
    number: (): NumberSchema => new NumberSchema(),

    /**
     * Cria um schema para validação de booleanos.
     *
     * @returns BooleanSchema para chaining fluente
     * @example
     * v.boolean().required()
     * @example
     * v.boolean().optional()
     */
    boolean: (): BooleanSchema => new BooleanSchema(),

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
    array: <T = unknown>(itemSchema?: StandardSchemaV1<T>): ArraySchema<T> => new ArraySchema(itemSchema),

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
    object: <T extends Record<string, StandardSchemaV1>>(shape: T): ObjectSchema<T> => new ObjectSchema(shape),

    // ========================================
    // Regras de Database
    // ========================================

    /**
     * Cria uma regra para validar existência em banco de dados.
     *
     * @param table - Nome da tabela
     * @param column - Nome da coluna (opcional)
     * @returns Instância da regra ExistsRule
     * @example
     * v.exists('users', 'email')
     */
    exists: (table: string, column?: string) => {
        const { ExistsRule } = require('./extensions/database/ExistsRule');
        return new ExistsRule(table, column);
    },

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
    unique: (table: string, column?: string, ignoreId?: number | string) => {
        const { UniqueRule } = require('./extensions/database/UniqueRule');
        return new UniqueRule(table, column, ignoreId);
    },

    // ========================================
    // Regra de Password
    // ========================================

    /**
     * Cria uma regra para validação de senha com chaining.
     *
     * @returns Instância da regra PasswordRule para chaining
     * @example
     * v.password().min(8).letters().mixedCase().numbers().symbols()
     */
    password: () => {
        const { PasswordRule } = require('./extensions/password/PasswordRule');
        return new PasswordRule();
    },

    // ========================================
    // Regras Condicionais
    // ========================================

    /**
     * Cria uma regra required_if.
     *
     * @param field - Campo para verificar
     * @param value - Valor que dispara o required
     * @returns Instância da regra RequiredIfRule
     */
    requiredIf: (field: string, value: unknown) => {
        const { RequiredIfRule } = require('./extensions/conditional/RequiredIfRule');
        return new RequiredIfRule(field, value);
    },

    /**
     * Cria uma regra required_unless.
     *
     * @param field - Campo para verificar
     * @param value - Valor que dispensa o required
     * @returns Instância da regra RequiredUnlessRule
     */
    requiredUnless: (field: string, value: unknown) => {
        const { RequiredUnlessRule } = require('./extensions/conditional/RequiredUnlessRule');
        return new RequiredUnlessRule(field, value);
    },

    /**
     * Cria uma regra required_with.
     *
     * @param field - Campo para verificar presença
     * @returns Instância da regra RequiredWithRule
     */
    requiredWith: (field: string) => {
        const { RequiredWithRule } = require('./extensions/conditional/RequiredWithRule');
        return new RequiredWithRule(field);
    },

    /**
     * Cria uma regra required_without.
     *
     * @param field - Campo para verificar ausência
     * @returns Instância da regra RequiredWithoutRule
     */
    requiredWithout: (field: string) => {
        const { RequiredWithoutRule } = require('./extensions/conditional/RequiredWithoutRule');
        return new RequiredWithoutRule(field);
    },

    /**
     * Cria uma regra prohibited_if.
     *
     * @param field - Campo para verificar
     * @param value - Valor que dispara a proibição
     * @returns Instância da regra ProhibitedIfRule
     */
    prohibitedIf: (field: string, value: unknown) => {
        const { ProhibitedIfRule } = require('./extensions/conditional/ProhibitedIfRule');
        return new ProhibitedIfRule(field, value);
    },

    /**
     * Cria uma regra prohibited_unless.
     *
     * @param field - Campo para verificar
     * @param value - Valor que dispensa a proibição
     * @returns Instância da regra ProhibitedUnlessRule
     */
    prohibitedUnless: (field: string, value: unknown) => {
        const { ProhibitedUnlessRule } = require('./extensions/conditional/ProhibitedUnlessRule');
        return new ProhibitedUnlessRule(field, value);
    },

    /**
     * Cria uma regra exclude_if.
     *
     * @param field - Campo para verificar
     * @param value - Valor que dispara a exclusão
     * @returns Instância da regra ExcludeIfRule
     */
    excludeIf: (field: string, value: unknown) => {
        const { ExcludeIfRule } = require('./extensions/conditional/ExcludeIfRule');
        return new ExcludeIfRule(field, value);
    },

    /**
     * Cria uma regra bail.
     *
     * @returns Instância da regra BailRule
     */
    bail: () => {
        const { BailRule } = require('./extensions/conditional/BailRule');
        return new BailRule();
    },

    // ========================================
    // Regras Missing
    // ========================================

    /**
     * Cria uma regra missing.
     *
     * @returns Instância da regra MissingRule
     */
    missing: () => {
        const { MissingRule } = require('./extensions/conditional/MissingRule');
        return new MissingRule();
    },

    /**
     * Cria uma regra missing_if.
     *
     * @param field - Campo para verificar
     * @param value - Valor que dispara a ausência
     * @returns Instância da regra MissingIfRule
     */
    missingIf: (field: string, value: unknown) => {
        const { MissingIfRule } = require('./extensions/conditional/MissingIfRule');
        return new MissingIfRule(field, value);
    },

    /**
     * Cria uma regra missing_unless.
     *
     * @param field - Campo para verificar
     * @param value - Valor que dispensa a ausência
     * @returns Instância da regra MissingUnlessRule
     */
    missingUnless: (field: string, value: unknown) => {
        const { MissingUnlessRule } = require('./extensions/conditional/MissingUnlessRule');
        return new MissingUnlessRule(field, value);
    },

    /**
     * Cria uma regra missing_with.
     *
     * @param field - Campo para verificar presença
     * @returns Instância da regra MissingWithRule
     */
    missingWith: (field: string) => {
        const { MissingWithRule } = require('./extensions/conditional/MissingWithRule');
        return new MissingWithRule(field);
    },

    /**
     * Cria uma regra missing_with_all.
     *
     * @param fields - Campos para verificar presença
     * @returns Instância da regra MissingWithAllRule
     */
    missingWithAll: (...fields: string[]) => {
        const { MissingWithAllRule } = require('./extensions/conditional/MissingWithAllRule');
        return new MissingWithAllRule(fields);
    },

    // ========================================
    // Regras de File
    // ========================================

    /**
     * Cria uma regra image.
     *
     * @param mimeTypes - MIME types permitidos (opcional)
     * @returns Instância da regra ImageRule
     */
    image: (mimeTypes?: string[]) => {
        const { ImageRule } = require('./extensions/file/ImageRule');
        return new ImageRule(mimeTypes);
    },

    /**
     * Cria uma regra dimensions.
     *
     * @param config - Configuração de dimensões
     * @returns Instância da regra DimensionsRule
     */
    dimensions: (config: {
        minWidth?: number;
        maxWidth?: number;
        minHeight?: number;
        maxHeight?: number;
        ratio?: number;
        ratioTolerance?: number;
    }) => {
        const { DimensionsRule } = require('./extensions/file/DimensionsRule');
        return new DimensionsRule(config);
    },

    /**
     * Cria uma regra mimetypes.
     *
     * @param mimeTypes - MIME types permitidos
     * @returns Instância da regra MimetypesRule
     */
    mimetypes: (...mimeTypes: string[]) => {
        const { MimetypesRule } = require('./extensions/file/MimetypesRule');
        return new MimetypesRule(mimeTypes);
    },

    /**
     * Cria uma regra mimes.
     *
     * @param extensions - Extensões permitidas
     * @returns Instância da regra MimesRule
     */
    mimes: (...extensions: string[]) => {
        const { MimesRule } = require('./extensions/file/MimesRule');
        return new MimesRule(extensions);
    },

    // ========================================
    // Regras Cross-Field
    // ========================================

    /**
     * Cria uma regra confirmed.
     *
     * @param confirmationSuffix - Sufixo do campo de confirmação (padrão: 'confirmation')
     * @returns Instância da regra ConfirmedRule
     */
    confirmed: (confirmationSuffix?: string) => {
        const { ConfirmedRule } = require('./extensions/cross-field/ConfirmedRule');
        return new ConfirmedRule(confirmationSuffix);
    },

    /**
     * Cria uma regra same.
     *
     * @param field - Campo para comparar
     * @returns Instância da regra SameRule
     */
    same: (field: string) => {
        const { SameRule } = require('./extensions/cross-field/SameRule');
        return new SameRule(field);
    },

    /**
     * Cria uma regra different.
     *
     * @param field - Campo para comparar
     * @returns Instância da regra DifferentRule
     */
    different: (field: string) => {
        const { DifferentRule } = require('./extensions/cross-field/DifferentRule');
        return new DifferentRule(field);
    },

    /**
     * Cria uma regra after.
     *
     * @param dateOrField - Data ou campo para comparar
     * @returns Instância da regra AfterRule
     */
    after: (dateOrField: string) => {
        const { AfterRule } = require('./extensions/cross-field/AfterRule');
        return new AfterRule(dateOrField);
    },

    /**
     * Cria uma regra after_or_equal.
     *
     * @param dateOrField - Data ou campo para comparar
     * @returns Instância da regra AfterOrEqualRule
     */
    afterOrEqual: (dateOrField: string) => {
        const { AfterOrEqualRule } = require('./extensions/cross-field/AfterOrEqualRule');
        return new AfterOrEqualRule(dateOrField);
    },

    /**
     * Cria uma regra before.
     *
     * @param dateOrField - Data ou campo para comparar
     * @returns Instância da regra BeforeRule
     */
    before: (dateOrField: string) => {
        const { BeforeRule } = require('./extensions/cross-field/BeforeRule');
        return new BeforeRule(dateOrField);
    },

    /**
     * Cria uma regra before_or_equal.
     *
     * @param dateOrField - Data ou campo para comparar
     * @returns Instância da regra BeforeOrEqualRule
     */
    beforeOrEqual: (dateOrField: string) => {
        const { BeforeOrEqualRule } = require('./extensions/cross-field/BeforeOrEqualRule');
        return new BeforeOrEqualRule(dateOrField);
    },

    /**
     * Cria uma regra date_equals.
     *
     * @param dateOrField - Data ou campo para comparar
     * @returns Instância da regra DateEqualsRule
     */
    dateEquals: (dateOrField: string) => {
        const { DateEqualsRule } = require('./extensions/cross-field/DateEqualsRule');
        return new DateEqualsRule(dateOrField);
    },

    // ========================================
    // Regras de Array
    // ========================================

    /**
     * Cria uma regra distinct.
     *
     * @returns Instância da regra DistinctRule
     */
    distinct: () => {
        const { DistinctRule } = require('./extensions/array/DistinctRule');
        return new DistinctRule();
    },

    /**
     * Cria uma regra list.
     *
     * @returns Instância da regra ListRule
     */
    list: () => {
        const { ListRule } = require('./extensions/array/ListRule');
        return new ListRule();
    },

    /**
     * Cria uma regra required_array_keys.
     *
     * @param keys - Chaves requeridas
     * @returns Instância da regra RequiredArrayKeysRule
     */
    requiredArrayKeys: (...keys: string[]) => {
        const { RequiredArrayKeysRule } = require('./extensions/array/RequiredArrayKeysRule');
        return new RequiredArrayKeysRule(...keys);
    },

    /**
     * Cria uma regra in_array.
     *
     * @param field - Campo que contém o array
     * @returns Instância da regra InArrayRule
     */
    inArray: (field: string) => {
        const { InArrayRule } = require('./extensions/array/InArrayRule');
        return new InArrayRule(field);
    },

    /**
     * Cria uma regra in_array_keys.
     *
     * @param keys - Chaves para verificar
     * @returns Instância da regra InArrayKeysRule
     */
    inArrayKeys: (...keys: string[]) => {
        const { InArrayKeysRule } = require('./extensions/array/InArrayKeysRule');
        return new InArrayKeysRule(...keys);
    },

    // ========================================
    // Regras de Date
    // ========================================

    /**
     * Cria uma regra timezone.
     *
     * @returns Instância da regra TimezoneRule
     */
    timezone: () => {
        const { TimezoneRule } = require('./extensions/date/TimezoneRule');
        return new TimezoneRule();
    },

    /**
     * Cria uma regra date_format.
     *
     * @param format - Formato da data
     * @returns Instância da regra DateFormatRule
     */
    dateFormat: (format: string) => {
        const { DateFormatRule } = require('./extensions/date/DateFormatRule');
        return new DateFormatRule(format);
    },

    // ========================================
    // Regras de String
    // ========================================

    /**
     * Cria uma regra active_url.
     *
     * @returns Instância da regra ActiveUrlRule
     */
    activeUrl: () => {
        const { ActiveUrlRule } = require('./extensions/string/ActiveUrlRule');
        return new ActiveUrlRule();
    },

    /**
     * Cria uma regra alpha.
     *
     * @returns Instância da regra AlphaRule
     */
    alpha: () => {
        const { AlphaRule } = require('./extensions/string/AlphaRule');
        return new AlphaRule();
    },

    /**
     * Cria uma regra alpha_num.
     *
     * @returns Instância da regra AlphaNumRule
     */
    alphaNum: () => {
        const { AlphaNumRule } = require('./extensions/string/AlphaNumRule');
        return new AlphaNumRule();
    },

    /**
     * Cria uma regra alpha_dash.
     *
     * @returns Instância da regra AlphaDashRule
     */
    alphaDash: () => {
        const { AlphaDashRule } = require('./extensions/string/AlphaDashRule');
        return new AlphaDashRule();
    },

    /**
     * Cria uma regra current_password.
     *
     * @returns Instância da regra CurrentPasswordRule
     */
    currentPassword: () => {
        const { CurrentPasswordRule } = require('./extensions/string/CurrentPasswordRule');
        return new CurrentPasswordRule();
    },

    // ========================================
    // Regras de Composição (Regex)
    // ========================================

    /**
     * Cria uma regra digits_between.
     *
     * @param min - Mínimo de dígitos
     * @param max - Máximo de dígitos
     * @returns Instância da regra DigitsBetweenRule
     */
    digitsBetween: (min: number, max: number) => {
        const { DigitsBetweenRule } = require('./composer/RegexComposer');
        return new DigitsBetweenRule(min, max);
    },

    /**
     * Cria uma regra max_digits.
     *
     * @param max - Máximo de dígitos
     * @returns Instância da regra MaxDigitsRule
     */
    maxDigits: (max: number) => {
        const { MaxDigitsRule } = require('./composer/RegexComposer');
        return new MaxDigitsRule(max);
    },

    /**
     * Cria uma regra min_digits.
     *
     * @param min - Mínimo de dígitos
     * @returns Instância da regra MinDigitsRule
     */
    minDigits: (min: number) => {
        const { MinDigitsRule } = require('./composer/RegexComposer');
        return new MinDigitsRule(min);
    },

    /**
     * Cria uma regra doesnt_start_with.
     *
     * @param values - Valores proibidos no início
     * @returns Instância da regra DoesntStartWithRule
     */
    doesntStartWith: (...values: string[]) => {
        const { DoesntStartWithRule } = require('./composer/RegexComposer');
        return new DoesntStartWithRule(values);
    },

    /**
     * Cria uma regra doesnt_end_with.
     *
     * @param values - Valores proibidos no fim
     * @returns Instância da regra DoesntEndWithRule
     */
    doesntEndWith: (...values: string[]) => {
        const { DoesntEndWithRule } = require('./composer/RegexComposer');
        return new DoesntEndWithRule(values);
    },

    /**
     * Cria uma regra not_regex.
     *
     * @param pattern - Padrão regex proibido
     * @returns Instância da regra NotRegexRule
     */
    notRegex: (pattern: RegExp) => {
        const { NotRegexRule } = require('./composer/RegexComposer');
        return new NotRegexRule(pattern);
    },

    // ========================================
    // Regras de Negação/Composição
    // ========================================

    /**
     * Cria uma regra not_in.
     *
     * @param values - Valores proibidos
     * @returns Instância da regra NotInRule
     */
    notIn: (...values: unknown[]) => {
        const { NotInRule } = require('./composer/NegationComposer');
        return new NotInRule(values);
    },

    /**
     * Cria uma regra multiple_of.
     *
     * @param divisor - Divisor para múltiplo
     * @returns Instância da regra MultipleOfRule
     */
    multipleOf: (divisor: number) => {
        const { MultipleOfRule } = require('./composer/NegationComposer');
        return new MultipleOfRule(divisor);
    },

    /**
     * Cria uma regra filled.
     *
     * @returns Instância da regra FilledRule
     */
    filled: () => {
        const { FilledRule } = require('./composer/NegationComposer');
        return new FilledRule();
    },

    /**
     * Cria uma regra present.
     *
     * @returns Instância da regra PresentRule
     */
    present: () => {
        const { PresentRule } = require('./composer/NegationComposer');
        return new PresentRule();
    },

    /**
     * Cria uma regra present_if.
     *
     * @param field - Campo para verificar
     * @param value - Valor que dispara a presença
     * @returns Instância da regra PresentIfRule
     */
    presentIf: (field: string, value: unknown) => {
        const { PresentIfRule } = require('./composer/NegationComposer');
        return new PresentIfRule(field, value);
    },

    /**
     * Cria uma regra present_unless.
     *
     * @param field - Campo para verificar
     * @param value - Valor que dispensa a presença
     * @returns Instância da regra PresentUnlessRule
     */
    presentUnless: (field: string, value: unknown) => {
        const { PresentUnlessRule } = require('./composer/NegationComposer');
        return new PresentUnlessRule(field, value);
    },
} as const;

/**
 * Re-exporta tipos utilitários para type inference.
 */
export type { InferInput, InferOutput } from './utilities';

/**
 * Re-exporta tipos do Standard Schema.
 */
export type {
    StandardSchemaV1,
    StandardSchemaSuccessResult,
    StandardSchemaFailureResult,
    StandardSchemaIssue,
    StandardSchemaInput,
    StandardSchemaOutput,
} from './types';

/**
 * Re-exporta schemas individuais para uso direto.
 */
export { StringSchema } from './fluent/StringSchema';
export { NumberSchema } from './fluent/NumberSchema';
export { BooleanSchema } from './fluent/BooleanSchema';
export { ArraySchema } from './fluent/ArraySchema';
export { ObjectSchema } from './fluent/ObjectSchema';
export { BaseSchema } from './fluent/BaseSchema';

/**
 * Re-exporta função utilitária de verificação.
 */
export { isStandardSchema } from './utilities';
