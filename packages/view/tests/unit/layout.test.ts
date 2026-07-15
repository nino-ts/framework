import { describe, expect, test } from "bun:test";
import { withLayout } from "@/layout.ts";

function AppLayout(props: { title: string; children: string }): string {
    return `<html><head><title>${props.title}</title></head><body>${props.children}</body></html>`;
}

function Welcome(): string {
    return "<main>Welcome</main>";
}

describe("withLayout", () => {
    test("wraps page content in layout", () => {
        const Page = withLayout(AppLayout, Welcome, { title: "Ninots" });
        const html = Page({});

        expect(html).toContain("<title>Ninots</title>");
        expect(html).toContain("<main>Welcome</main>");
    });
});
