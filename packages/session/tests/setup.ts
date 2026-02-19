/**
 * Test setup for @ninots/session.
 *
 * @packageDocumentation
 */

/**
 * Helper to clean up test session files.
 *
 * @param path - Directory path to clean
 */
export async function cleanSessionFiles(path: string): Promise<void> {
    const { Glob } = await import('bun');
    const glob = new Glob('*');

    for await (const file of glob.scan({ cwd: path })) {
        if (!file.startsWith('.')) {
            try {
                await Bun.file(`${path}/${file}`).delete();
            } catch {
                // Ignore errors during cleanup
            }
        }
    }
}
