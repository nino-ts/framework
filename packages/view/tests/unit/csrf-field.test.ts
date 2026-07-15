import { describe, expect, test } from "bun:test";
import { csrfField } from "../../src/csrf-field";

describe("csrfField", () => {
    test("renders a hidden input with default field name", () => {
        expect(csrfField("abc123")).toBe('<input type="hidden" name="_token" value="abc123" />');
    });

    test("escapes token and field name", () => {
        const html = csrfField('<bad"token>', 'na"me');

        expect(html).toBe('<input type="hidden" name="na&quot;me" value="&lt;bad&quot;token&gt;" />');
        expect(html).not.toContain("<bad");
    });

    test("supports custom field names", () => {
        expect(csrfField("token-value", "_csrf")).toContain('name="_csrf"');
        expect(csrfField("token-value", "_csrf")).toContain('value="token-value"');
    });
});
