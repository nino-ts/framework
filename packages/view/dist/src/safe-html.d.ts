/**
 * Marker for pre-rendered HTML fragments produced by the JSX runtime.
 *
 * @packageDocumentation
 */
declare const HTML_MARK: unique symbol;
export interface SafeHtml {
    readonly [HTML_MARK]: true;
    readonly html: string;
}
export declare function isSafeHtml(value: unknown): value is SafeHtml;
export declare function safeHtml(html: string): SafeHtml;
export declare function toHtmlString(value: unknown): string;
export {};
