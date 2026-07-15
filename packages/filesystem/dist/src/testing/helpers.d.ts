import type { FilesystemDisk } from "../contracts/filesystem";
/**
 * Options for creating a test adapter.
 */
export interface CreateTestAdapterOptions {
    /**
     * Type of adapter to create ('local' or 'memory').
     * @default 'local'
     */
    type?: "local" | "memory";
}
/**
 * Result of creating a test adapter.
 */
export interface TestAdapterResult {
    /**
     * The filesystem adapter instance.
     */
    adapter: FilesystemDisk;
    /**
     * Cleanup function to remove test files.
     */
    cleanup: () => Promise<void>;
}
/**
 * Create a test adapter with isolated storage.
 *
 * @param options - Configuration options
 * @returns Adapter instance and cleanup function
 *
 * @example
 * ```typescript
 * const { adapter, cleanup } = await createTestAdapter();
 * await adapter.put('file.txt', 'Content');
 * await cleanup();
 * ```
 */
export declare function createTestAdapter(options?: CreateTestAdapterOptions): Promise<TestAdapterResult>;
/**
 * Assert that a file exists on the given disk.
 *
 * @param disk - The filesystem disk to check
 * @param path - The path to the file
 * @throws Error if the file does not exist
 *
 * @example
 * ```typescript
 * await assertExists(adapter, 'file.txt');
 * ```
 */
export declare function assertExists(disk: FilesystemDisk, path: string): Promise<void>;
/**
 * Assert that a file is missing from the given disk.
 *
 * @param disk - The filesystem disk to check
 * @param path - The path to the file
 * @throws Error if the file exists
 *
 * @example
 * ```typescript
 * await assertMissing(adapter, 'deleted.txt');
 * ```
 */
export declare function assertMissing(disk: FilesystemDisk, path: string): Promise<void>;
/**
 * Run a standard suite of filesystem adapter tests.
 *
 * This function provides a reusable test suite that can be used to verify
 * that any adapter implementation conforms to the FilesystemDisk contract.
 *
 * @param name - Name of the adapter being tested
 * @param createAdapter - Function to create a fresh adapter instance
 *
 * @example
 * ```typescript
 * runFilesystemAdapterTests('LocalAdapter', async () => {
 *   const { adapter, cleanup } = await createTestAdapter({ type: 'local' });
 *   return { adapter, cleanup };
 * });
 * ```
 */
export declare function runFilesystemAdapterTests(name: string, createAdapter: () => Promise<{
    adapter: FilesystemDisk;
    cleanup: () => Promise<void>;
}>): void;
