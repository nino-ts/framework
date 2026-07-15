/**
 * CSRF form field helper — Laravel `csrf_field()` parity.
 *
 * @packageDocumentation
 */

import { escapeHtml } from "./escape";

/**
 * Render a hidden input field for CSRF token submission.
 *
 * @param token - CSRF token from `Bun.CSRF.generate()` (passed explicitly by the handler)
 * @param fieldName - Form field name (default `_token`)
 */
export function csrfField(token: string, fieldName = "_token"): string {
    const safeName = escapeHtml(fieldName);
    const safeToken = escapeHtml(token);
    return `<input type="hidden" name="${safeName}" value="${safeToken}" />`;
}
