#!/usr/bin/env bun
import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { parseArgs } from "node:util";
import { $ } from "bun";

const FRAMEWORK_VERSION = readFrameworkVersion();

const { positionals, values } = parseArgs({
    allowPositionals: true,
    args: Bun.argv.slice(2),
    options: {
        help: {
            short: "h",
            type: "boolean",
        },
        host: {
            short: "H",
            type: "string",
        },
        port: {
            short: "p",
            type: "string",
        },
        version: {
            short: "V",
            type: "boolean",
        },
    },
    strict: false,
});

const command = positionals[0];
const localBootstrapEntry = path.join(process.cwd(), "src", "bootstrap", "app.ts");
const publishedBootstrapEntry = path.join(import.meta.dir, "..", "dist", "app.js");

function readFrameworkVersion(): string {
    try {
        const packageJsonPath = path.join(import.meta.dir, "..", "package.json");
        const raw = readFileSync(packageJsonPath, "utf8");
        const parsed = JSON.parse(raw) as { version?: string };
        return parsed.version ?? "0.0.0";
    } catch {
        return "0.0.0";
    }
}

function resolveBootstrapEntry(): string {
    if (existsSync(localBootstrapEntry)) {
        return localBootstrapEntry;
    }

    if (existsSync(publishedBootstrapEntry)) {
        return publishedBootstrapEntry;
    }

    throw new Error(`Bootstrap entrypoint not found. Checked: ${localBootstrapEntry} and ${publishedBootstrapEntry}`);
}

function printHelp(): void {
    console.log(`nino — ninoTS CLI v${FRAMEWORK_VERSION}

Usage:
  nino <command> [options]

Commands:
  dev       Start the development server with hot reload
  start     Start the production server
  build     Build the application entrypoint to dist/app.js
  help      Show this help message

Options:
  -h, --help       Show help
  -V, --version    Show version
  -p, --port       HTTP port (forwarded to bootstrap when supported)
  -H, --host       Hostname bind address
`);
}

function printVersion(): void {
    console.log(FRAMEWORK_VERSION);
}

async function main(): Promise<void> {
    if (values.help || command === "help" || command === undefined) {
        printHelp();
        return;
    }

    if (values.version || command === "version" || command === "--version") {
        printVersion();
        return;
    }

    const entrypoint = resolveBootstrapEntry();
    const portFlag = values.port ? ["--port", values.port] : [];
    const hostFlag = values.host ? ["--host", values.host] : [];

    switch (command) {
        case "dev": {
            await $`bun --hot run ${entrypoint} ${portFlag} ${hostFlag}`;
            break;
        }
        case "start": {
            await $`bun run ${entrypoint} ${portFlag} ${hostFlag}`;
            break;
        }
        case "build": {
            await $`bun build ${entrypoint} --target=bun --outfile=dist/app.js`;
            break;
        }
        default: {
            console.error(`Unknown command: ${command}`);
            printHelp();
            process.exit(1);
        }
    }
}

main().catch((_error: unknown) => {
    process.exit(1);
});
