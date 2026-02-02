/**
 * Verification scripts using Bun native features
 *
 * @packageDocumentation
 */

import { $ } from 'bun';
import { readdir, readFile } from 'fs/promises';
import { join } from 'path';

/**
 * Verify no 'any' types in source files
 */
export async function verifyNoAny(): Promise<void> {
    const packages = await readdir('packages');
    let foundAny = false;

    for (const pkg of packages) {
        const srcPath = join('packages', pkg, 'src');
        try {
            const files = await readdir(srcPath, { recursive: true });
            const tsFiles = files.filter(
                (f) =>
                    typeof f === 'string' &&
                    f.endsWith('.ts') &&
                    !f.includes('.legacy.ts'),
            );

            for (const file of tsFiles) {
                const content = await readFile(
                    join(srcPath, file as string),
                    'utf-8',
                );

                // Remove comments and strings before checking
                const withoutComments = content
                    // Remove multiline comments /* ... */
                    .replace(/\/\*[\s\S]*?\*\//g, '')
                    // Remove single-line comments // ...
                    .replace(/\/\/.*/g, '')
                    // Remove template literals `...`
                    .replace(/`(?:[^`\\]|\\.)*`/g, '')
                    // Remove double-quoted strings "..."
                    .replace(/"(?:[^"\\]|\\.)*"/g, '')
                    // Remove single-quoted strings '...'
                    .replace(/'(?:[^'\\]|\\.)*'/g, '')
                    // Remove mixin constructor pattern: new (...args: any[]) => T
                    // This is required by TypeScript for mixins (TS2545)
                    .replace(/new\s*\(\s*\.\.\.\s*args\s*:\s*any\[\]\s*\)\s*=>\s*\w+/g, '');

                if (/\bany\b/.test(withoutComments)) {
                    console.error(
                        `❌ Found 'any' type in: packages/${pkg}/src/${file}`,
                    );
                    foundAny = true;
                }
            }
        } catch {
            // Skip packages without src directory
        }
    }

    if (foundAny) {
        console.error('❌ Found any types in source files!');
        process.exit(1);
    }
    console.log('✓ No \'any\' types found');
}

/**
 * Type check all packages using Bun shell
 */
export async function typeCheckPackages(): Promise<void> {
    const packages = [
        'container',
        'http',
        'middleware',
        'console',
        'routing',
        'foundation',
        'orm',
    ];

    for (const pkg of packages) {
        console.log(`Type checking package: ${pkg}`);
        await $`cd packages/${pkg} && tsc --noEmit`;
    }
    console.log('✓ All packages type-checked');
}

// Run if called directly
if (import.meta.main) {
    const command = process.argv[2];

    if (command === 'no-any') {
        await verifyNoAny();
    } else if (command === 'type-check') {
        await typeCheckPackages();
    } else {
        console.error(
            'Usage: bun run scripts/verify.ts [no-any|type-check]',
        );
        process.exit(1);
    }
}
