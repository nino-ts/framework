/**
 * String-only JSX runtime for @ninots/view.
 *
 * Used by TypeScript with `jsx: react-jsx` and `jsxImportSource: "@ninots/view"`.
 *
 * @packageDocumentation
 */

import { escapeHtml } from "./escape";
import { isSafeHtml, safeHtml, toHtmlString, type SafeHtml } from "./safe-html";
import type { JsxProps, JsxType } from "./types";

export const Fragment = Symbol.for("ninots.view.fragment");

export namespace JSX {
    export type Element = string | SafeHtml;

    export interface IntrinsicElements {
        [elementName: string]: JsxProps;
    }
}

const VOID_ELEMENTS = new Set([
    "area",
    "base",
    "br",
    "col",
    "embed",
    "hr",
    "img",
    "input",
    "link",
    "meta",
    "param",
    "source",
    "track",
    "wbr",
]);

const ATTRIBUTE_ALIASES: Record<string, string> = {
    charSet: "charset",
    className: "class",
    htmlFor: "for",
};

function renderChildren(children: unknown): string {
    if (children === null || children === undefined || children === false) {
        return "";
    }

    if (children === true) {
        return "";
    }

    if (isSafeHtml(children)) {
        return children.html;
    }

    if (typeof children === "string" || typeof children === "number" || typeof children === "bigint") {
        return escapeHtml(String(children));
    }

    if (Array.isArray(children)) {
        return children.map((child) => renderChildren(child)).join("");
    }

    return escapeHtml(String(children));
}

function renderAttribute(name: string, value: unknown): string {
    const attributeName = ATTRIBUTE_ALIASES[name] ?? name;

    if (value === false || value === null || value === undefined) {
        return "";
    }

    if (value === true) {
        return ` ${attributeName}`;
    }

    return ` ${attributeName}="${escapeHtml(String(value))}"`;
}

function renderAttributes(props: JsxProps): string {
    let attributes = "";

    for (const [name, value] of Object.entries(props)) {
        if (name === "children" || name === "dangerouslySetInnerHTML") {
            continue;
        }

        attributes += renderAttribute(name, value);
    }

    return attributes;
}

function renderElement(type: string, props: JsxProps | null): string {
    const resolvedProps = props ?? {};
    const { dangerouslySetInnerHTML } = resolvedProps;
    const attributes = renderAttributes(resolvedProps);
    const innerHtml =
        dangerouslySetInnerHTML !== undefined
            ? dangerouslySetInnerHTML.__html
            : renderChildren(resolvedProps.children);

    if (VOID_ELEMENTS.has(type)) {
        return `<${type}${attributes}>`;
    }

    return `<${type}${attributes}>${innerHtml}</${type}>`;
}

function renderJsx(type: JsxType, props: JsxProps | null, _key?: string): string {
    if (type === Fragment) {
        return renderChildren(props?.children);
    }

    if (typeof type === "function") {
        const rendered = type(props ?? {});
        return toHtmlString(rendered);
    }

    return renderElement(type, props);
}

export function jsx(type: JsxType, props: JsxProps, key?: string): SafeHtml {
    return safeHtml(renderJsx(type, props, key));
}

export function jsxs(type: JsxType, props: JsxProps, key?: string): SafeHtml {
    return safeHtml(renderJsx(type, props, key));
}

export function jsxDEV(type: JsxType, props: JsxProps, key: string | undefined, _isStatic: boolean): SafeHtml {
    return safeHtml(renderJsx(type, props, key));
}
