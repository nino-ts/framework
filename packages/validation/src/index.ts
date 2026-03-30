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

// ============================================
// API Fluente (Primary Interface)
// ============================================
export { v } from './v';

// ============================================
// Fluent Schemas
// ============================================
export { StringSchema } from './fluent/StringSchema';
export { NumberSchema } from './fluent/NumberSchema';
export { BooleanSchema } from './fluent/BooleanSchema';
export { ArraySchema } from './fluent/ArraySchema';
export { ObjectSchema } from './fluent/ObjectSchema';
export { BaseSchema } from './fluent/BaseSchema';

// ============================================
// Type Exports
// ============================================
export type { StringSchema as TStringSchema } from './fluent/StringSchema';
export type { NumberSchema as TNumberSchema } from './fluent/NumberSchema';
export type { BooleanSchema as TBooleanSchema } from './fluent/BooleanSchema';
export type { ArraySchema as TArraySchema } from './fluent/ArraySchema';
export type { ObjectSchema as TObjectSchema } from './fluent/ObjectSchema';

// ============================================
// Standard Schema Types
// ============================================
export type {
    StandardSchemaFailureResult,
    StandardSchemaIssue,
    StandardSchemaSuccessResult,
    StandardSchemaV1,
} from './types';

// ============================================
// Type Inference Utilities
// ============================================
export type { InferInput, InferOutput } from './utilities';
export { isStandardSchema } from './utilities';

// ============================================
// Database Rules
// ============================================
export { ExistsRule } from './extensions/database/ExistsRule';
export { UniqueRule } from './extensions/database/UniqueRule';
export type { DatabaseRepository, DatabaseValidationContext } from './extensions/database/ExistsRule';

// ============================================
// Password Rule
// ============================================
export { PasswordRule } from './extensions/password/PasswordRule';
export type { PasswordConfig } from './extensions/password/PasswordRule';

// ============================================
// Conditional Rules
// ============================================
export { RequiredIfRule } from './extensions/conditional/RequiredIfRule';
export { RequiredUnlessRule } from './extensions/conditional/RequiredUnlessRule';
export { RequiredWithRule } from './extensions/conditional/RequiredWithRule';
export { RequiredWithoutRule } from './extensions/conditional/RequiredWithoutRule';
export { ProhibitedIfRule } from './extensions/conditional/ProhibitedIfRule';
export { ProhibitedUnlessRule } from './extensions/conditional/ProhibitedUnlessRule';
export { ExcludeIfRule } from './extensions/conditional/ExcludeIfRule';
export { BailRule } from './extensions/conditional/BailRule';
export { MissingRule } from './extensions/conditional/MissingRule';
export { MissingIfRule } from './extensions/conditional/MissingIfRule';
export { MissingUnlessRule } from './extensions/conditional/MissingUnlessRule';
export { MissingWithRule } from './extensions/conditional/MissingWithRule';
export { MissingWithAllRule } from './extensions/conditional/MissingWithAllRule';

// ============================================
// File Rules
// ============================================
export { ImageRule } from './extensions/file/ImageRule';
export { DimensionsRule } from './extensions/file/DimensionsRule';
export { MimetypesRule } from './extensions/file/MimetypesRule';
export { MimesRule } from './extensions/file/MimesRule';
export type { FileLike } from './extensions/file/ImageRule';
export type { ImageFile, DimensionsConfig } from './extensions/file/DimensionsRule';
export { EXTENSION_MIME_MAP } from './extensions/file/MimesRule';

// ============================================
// Cross-Field Rules
// ============================================
export { ConfirmedRule } from './extensions/cross-field/ConfirmedRule';
export { SameRule } from './extensions/cross-field/SameRule';
export { DifferentRule } from './extensions/cross-field/DifferentRule';
export { AfterRule } from './extensions/cross-field/AfterRule';
export { AfterOrEqualRule } from './extensions/cross-field/AfterOrEqualRule';
export { BeforeRule } from './extensions/cross-field/BeforeRule';
export { BeforeOrEqualRule } from './extensions/cross-field/BeforeOrEqualRule';
export { DateEqualsRule } from './extensions/cross-field/DateEqualsRule';

// ============================================
// Array Rules
// ============================================
export { DistinctRule } from './extensions/array/DistinctRule';
export { ListRule } from './extensions/array/ListRule';
export { RequiredArrayKeysRule } from './extensions/array/RequiredArrayKeysRule';
export { InArrayRule } from './extensions/array/InArrayRule';
export { InArrayKeysRule } from './extensions/array/InArrayKeysRule';

// ============================================
// Date Rules
// ============================================
export { TimezoneRule } from './extensions/date/TimezoneRule';
export { DateFormatRule } from './extensions/date/DateFormatRule';
export { COMMON_TIMEZONES } from './extensions/date/TimezoneRule';

// ============================================
// String Rules
// ============================================
export { ActiveUrlRule } from './extensions/string/ActiveUrlRule';
export { AlphaRule } from './extensions/string/AlphaRule';
export { AlphaNumRule } from './extensions/string/AlphaNumRule';
export { AlphaDashRule } from './extensions/string/AlphaDashRule';
export { CurrentPasswordRule } from './extensions/string/CurrentPasswordRule';
export type { AuthService, AuthValidationContext } from './extensions/string/CurrentPasswordRule';

// ============================================
// Composer Rules (Regex-based)
// ============================================
export {
    DigitsBetweenRule,
    MaxDigitsRule,
    MinDigitsRule,
    DoesntStartWithRule,
    DoesntEndWithRule,
    NotRegexRule,
} from './composer/RegexComposer';

// ============================================
// Composer Rules (Negation/Composition)
// ============================================
export {
    NotInRule,
    MultipleOfRule,
    FilledRule,
    PresentRule,
    PresentIfRule,
    PresentUnlessRule,
} from './composer/NegationComposer';

// ============================================
// Legacy/Utility Exports
// ============================================
export { Validator } from './Validator';
export { ValidationException } from './exceptions/ValidationException';
export { obj, object } from './object';

// ============================================
// Legacy Rules (for compatibility)
// ============================================
export { ArrayRule } from './rules/ArrayRule';
export { BooleanRule } from './rules/BooleanRule';
export { EmailRule } from './rules/EmailRule';
export { InRule } from './rules/InRule';
export { MaxRule } from './rules/MaxRule';
export { MinRule } from './rules/MinRule';
export { NumberRule } from './rules/NumberRule';
export { RequiredRule } from './rules/RequiredRule';
export { StringRule } from './rules/StringRule';
export { UuidRule } from './rules/UuidRule';
"" 
