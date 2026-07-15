/**
 * String-only JSX runtime for @ninots/view.
 *
 * Used by TypeScript with `jsx: react-jsx` and `jsxImportSource: "@ninots/view"`.
 *
 * @packageDocumentation
 */
import { type SafeHtml } from "./safe-html";
import type { JsxProps, JsxType } from "./types";
export declare const Fragment: unique symbol;
export declare namespace JSX {
    type Element = string | SafeHtml;
    interface IntrinsicElements {
        [elementName: string]: JsxProps;
    }
}
export declare function jsx(type: JsxType, props: JsxProps, key?: string): SafeHtml;
export declare function jsxs(type: JsxType, props: JsxProps, key?: string): SafeHtml;
export declare function jsxDEV(type: JsxType, props: JsxProps, key: string | undefined, _isStatic: boolean): SafeHtml;
