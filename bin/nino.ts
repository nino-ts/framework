#!/usr/bin/env bun
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

async function main() {
    switch (command) {
        case "dev": {
            await $`bun --hot run src/bootstrap/app.ts`;
            break;
        }
        case "start": {
            await $`bun run src/bootstrap/app.ts`;
            break;
        }
        case "build": {
            await $`bun build src/bootstrap/app.ts --target=bun --outfile=dist/app.js`;
            break;
        }
        default: {
            break;
        }
    }
}

main().catch((_err) => {
    process.exit(1);
});
