import { describe, expect, test } from "bun:test";
import { jsx, jsxs } from "@/jsx-runtime.ts";
import { render } from "@/render.ts";

function Welcome(props: { title: string }): string {
    return jsx("main", { children: jsxs("h1", { children: ["Welcome to ", props.title] }) });
}

describe("render", () => {
    test("renders HTML string to Response with text/html", async () => {
        const response = await render("<p>Hello</p>");
        expect(response.status).toBe(200);
        expect(response.headers.get("Content-Type")).toBe("text/html; charset=utf-8");
        expect(await response.text()).toBe("<p>Hello</p>");
    });

    test("renders view component to Response", async () => {
        const response = await render(Welcome, { title: "Ninots" });
        const html = await response.text();

        expect(html).toContain("<h1>Welcome to Ninots</h1>");
        expect(response.headers.get("Content-Type")).toContain("text/html");
    });

    test("respects custom status and headers", async () => {
        const response = await render("<p>Created</p>", undefined, {
            headers: { "X-View": "ninots" },
            status: 201,
        });

        expect(response.status).toBe(201);
        expect(response.headers.get("X-View")).toBe("ninots");
    });
});
