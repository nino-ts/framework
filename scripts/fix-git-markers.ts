#!/usr/bin/env bun
/**
 * Scans the repository for git conflict markers and emits:
 * - .memories/repairs/markers-report.json
 * - .memories/repairs/patch-preview.txt
 *
 * Usage:
 * bun run scripts/fix-git-markers.ts -- --dry-run (default)
 * bun run scripts/fix-git-markers.ts -- --apply
 */
import fs from "node:fs";
import path from "node:path";

interface MarkerOccurrence {
    startLine: number;
    sepLine: number | null;
    endLine: number | null;
    snippet: string;
}

type MarkerHits = Record<string, MarkerOccurrence[]>;

const ROOT = process.cwd();
const REPAIRS_DIR = path.join(ROOT, ".memories", "repairs");

function walk(dir: string, files: string[] = []): string[] {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
        const absolutePath = path.join(dir, entry.name);

        if (entry.isDirectory()) {
            if (
                absolutePath.includes(path.join(ROOT, ".git")) ||
                absolutePath.includes(path.join(ROOT, "node_modules")) ||
                absolutePath.includes(REPAIRS_DIR)
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

function scanFile(filePath: string): MarkerOccurrence[] {
    const text = fs.readFileSync(filePath, "utf8");
    const lines = text.split(/\r?\n/);
    const occurrences: MarkerOccurrence[] = [];

    for (let index = 0; index < lines.length; index++) {
        if (!/^<{7,}/.test(lines[index])) {
            continue;
        }

        const start = index;
        let separator = index + 1;

        while (separator < lines.length && !/^={7,}/.test(lines[separator])) {
            separator++;
        }

        const sepLine = separator < lines.length ? separator + 1 : null;
        let ending = separator + 1;

        while (ending < lines.length && !/^>{7,}/.test(lines[ending])) {
            ending++;
        }

        const endLine = ending < lines.length ? ending + 1 : null;
        const snippetStart = Math.max(0, start - 3);
        const snippetEnd = Math.min(lines.length, endLine ? ending + 3 : start + 10);

        occurrences.push({
            startLine: start + 1,
            sepLine,
            endLine,
            snippet: lines.slice(snippetStart, snippetEnd).join("\n"),
        });

        index = endLine ? ending : index;
    }

    return occurrences;
}

function ensureRepairsDirectory(): void {
    if (!fs.existsSync(REPAIRS_DIR)) {
        fs.mkdirSync(REPAIRS_DIR, { recursive: true });
    }
}

function createPreview(hits: MarkerHits): string {
    let preview = "";

    for (const [filePath, occurrences] of Object.entries(hits)) {
        preview += `FILE: ${filePath}\n`;

        for (const occurrence of occurrences) {
            preview += `--- occurrence lines ${occurrence.startLine}-${occurrence.endLine ?? occurrence.startLine}\n`;
            preview += `${occurrence.snippet}\n\n`;
            preview += "Suggested: MANUAL REVIEW (ambiguous).\n\n";
        }

        preview += "\n\n";
    }

    return preview;
}

async function main(): Promise<void> {
    const args = process.argv.slice(2);
    const apply = args.includes("--apply");

    ensureRepairsDirectory();

    const hits: MarkerHits = {};
    for (const filePath of walk(ROOT)) {
        if (filePath.includes(".git") || filePath.includes(".memories")) {
            continue;
        }

        try {
            const occurrences = scanFile(filePath);
            if (occurrences.length > 0) {
                hits[filePath] = occurrences;
            }
        } catch {
            // Ignore non-text/binary files.
        }
    }

    const reportPath = path.join(REPAIRS_DIR, "markers-report.json");
    const report = {
        generatedAt: new Date().toISOString(),
        root: ROOT,
        totalFiles: Object.keys(hits).length,
        files: hits,
    };

    fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));

    const previewPath = path.join(REPAIRS_DIR, "patch-preview.txt");
    fs.writeFileSync(previewPath, createPreview(hits));

    process.stdout.write(`Markers scan complete. Files with markers: ${Object.keys(hits).length}\n`);
    process.stdout.write(`Report: ${reportPath}\n`);
    process.stdout.write(`Preview: ${previewPath}\n`);

    if (apply) {
        process.stdout.write("Apply mode is not implemented in this scaffolding; this run only generates reports.\n");
    }
}

void main();
