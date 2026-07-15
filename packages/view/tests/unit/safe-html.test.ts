import { describe, expect, test } from "bun:test";
import { safeHtml, toHtmlString } from "@/safe-html.ts";

describe("safe-html", () => {
    test("unwraps safe html fragments", () => {
        expect(toHtmlString(safeHtml("<p>ok</p>"))).toBe("<p>ok</p>");
    });

    test("escapes unknown values via string coercion", () => {
        expect(toHtmlString(42)).toBe("42");
        expect(toHtmlString(null)).toBe("");
    });
});
