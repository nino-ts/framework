#!/usr/bin/env bun
import { existsSync } from "node:fs";
import path from "node:path";
import { parseArgs } from "node:util";
import { $ } from "bun";

const { positionals } = parseArgs({
    allowPositionals: true,
    args: Bun.argv,
    options: {
        host: {
            short: "h",
            type: "string",
        },
        port: {
            short: "p",
            type: "string",
        },
    },
    strict: false,
});

// Bun.argv = ['/path/to/bun', '/path/to/nino.ts', 'dev']
const command = positionals[2];
const localBootstrapEntry = path.join(process.cwd(), "src", "bootstrap", "app.ts");
const publishedBootstrapEntry = path.join(import.meta.dir, "..", "dist", "app.js");

function resolveBootstrapEntry(): string {
    if (existsSync(localBootstrapEntry)) {
        return localBootstrapEntry;
    }

    if (existsSync(publishedBootstrapEntry)) {
        return publishedBootstrapEntry;
    }

    throw new Error(`Bootstrap entrypoint not found. Checked: ${localBootstrapEntry} and ${publishedBootstrapEntry}`);
}

const bootstrapEntry = resolveBootstrapEntry();

async function main() {
    switch (command) {
        case "dev": {
            await $`bun --hot run ${bootstrapEntry}`;
            break;
        }
        case "start": {
            await $`bun run ${bootstrapEntry}`;
            break;
        }
        case "build": {
            await $`bun build ${bootstrapEntry} --target=bun --outfile=dist/app.js`;
            break;
        }
        default: {
            process.stderr.write("Usage: nino <dev|start|build>\n");
            process.exit(1);
        }
    }
}

main().catch((_err) => {
    process.exit(1);
});
