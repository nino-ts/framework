/**
 * Ninots Validation Package - Main Entry Point.
 *
 * @packageDocumentation
 * Sistema de validação com API fluente Standard Schema V1 compliant.
 *
 * @example
 * // API Fluente (recomendada)
 * import { v } from '@ninots/validation';
 *
 * const schema = v.object({
 *     name: v.string().required().min(2),
 *     email: v.string().email(),
 *     age: v.number().min(0).optional(),
 * });
 *
 * const result = schema.validate({ name: 'John', email: 'john@example.com' });
 *
 * if (result.success) {
 *     console.log('Valid:', result.value);
 * } else {
 *     console.log('Errors:', result.issues);
 * }
 *
 * @example
 * // Type inference
 * import type { InferInput, InferOutput } from '@ninots/validation';
 *
 * type UserInput = InferInput<typeof userSchema>;
 * type UserOutput = InferOutput<typeof userSchema>;
 */
export { FilledRule, MultipleOfRule, NotInRule, PresentIfRule, PresentRule, PresentUnlessRule, } from "./composer/NegationComposer";
export { DigitsBetweenRule, DoesntEndWithRule, DoesntStartWithRule, MaxDigitsRule, MinDigitsRule, NotRegexRule, } from "./composer/RegexComposer";
export { ValidationException } from "./exceptions/ValidationException";
export { DistinctRule } from "./extensions/array/DistinctRule";
export { InArrayKeysRule } from "./extensions/array/InArrayKeysRule";
export { InArrayRule } from "./extensions/array/InArrayRule";
export { ListRule } from "./extensions/array/ListRule";
export { RequiredArrayKeysRule } from "./extensions/array/RequiredArrayKeysRule";
export { BailRule } from "./extensions/conditional/BailRule";
export { ExcludeIfRule } from "./extensions/conditional/ExcludeIfRule";
export { MissingIfRule } from "./extensions/conditional/MissingIfRule";
export { MissingRule } from "./extensions/conditional/MissingRule";
export { MissingUnlessRule } from "./extensions/conditional/MissingUnlessRule";
export { MissingWithAllRule } from "./extensions/conditional/MissingWithAllRule";
export { MissingWithRule } from "./extensions/conditional/MissingWithRule";
export { ProhibitedIfRule } from "./extensions/conditional/ProhibitedIfRule";
export { ProhibitedUnlessRule } from "./extensions/conditional/ProhibitedUnlessRule";
export { RequiredIfRule } from "./extensions/conditional/RequiredIfRule";
export { RequiredUnlessRule } from "./extensions/conditional/RequiredUnlessRule";
export { RequiredWithoutRule } from "./extensions/conditional/RequiredWithoutRule";
export { RequiredWithRule } from "./extensions/conditional/RequiredWithRule";
export { AfterOrEqualRule } from "./extensions/cross-field/AfterOrEqualRule";
export { AfterRule } from "./extensions/cross-field/AfterRule";
export { BeforeOrEqualRule } from "./extensions/cross-field/BeforeOrEqualRule";
export { BeforeRule } from "./extensions/cross-field/BeforeRule";
export { ConfirmedRule } from "./extensions/cross-field/ConfirmedRule";
export { DateEqualsRule } from "./extensions/cross-field/DateEqualsRule";
export { DifferentRule } from "./extensions/cross-field/DifferentRule";
export { SameRule } from "./extensions/cross-field/SameRule";
export type { DatabaseRepository, DatabaseValidationContext, } from "./extensions/database/ExistsRule";
export { ExistsRule } from "./extensions/database/ExistsRule";
export { UniqueRule } from "./extensions/database/UniqueRule";
export { DateFormatRule } from "./extensions/date/DateFormatRule";
export { COMMON_TIMEZONES, TimezoneRule } from "./extensions/date/TimezoneRule";
export type { DimensionsConfig, ImageFile, } from "./extensions/file/DimensionsRule";
export { DimensionsRule } from "./extensions/file/DimensionsRule";
export type { FileLike } from "./extensions/file/ImageRule";
export { ImageRule } from "./extensions/file/ImageRule";
export { EXTENSION_MIME_MAP, MimesRule } from "./extensions/file/MimesRule";
export { MimetypesRule } from "./extensions/file/MimetypesRule";
export type { PasswordConfig } from "./extensions/password/PasswordRule";
export { PasswordRule } from "./extensions/password/PasswordRule";
export { ActiveUrlRule } from "./extensions/string/ActiveUrlRule";
export { AlphaDashRule } from "./extensions/string/AlphaDashRule";
export { AlphaNumRule } from "./extensions/string/AlphaNumRule";
export { AlphaRule } from "./extensions/string/AlphaRule";
export type { AuthService, AuthValidationContext, } from "./extensions/string/CurrentPasswordRule";
export { CurrentPasswordRule } from "./extensions/string/CurrentPasswordRule";
export type { ArraySchema as TArraySchema } from "./fluent/ArraySchema";
export { ArraySchema } from "./fluent/ArraySchema";
export { BaseSchema } from "./fluent/BaseSchema";
export type { BooleanSchema as TBooleanSchema } from "./fluent/BooleanSchema";
export { BooleanSchema } from "./fluent/BooleanSchema";
export type { NumberSchema as TNumberSchema } from "./fluent/NumberSchema";
export { NumberSchema } from "./fluent/NumberSchema";
export type { ObjectSchema as TObjectSchema } from "./fluent/ObjectSchema";
export { ObjectSchema } from "./fluent/ObjectSchema";
export type { StringSchema as TStringSchema } from "./fluent/StringSchema";
export { StringSchema } from "./fluent/StringSchema";
export { obj, object } from "./object";
export type { StandardSchemaFailureResult, StandardSchemaIssue, StandardSchemaSuccessResult, StandardSchemaV1, } from "./types";
export type { InferInput, InferOutput } from "./utilities";
export { isStandardSchema } from "./utilities";
export { v } from "./v";
