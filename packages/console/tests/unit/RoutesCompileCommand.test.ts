/**
 * Unit tests for RoutesCompileCommand and named stub templates.
 *
 * @packageDocumentation
 */

import { describe, expect, test } from "bun:test";
import { mkdtemp, readFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { Router } from "@ninots/routing";
import { RoutesCompileCommand } from "../../src/commands/routes-compile-command";
import { getStubTemplate } from "../../src/generator/stub-templates";

describe("RoutesCompileCommand", () => {
    test("writes deterministic routes.d.ts via emitRouteRegistry", async () => {
        const outDir = await mkdtemp(join(tmpdir(), "ninots-routes-compile-"));
        const outRel = "types/routes.d.ts";
        const outPath = join(outDir, outRel);

        try {
            const router = new Router();
            router.get("/", () => new Response("ok")).name("home");
            router.group({ prefix: "/api" }, () => {
                router.get("/users/:id", () => new Response("u")).name("users.show");
            });

            const command = new RoutesCompileCommand({
                resolveRouter: () => router,
            });
            command.setOptions({ out: outRel });
            command.setOutput({
                writeLine(): void {},
            });

            const cwd = process.cwd();
            process.chdir(outDir);
            try {
                const exitCode = await command.handle();
                expect(exitCode).toBe(0);
            } finally {
                process.chdir(cwd);
            }

            const content = await readFile(outPath, "utf8");
            expect(content).toContain('"home": Record<never, never>;');
            expect(content).toContain('"users.show": { id: string };');
            expect(content.indexOf('"home"')).toBeLessThan(content.indexOf('"users.show"'));
        } finally {
            await rm(outDir, { force: true, recursive: true });
        }
    });

    test("returns non-zero on duplicate route names", async () => {
        const router = new Router();
        router.get("/a", () => new Response("a")).name("dup");
        router.get("/b", () => new Response("b")).name("dup");

        const lines: string[] = [];
        const command = new RoutesCompileCommand({
            resolveRouter: () => router,
        });
        command.setOutput({
            writeLine(text: string): void {
                lines.push(text);
            },
        });

        const exitCode = await command.handle();
        expect(exitCode).toBe(1);
        expect(lines.some((line) => line.includes("Duplicate route name: dup"))).toBe(true);
    });
});

describe("named stub templates", () => {
    test("web-resource-routes emit .name() for all 7 actions", () => {
        const stub = getStubTemplate("web-resource-routes");
        expect(stub).toContain('.name("{{ routePrefix }}.index")');
        expect(stub).toContain('.name("{{ routePrefix }}.create")');
        expect(stub).toContain('.name("{{ routePrefix }}.store")');
        expect(stub).toContain('.name("{{ routePrefix }}.show")');
        expect(stub).toContain('.name("{{ routePrefix }}.edit")');
        expect(stub).toContain('.name("{{ routePrefix }}.update")');
        expect(stub).toContain('.name("{{ routePrefix }}.destroy")');
    });

    test("api-resource-routes emit .name() for 4 actions", () => {
        const stub = getStubTemplate("api-resource-routes");
        expect(stub).toContain('.name("{{ routePrefix }}.index")');
        expect(stub).toContain('.name("{{ routePrefix }}.show")');
        expect(stub).toContain('.name("{{ routePrefix }}.update")');
        expect(stub).toContain('.name("{{ routePrefix }}.destroy")');
        expect(stub).not.toContain(".create");
        expect(stub).not.toContain(".store");
    });

    test("module-routes emit example .name({{ routePrefix }}.index)", () => {
        const stub = getStubTemplate("module-routes");
        expect(stub).toContain('.name("{{ routePrefix }}.index")');
    });
});
