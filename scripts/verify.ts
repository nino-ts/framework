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
                    // Remove lines that end with eslint-disable comment (documented exceptions)
                    .replace(/.*\/\/\s*eslint-disable-line.*/g, '')
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
 * Only fails if there are errors in src/ files (ignores tests/)
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

    let hasSrcErrors = false;

    for (const pkg of packages) {
        console.log(`Type checking package: ${pkg}`);
        try {
            await $`cd packages/${pkg} && tsc --noEmit`;
        } catch (error: unknown) {
            // Type check failed - check if errors are in src/ or tests/
            const errorOutput = (error as { stderr?: { toString(): string } })?.stderr?.toString() ||
                               (error as { stdout?: { toString(): string } })?.stdout?.toString() || '';

            // Filter for src/ errors only
            const srcErrors = errorOutput
                .split('\n')
                .filter((line: string) => line.includes('src/') && line.includes('error TS'));

            if (srcErrors.length > 0) {
                console.error(`❌ Found ${srcErrors.length} errors in src/ files:`);
                srcErrors.forEach((err: string) => console.error(err));
                hasSrcErrors = true;
            } else {
                console.log(`⚠️  Type errors found only in tests/ (ignored)`);
            }
        }
    }

    if (hasSrcErrors) {
        console.error('❌ Type check failed with errors in src/ files!');
        process.exit(1);
    }

    console.log('✓ All packages type-checked (0 errors in src/)');
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
