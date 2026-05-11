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
const cwdEntry = path.resolve(process.cwd(), "src/bootstrap/app.ts");
const packageEntry = path.resolve(import.meta.dir, "../src/bootstrap/app.ts");

function resolveBootstrapEntry(): string {
	if (existsSync(cwdEntry)) {
		return cwdEntry;
	}

	if (existsSync(packageEntry)) {
		return packageEntry;
	}

	return cwdEntry;
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
			break;
		}
	}
}

main().catch((error: unknown) => {
	console.error(error);
	process.exit(1);
});
