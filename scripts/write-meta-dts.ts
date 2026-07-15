#!/usr/bin/env bun
/**
 * Write the meta-package `dist/index.d.ts` barrel from `index.ts`.
 *
 * Workspace packages expose their own committed `dist/*.d.ts` via `exports.types`,
 * so this barrel can safely re-export `@ninots/*` for linked and published consumers.
 *
 * @packageDocumentation
 */

import { mkdir } from "node:fs/promises";
import path from "node:path";

const ROOT = path.resolve(import.meta.dir, "..");
const OUT_DIR = path.join(ROOT, "dist");
const ENTRYPOINT = path.join(ROOT, "index.ts");

await mkdir(OUT_DIR, { recursive: true });

const barrelSource = await Bun.file(ENTRYPOINT).text();
const dtsContent = barrelSource.replace(/\.ts"/g, '"').replace(/\.ts'/g, "'");
await Bun.write(path.join(OUT_DIR, "index.d.ts"), dtsContent);

console.log("[write-meta-dts] wrote dist/index.d.ts");
