/**
 * CSRF form field helper — Laravel `csrf_field()` parity.
 *
 * @packageDocumentation
 */
/**
 * Render a hidden input field for CSRF token submission.
 *
 * @param token - CSRF token from `Bun.CSRF.generate()` (passed explicitly by the handler)
 * @param fieldName - Form field name (default `_token`)
 */
export declare function csrfField(token: string, fieldName?: string): string;
