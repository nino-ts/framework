/**
 * Escape a string for safe inclusion in HTML text nodes and attributes.
 *
 * @param value - Raw user-controlled or dynamic text
 * @returns HTML-escaped string
 */
export function escapeHtml(value: string): string {
    return value
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#39;");
}
