import { describe, expect, test } from "bun:test";
import { escapeHtml } from "@/escape.ts";

describe("escapeHtml", () => {
    test("escapes ampersands", () => {
        expect(escapeHtml("Tom & Jerry")).toBe("Tom &amp; Jerry");
    });

    test("escapes angle brackets", () => {
        expect(escapeHtml("<script>alert(1)</script>")).toBe("&lt;script&gt;alert(1)&lt;/script&gt;");
    });

    test("escapes double quotes", () => {
        expect(escapeHtml('Say "hello"')).toBe("Say &quot;hello&quot;");
    });

    test("escapes single quotes", () => {
        expect(escapeHtml("it's fine")).toBe("it&#39;s fine");
    });

    test("escapes combined XSS payload", () => {
        const payload = `<img src=x onerror="alert('xss')">`;
        expect(escapeHtml(payload)).not.toContain("<");
        expect(escapeHtml(payload)).toContain("&lt;img");
    });
});
