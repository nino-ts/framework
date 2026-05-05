/**
 * Verification scripts using Bun native features.
 *
 * @packageDocumentation
 */

import { readdir } from "node:fs/promises";
import { join } from "node:path";
import { $ } from "bun";

/**
 * Verifies that source files do not contain forbidden `any` types.
 *
 * @remarks
 * Comments, strings, template literals, and legacy files are ignored to reduce false positives.
 */
export async function verifyNoAny(): Promise<void> {
    const packageNames = await readdir("packages");
    let hasAnyType = false;

    for (const packageName of packageNames) {
        const sourceDirectoryPath = join("packages", packageName, "src");

        try {
            const directoryEntries = await readdir(sourceDirectoryPath, { recursive: true });
            const sourceFiles = directoryEntries.filter(
                (entry) => typeof entry === "string" && entry.endsWith(".ts") && !entry.includes(".legacy.ts"),
            );

            for (const sourceFile of sourceFiles) {
                const content = await Bun.file(join(sourceDirectoryPath, sourceFile)).text();

                // Remove comments and strings before checking.
                const withoutComments = content
                    // Remove lines that end with eslint-disable comment (documented exceptions).
                    .replace(/.*\/\/\s*eslint-disable-line.*/g, "")
                    // Remove multiline comments /* ... */.
                    .replace(/\/\*[\s\S]*?\*\//g, "")
                    // Remove single-line comments // ....
                    .replace(/\/\/.*/g, "")
                    // Remove template literals `...`.
                    .replace(/`(?:[^`\\]|\\.)*`/g, "")
                    // Remove double-quoted strings "...".
                    .replace(/"(?:[^"\\]|\\.)*"/g, "")
                    // Remove single-quoted strings '...'.
                    .replace(/'(?:[^'\\]|\\.)*'/g, "")
                    // Remove mixin constructor pattern: new (...args: any[]) => T.
                    // This is required by TypeScript for mixins (TS2545).
                    .replace(/new\s*\(\s*\.\.\.\s*args\s*:\s*any\[\]\s*\)\s*=>\s*\w+/g, "");

                if (/\bany\b/.test(withoutComments)) {
                    hasAnyType = true;
                }
            }
        } catch {
            // Skip packages without src directory.
        }
    }

    if (hasAnyType) {
        process.exit(1);
    }
}

/**
 * Type checks the selected packages using Bun shell.
 *
 * @remarks
 * Only errors reported in src/ are treated as failures; test-only errors are ignored.
 */
export async function typeCheckPackages(): Promise<void> {
    const packageNames = ["container", "http", "middleware", "console", "routing", "foundation", "orm"];

    let hasSourceErrors = false;

    for (const packageName of packageNames) {
        try {
            await $`cd packages/${packageName} && tsc --noEmit`;
        } catch (error: unknown) {
            // Type check failed - check if errors are in src/ or tests/.
            const errorOutput =
                (error as { stderr?: { toString(): string } })?.stderr?.toString() ||
                (error as { stdout?: { toString(): string } })?.stdout?.toString() ||
                "";

            // Filter for src/ errors only.
            const sourceErrors = errorOutput
                .split("\n")
                .filter((line: string) => line.includes("src/") && line.includes("error TS"));

            if (sourceErrors.length > 0) {
                for (const _errorLine of sourceErrors) {
                }
                hasSourceErrors = true;
            } else {
            }
        }
    }

    if (hasSourceErrors) {
        process.exit(1);
    }
}

// Run if called directly.
if (import.meta.main) {
    const command = process.argv[2];

    if (command === "no-any") {
        await verifyNoAny();
    } else if (command === "type-check") {
        await typeCheckPackages();
    } else {
        process.exit(1);
    }
}
