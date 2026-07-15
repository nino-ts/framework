import type { FilesystemDisk } from "../contracts/filesystem";
/**
 * Watch event callback.
 */
export type WatchCallback = (event: "change" | "rename", path: string) => void | Promise<void>;
/**
 * Options for WatchedAdapter.
 */
export interface WatchedAdapterOptions {
    /**
     * Whether to watch recursively.
     * @default false
     */
    recursive?: boolean;
    /**
     * Debounce time in milliseconds.
     * @default 100
     */
    debounce?: number;
}
/**
 * Watched filesystem decorator.
 *
 * Wraps another filesystem adapter and provides file system watching capabilities
 * using Bun's native FileSystemWatcher (via node:fs watch).
 *
 * @example
 * ```typescript
 * const local = new LocalAdapter({ root: './storage' });
 * const watched = new WatchedAdapter(local);
 *
 * // Watch for changes
 * watched.watch('file.txt', (event, path) => {
 *   console.log(`File ${path} ${event}`);
 * });
 *
 * // Stop watching
 * watched.unwatch('file.txt');
 * ```
 */
export declare class WatchedAdapter implements FilesystemDisk {
    private adapter;
    private watchers;
    private callbacks;
    private recursive;
    private debounce;
    constructor(adapter: FilesystemDisk, options?: WatchedAdapterOptions);
    /**
     * Watch a file or directory for changes.
     */
    watch(path: string, callback: WatchCallback): void;
    /**
     * Stop watching a file or directory.
     */
    unwatch(path: string, callback?: WatchCallback): void;
    /**
     * Stop all watchers.
     */
    unwatchAll(): void;
    /**
     * Get the number of watched paths.
     */
    getWatchCount(): number;
    /**
     * Create a watcher for a path.
     */
    private createWatcher;
    /**
     * Normalize a path.
     */
    private normalizePath;
    get(path: string): Promise<string | null>;
    put(path: string, contents: string | Blob | ArrayBuffer | Uint8Array): Promise<boolean>;
    exists(path: string): Promise<boolean>;
    missing(path: string): Promise<boolean>;
    delete(paths: string | string[]): Promise<boolean>;
    copy(from: string, to: string): Promise<boolean>;
    move(from: string, to: string): Promise<boolean>;
    size(path: string): Promise<number>;
    lastModified(path: string): Promise<number>;
    files(directory?: string): Promise<string[]>;
    allFiles(directory?: string): Promise<string[]>;
    directories(directory?: string): Promise<string[]>;
    allDirectories(directory?: string): Promise<string[]>;
    makeDirectory(path: string): Promise<boolean>;
    deleteDirectory(directory: string): Promise<boolean>;
    append(path: string, data: string): Promise<boolean>;
    prepend(path: string, data: string): Promise<boolean>;
    getVisibility(path: string): Promise<"public" | "private" | null>;
    setVisibility(path: string, visibility: "public" | "private"): Promise<boolean>;
    mimeType(path: string): Promise<string | null>;
    url(path: string): Promise<string>;
    temporaryUrl(path: string, expiresIn: number): Promise<string>;
}
