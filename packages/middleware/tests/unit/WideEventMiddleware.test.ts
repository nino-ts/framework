/**
 * Unit tests for wideEventMiddleware — emit-once in finally.
 *
 * @packageDocumentation
 */

import { afterEach, describe, expect, spyOn, test } from "bun:test";
import { wideEvent, type WideEvent } from "@ninots/logger";
import { wideEventMiddleware } from "../../src/wide-event/middleware";

function parseWriteCall(writeSpy: ReturnType<typeof spyOn>, index: number): Record<string, unknown> {
    const args = writeSpy.mock.calls[index] as unknown[];
    const payload = args[1];
    if (typeof payload !== "string") {
        throw new Error(`Expected Bun.write string payload at call ${index}`);
    }
    return JSON.parse(payload) as Record<string, unknown>;
}

function assertMinimalFields(line: Record<string, unknown>): asserts line is WideEvent & Record<string, unknown> {
    expect(typeof line.request_id).toBe("string");
    expect(typeof line.timestamp).toBe("string");
    expect(typeof line.method).toBe("string");
    expect(typeof line.path).toBe("string");
    expect(typeof line.status_code).toBe("number");
    expect(typeof line.duration_ms).toBe("number");
    expect(line.outcome === "success" || line.outcome === "error").toBe(true);
}

describe("wideEventMiddleware", () => {
    let writeSpy: ReturnType<typeof spyOn>;

    afterEach(() => {
        writeSpy?.mockRestore();
    });

    test("emits exactly one canonical line on success", async () => {
        writeSpy = spyOn(Bun, "write").mockImplementation(() => Promise.resolve(100));

        const middleware = wideEventMiddleware({
            requestId: "mw-ok",
            timestamp: "2026-07-16T15:00:00.000Z",
        });
        const request = new Request("http://localhost/hello", { method: "GET" });

        const response = await middleware(request, async () => new Response("ok", { status: 200 }));

        expect(response.status).toBe(200);
        expect(writeSpy).toHaveBeenCalledTimes(1);

        const line = parseWriteCall(writeSpy, 0);
        assertMinimalFields(line);
        expect(line.request_id).toBe("mw-ok");
        expect(line.timestamp).toBe("2026-07-16T15:00:00.000Z");
        expect(line.method).toBe("GET");
        expect(line.path).toBe("/hello");
        expect(line.status_code).toBe(200);
        expect(line.outcome).toBe("success");
        expect(line).not.toHaveProperty("message");
        expect(line).not.toHaveProperty("level");
    });

    test("emits once with error fields when handler throws", async () => {
        writeSpy = spyOn(Bun, "write").mockImplementation(() => Promise.resolve(100));

        const middleware = wideEventMiddleware({
            requestId: "mw-err",
            timestamp: "2026-07-16T15:00:00.000Z",
        });
        const request = new Request("http://localhost/boom", { method: "POST" });

        await expect(
            middleware(request, async () => {
                throw new TypeError("explode");
            }),
        ).rejects.toThrow("explode");

        expect(writeSpy).toHaveBeenCalledTimes(1);
        const line = parseWriteCall(writeSpy, 0);
        assertMinimalFields(line);
        expect(line.outcome).toBe("error");
        expect(line.status_code).toBe(500);
        expect(line.error).toEqual({ type: "TypeError", message: "explode" });
    });

    test("5xx response is outcome error with HttpError", async () => {
        writeSpy = spyOn(Bun, "write").mockImplementation(() => Promise.resolve(100));

        const middleware = wideEventMiddleware({ requestId: "mw-5xx" });
        const request = new Request("http://localhost/down");

        await middleware(request, async () => new Response("fail", { status: 503 }));

        expect(writeSpy).toHaveBeenCalledTimes(1);
        const line = parseWriteCall(writeSpy, 0);
        expect(line.outcome).toBe("error");
        expect(line.status_code).toBe(503);
        expect(line.error).toEqual({ type: "HttpError", message: "HTTP 503" });
    });

    test("handler enrichment via wideEvent.set appears on the single line", async () => {
        writeSpy = spyOn(Bun, "write").mockImplementation(() => Promise.resolve(100));

        const middleware = wideEventMiddleware({ requestId: "mw-enrich" });
        const request = new Request("http://localhost/users");

        await middleware(request, async () => {
            wideEvent.set({ user_id: "u-1", action: "list" });
            return new Response("[]", { status: 200 });
        });

        expect(writeSpy).toHaveBeenCalledTimes(1);
        const line = parseWriteCall(writeSpy, 0);
        expect(line.user_id).toBe("u-1");
        expect(line.action).toBe("list");
        expect(line.outcome).toBe("success");
    });
});
