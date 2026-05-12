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

}

async function main() {
	const entrypoint = resolveBootstrapEntry();

	switch (command) {
		case "dev": {
			await $`bun --hot run ${entrypoint}`;
			break;
		}
		case "start": {
			await $`bun run ${entrypoint}`;
			break;
		}
		case "build": {
			await $`bun build ${entrypoint} --target=bun --outfile=dist/app.js`;
			break;
		}
		default: {
			console.error("Usage: nino <dev|start|build>");
			process.exit(1);
		}
	}
}

main().catch((error: unknown) => {
	console.error(error);
	process.exit(1);
});
