/**
 * Shared view types.
 *
 * @packageDocumentation
 */

import type { SafeHtml } from "./safe-html";

export type ViewResult = string | SafeHtml | Promise<string | SafeHtml>;

export type ViewComponent<P extends Record<string, unknown> = Record<string, unknown>> = (
    props: P,
) => ViewResult;

export type LayoutComponent<P extends Record<string, unknown> = Record<string, unknown>> = (
    props: P & { children: string },
) => ViewResult;

export interface ViewInit extends Omit<ResponseInit, "headers"> {
    headers?: HeadersInit;
}

export type JsxProps = Record<string, unknown> & {
    children?: unknown;
    dangerouslySetInnerHTML?: { __html: string };
};

export type JsxType = string | ((props: JsxProps) => ViewResult);
