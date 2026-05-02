#!/usr/bin/env bun
import { parseArgs } from 'node:util';
import { $ } from 'bun';

const { positionals } = parseArgs({
  allowPositionals: true,
  args: Bun.argv,
  options: {
    host: {
      short: 'h',
      type: 'string',
    },
    port: {
      short: 'p',
      type: 'string',
    },
  },
  strict: false,
});

// Bun.argv = ['/path/to/bun', '/path/to/nino.ts', 'dev']
const command = positionals[2];

async function main() {
  switch (command) {
    case 'dev': {
      console.log('🚀 Starting ninoTS in development mode...');
      await $`bun --hot run src/bootstrap/app.ts`;
      break;
    }
    case 'start': {
      console.log('🚀 Starting ninoTS...');
      await $`bun run src/bootstrap/app.ts`;
      break;
    }
    case 'build': {
      console.log('📦 Building ninoTS application...');
      await $`bun build src/bootstrap/app.ts --target=bun --outfile=dist/app.js`;
      console.log('✅ Build complete: dist/app.js');
      break;
    }
    default: {
      console.log(
        `
ninoTS CLI v0.3.0

Usage:
  nino <command> [options]

Commands:
  dev      Start the development server with hot-reloading
  build    Build the application for production
  start    Start the production server

Options:
  -p, --port <port>   Port to listen on (not fully implemented yet)
  -h, --host <host>   Host to bind to (not fully implemented yet)
      `.trim(),
      );
      break;
    }
  }
}

main().catch((err) => {
  console.error('Fatal error:', err);
  process.exit(1);
});
