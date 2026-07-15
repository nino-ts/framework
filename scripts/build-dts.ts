#!/usr/bin/env bun
/**
 * Emit declaration files for every workspace `@ninots/*` package.
 *
 * Consumers (e.g. ninots starter with `bun link`) resolve `types` to these
 * `.d.ts` files. With `skipLibCheck: true`, TypeScript no longer type-checks
 * raw package sources through the meta-package barrel.
 *
 * @packageDocumentation
 */

import { readdir, rm } from "node:fs/promises";
import path from "node:path";
import { $ } from "bun";

const ROOT = path.resolve(import.meta.dir, "..");
const PACKAGES_DIR = path.join(ROOT, "packages");

type PackageJson = {
    name?: string;
    main?: string;
    exports?: string | Record<string, string | Record<string, string>>;
};

function resolveEntry(pkgJson: PackageJson): string {
    if (typeof pkgJson.exports === "string") {
        return pkgJson.exports.replace(/^\.\//, "");
    }

    if (pkgJson.exports && typeof pkgJson.exports === "object") {
        const rootExport = pkgJson.exports["."];
        if (typeof rootExport === "string") {
            return rootExport.replace(/^\.\//, "");
        }
        if (rootExport && typeof rootExport === "object") {
            const candidate = rootExport.import ?? rootExport.default ?? rootExport.types;
            if (typeof candidate === "string") {
                return candidate.replace(/^\.\//, "");
            }
        }
    }

    if (typeof pkgJson.main === "string") {
        return pkgJson.main.replace(/^\.\//, "");
    }

    return "index.ts";
}

const packageNames = (await readdir(PACKAGES_DIR, { withFileTypes: true }))
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)
    .sort();

let failed = 0;

for (const packageName of packageNames) {
    const packageDir = path.join(PACKAGES_DIR, packageName);
    const pkgJsonPath = path.join(packageDir, "package.json");
    const pkgJson = (await Bun.file(pkgJsonPath).json()) as PackageJson;
    const entry = resolveEntry(pkgJson);
    const entryPath = path.join(packageDir, entry);

    if (!(await Bun.file(entryPath).exists())) {
        failed += 1;
        continue;
    }

    const declarationDir = path.join(packageDir, "dist");
    await rm(declarationDir, { recursive: true, force: true });

    const result =
        await $`bunx tsc --ignoreConfig --declaration --emitDeclarationOnly --noEmitOnError false --skipLibCheck --module Preserve --moduleResolution bundler --target ESNext --strict --jsx react-jsx --jsxImportSource @ninots/view --types bun --declarationDir ${declarationDir} --rootDir ${packageDir} ${entryPath}`
            .cwd(ROOT)
            .nothrow();

    const indexDts = path.join(declarationDir, entry.replace(/\.tsx?$/, ".d.ts"));
    if (!(await Bun.file(indexDts).exists())) {
        failed += 1;
        if (result.stderr.toString().trim()) {
            console.error(`[build-dts] ${packageName}: missing ${path.relative(ROOT, indexDts)}`);
        }
    }
}

if (failed > 0) {
    console.error(`[build-dts] failed for ${failed} package(s)`);
    process.exit(1);
}

console.log(`[build-dts] emitted declarations for ${packageNames.length} packages`);
