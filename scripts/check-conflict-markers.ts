#!/usr/bin/env bun
/**
 * Quick local scanner for git conflict markers.
 * Exits with code 2 when at least one marker is found.
 */
import fs from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const CONFLICT_MARKER_PATTERN = /^(<{7,}|={7,}|>{7,})/m;

function walk(dir: string, files: string[] = []): string[] {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
        const absolutePath = path.join(dir, entry.name);

        if (entry.isDirectory()) {
            if (
                absolutePath.includes(path.join(ROOT, ".git")) ||
                absolutePath.includes("node_modules") ||
                absolutePath.includes(".memories")
            ) {
                continue;
            }

            walk(absolutePath, files);
            continue;
        }

        if (entry.isFile()) {
            files.push(absolutePath);
        }
    }

    return files;
}

function hasMarkers(text: string): boolean {
    return CONFLICT_MARKER_PATTERN.test(text);
}

let found = false;

for (const filePath of walk(ROOT)) {
    try {
        const text = fs.readFileSync(filePath, "utf8");
        if (hasMarkers(text)) {
            process.stderr.write(`Markers in ${filePath}\n`);
            found = true;
        }
    } catch {
        // Ignore non-text/binary files.
    }
}

if (found) {
    process.exit(2);
}

process.stdout.write("No markers found.\n");
