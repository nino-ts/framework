import { describe, expect, test } from "bun:test";
import { jsx, jsxs, Fragment } from "@/jsx-runtime.ts";
import { toHtmlString } from "@/safe-html.ts";

describe("jsx-runtime", () => {
    test("renders elements with escaped text children", () => {
        const html = toHtmlString(jsx("p", { children: '<script>alert(1)</script>' }));
        expect(html).toBe("<p>&lt;script&gt;alert(1)&lt;/script&gt;</p>");
    });

    test("renders nested elements and fragments", () => {
        const html = toHtmlString(
            jsxs("div", {
                children: [
                    jsx(Fragment, { children: jsx("span", { children: "Ninots" }) }),
                    jsx("strong", { children: "Bun" }),
                ],
            }),
        );

        expect(html).toBe("<div><span>Ninots</span><strong>Bun</strong></div>");
    });

    test("maps className to class and escapes attributes", () => {
        const html = toHtmlString(
            jsx("div", {
                className: 'box "wide"',
                id: "main",
                children: "content",
            }),
        );

        expect(html).toBe('<div class="box &quot;wide&quot;" id="main">content</div>');
    });

    test("renders void elements without closing tag", () => {
        const html = toHtmlString(jsx("meta", { charSet: "utf-8" }));
        expect(html).toBe('<meta charset="utf-8">');
    });

    test("supports dangerouslySetInnerHTML for trusted markup", () => {
        const html = toHtmlString(
            jsx("style", {
                dangerouslySetInnerHTML: { __html: "body { margin: 0; }" },
            }),
        );

        expect(html).toBe("<style>body { margin: 0; }</style>");
    });
});
