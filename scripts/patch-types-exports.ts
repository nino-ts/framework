#!/usr/bin/env bun
/**
 * Patch workspace package.json files so `types` / `exports.types`
 * point at emitted declaration files under `dist/`.
 *
 * @packageDocumentation
 */

import { readdir } from "node:fs/promises";
import path from "node:path";

const ROOT = path.resolve(import.meta.dir, "..");
const PACKAGES_DIR = path.join(ROOT, "packages");

type ExportTarget = string | Record<string, string>;
type PackageJson = {
    name?: string;
    main?: string;
    types?: string;
    exports?: string | Record<string, ExportTarget>;
    files?: string[];
    [key: string]: unknown;
};

function toDtsPath(sourcePath: string): string {
    const normalized = sourcePath.replace(/^\.\//, "");
    return `./dist/${normalized.replace(/\.tsx?$/, ".d.ts")}`;
}

function patchExportTarget(target: ExportTarget): Record<string, string> {
    if (typeof target === "string") {
        return {
            types: toDtsPath(target),
            import: target.startsWith(".") ? target : `./${target}`,
            default: target.startsWith(".") ? target : `./${target}`,
        };
    }

    const importPath = target.import ?? target.default ?? target.types;
    if (typeof importPath !== "string") {
        return target;
    }

    return {
        ...target,
        types: toDtsPath(importPath),
        import: importPath,
        default: target.default ?? importPath,
    };
}

const packageNames = (await readdir(PACKAGES_DIR, { withFileTypes: true }))
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)
    .sort();

for (const packageName of packageNames) {
    const pkgJsonPath = path.join(PACKAGES_DIR, packageName, "package.json");
    const pkgJson = (await Bun.file(pkgJsonPath).json()) as PackageJson;

    let entry = "index.ts";
    if (typeof pkgJson.exports === "string") {
        entry = pkgJson.exports.replace(/^\.\//, "");
        pkgJson.exports = {
            ".": patchExportTarget(pkgJson.exports),
        };
    } else if (pkgJson.exports && typeof pkgJson.exports === "object") {
        const nextExports: Record<string, ExportTarget> = {};
        for (const [key, value] of Object.entries(pkgJson.exports)) {
            nextExports[key] = patchExportTarget(value);
            if (key === "." && typeof value === "string") {
                entry = value.replace(/^\.\//, "");
            } else if (
                key === "." &&
                typeof value === "object" &&
                typeof (value.import ?? value.default) === "string"
            ) {
                entry = String(value.import ?? value.default).replace(/^\.\//, "");
            }
        }
        pkgJson.exports = nextExports;
    } else if (typeof pkgJson.main === "string") {
        entry = pkgJson.main.replace(/^\.\//, "");
        pkgJson.exports = {
            ".": patchExportTarget(`./${entry}`),
        };
    } else {
        pkgJson.exports = {
            ".": patchExportTarget("./index.ts"),
        };
    }

    pkgJson.types = toDtsPath(entry.startsWith(".") ? entry : `./${entry}`);

    const files = new Set(pkgJson.files ?? ["dist", "src", "index.ts"]);
    files.add("dist");
    pkgJson.files = [...files];

    await Bun.write(pkgJsonPath, `${JSON.stringify(pkgJson, null, 4)}\n`);
    console.log(`[patch-types-exports] ${pkgJson.name ?? packageName} → ${pkgJson.types}`);
}
