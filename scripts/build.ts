#!/usr/bin/env bun
/**
 * Build script for @ninots/framework meta-package.
 *
 * Produces a minified ESM bundle and TypeScript declarations
 * for npm/jsr publication. All @ninots/* packages are marked
 * as external dependencies (Laravel/Illuminate pattern).
 *
 * @packageDocumentation
 */

import { readdir, rm, stat } from "node:fs/promises";
import path from "node:path";
import { $ } from "bun";

const ROOT = path.resolve(import.meta.dir, "..");
const OUT_DIR = path.join(ROOT, "dist");
const ENTRYPOINT = path.join(ROOT, "index.ts");

// Security: never delete outside project root.
if (!OUT_DIR.startsWith(ROOT)) {
    throw new Error(`Refusing to delete outside project root: ${OUT_DIR}`);
}

// ── Discover workspace packages ────────────────────────────────
const packageNames = await readdir(path.join(ROOT, "packages"));
const externalPackages = packageNames.map((name) => `@ninots/${name}`);

// ── Step 1: Clean ──────────────────────────────────────────────
console.log("🧹 Cleaning dist/...");
await rm(OUT_DIR, { recursive: true, force: true });

// ── Step 2: Bundle ─────────────────────────────────────────────
console.log("📦 Bundling @ninots/framework...");
const start = Bun.nanoseconds();

const result = await Bun.build({
    entrypoints: [ENTRYPOINT],
    outdir: OUT_DIR,
    target: "bun",
    minify: true,
    sourcemap: "external",
    format: "esm",
    external: externalPackages,
});

if (!result.success) {
    console.error("❌ Build failed:");
    for (const log of result.logs) {
        console.error(`  ${log}`);
    }
    process.exit(1);
}

const elapsedMs = ((Bun.nanoseconds() - start) / 1_000_000).toFixed(0);

// ── Step 3: Generate type declarations ─────────────────────────
console.log("📝 Generating type declarations...");
let dtsGenerated = false;

try {
    await $`bunx tsc --project tsconfig.build.json`.cwd(ROOT);
    dtsGenerated = true;
    console.log("  ✓ Type declarations generated via tsc");
} catch {
    // Fallback: generate barrel DTS directly from source
    console.warn("  ⚠ tsc failed — generating barrel DTS from source...");
    try {
        const barrelSource = await Bun.file(ENTRYPOINT).text();
        // Strip .ts extensions and remove @packageDocumentation block
        const dtsContent = barrelSource
            .replace(/\.ts"/g, '"')
            .replace(/\.ts'/g, "'");
        await Bun.write(path.join(OUT_DIR, "index.d.ts"), dtsContent);
        dtsGenerated = true;
        console.log("  ✓ Barrel DTS generated from source (fallback)");
    } catch (fallbackError) {
        console.warn("  ⚠ DTS generation failed entirely");
    }
}

// ── Step 4: Report ─────────────────────────────────────────────
const pkg = await Bun.file(path.join(ROOT, "package.json")).json();
console.log(`\n📊 @ninots/framework v${pkg.version}`);

for (const output of result.outputs) {
    const rel = path.relative(ROOT, output.path);
    const sizeKb = (output.size / 1024).toFixed(1);
    console.log(`  ✓ ${rel}  ${sizeKb} KB`);
}

try {
    const dtsPath = path.join(OUT_DIR, "index.d.ts");
    const dtsSize = (await stat(dtsPath)).size;
    console.log(`  ✓ dist/index.d.ts  ${(dtsSize / 1024).toFixed(1)} KB`);
} catch {
    console.warn("  ⚠ dist/index.d.ts not generated");
}

console.log(`\n✅ Build completed in ${elapsedMs}ms`);
