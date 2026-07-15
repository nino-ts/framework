/**
 * Marker for pre-rendered HTML fragments produced by the JSX runtime.
 *
 * @packageDocumentation
 */

const HTML_MARK = Symbol.for("ninots.view.html");

export interface SafeHtml {
    readonly [HTML_MARK]: true;
    readonly html: string;
}

export function isSafeHtml(value: unknown): value is SafeHtml {
    return typeof value === "object" && value !== null && HTML_MARK in value;
}

export function safeHtml(html: string): SafeHtml {
    return { [HTML_MARK]: true, html };
}

export function toHtmlString(value: unknown): string {
    if (isSafeHtml(value)) {
        return value.html;
    }

    if (typeof value === "string") {
        return value;
    }

    if (value === null || value === undefined || value === false || value === true) {
        return "";
    }

    return String(value);
}
