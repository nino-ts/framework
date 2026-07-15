#!/usr/bin/env bun
/**
 * Build script for @ninots/framework meta-package.
 *
 * Produces a minified ESM bundle and TypeScript declarations
 * for npm publication. Workspace `@ninots/*` sources are bundled
 * into `dist/` so consumers can install the meta-package alone
 * until individual packages are published separately.
 *
 * @packageDocumentation
 */

import { rm, stat } from "node:fs/promises";
import path from "node:path";
import { $ } from "bun";

const ROOT = path.resolve(import.meta.dir, "..");
const OUT_DIR = path.join(ROOT, "dist");
const ENTRYPOINT = path.join(ROOT, "index.ts");
const CLI_ENTRYPOINT = path.join(ROOT, "src", "bootstrap", "app.ts");

// Security: never delete outside project root.
if (!OUT_DIR.startsWith(ROOT)) {
    throw new Error(`Refusing to delete outside project root: ${OUT_DIR}`);
}

await rm(OUT_DIR, { recursive: true, force: true });
const start = Bun.nanoseconds();

const result = await Bun.build({
    entrypoints: [ENTRYPOINT],
    outdir: OUT_DIR,
    target: "bun",
    minify: true,
    sourcemap: "external",
    format: "esm",
});

if (!result.success) {
    for (const _log of result.logs) {
    }
    process.exit(1);
}

const cliResult = await Bun.build({
    entrypoints: [CLI_ENTRYPOINT],
    outdir: OUT_DIR,
    target: "bun",
    minify: true,
    sourcemap: "external",
    format: "esm",
});

if (!cliResult.success) {
    for (const _log of cliResult.logs) {
    }
    process.exit(1);
}

const _elapsedMs = ((Bun.nanoseconds() - start) / 1_000_000).toFixed(0);
let _dtsGenerated = false;

// Emit per-package declarations so linked consumers resolve `types` to `.d.ts`
// (skipLibCheck) instead of type-checking raw workspace TypeScript sources.
try {
    await $`bun run scripts/build-dts.ts`.cwd(ROOT);
} catch (_dtsPackagesError) {}

try {
    await $`bun run scripts/write-meta-dts.ts`.cwd(ROOT);
    _dtsGenerated = true;
} catch {
    try {
        const barrelSource = await Bun.file(ENTRYPOINT).text();
        // Strip .ts extensions and remove @packageDocumentation block
        const dtsContent = barrelSource.replace(/\.ts"/g, '"').replace(/\.ts'/g, "'");
        await Bun.write(path.join(OUT_DIR, "index.d.ts"), dtsContent);
        _dtsGenerated = true;
    } catch (_fallbackError) {}
}

// ── Step 4: Report ─────────────────────────────────────────────
const _pkg = await Bun.file(path.join(ROOT, "package.json")).json();

for (const output of result.outputs) {
    const _rel = path.relative(ROOT, output.path);
    const _sizeKb = (output.size / 1024).toFixed(1);
}

for (const output of cliResult.outputs) {
    const _rel = path.relative(ROOT, output.path);
    const _sizeKb = (output.size / 1024).toFixed(1);
}

try {
    const dtsPath = path.join(OUT_DIR, "index.d.ts");
    const _dtsSize = (await stat(dtsPath)).size;
} catch {}
