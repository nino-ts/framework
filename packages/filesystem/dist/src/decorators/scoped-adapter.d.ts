import type { FilesystemDisk } from "../contracts/filesystem";
/**
 * Options for ScopedAdapter.
 */
export interface ScopedAdapterOptions {
    /**
     * Whether to automatically create the scope directory.
     * @default false
     */
    createScope?: boolean;
}
/**
 * Scoped filesystem decorator.
 *
 * Wraps another filesystem adapter and prefixes all paths with a scope,
 * providing isolated namespaces within the same filesystem.
 *
 * @example
 * ```typescript
 * const local = new LocalAdapter({ root: './storage' });
 *
 * // Create scoped adapters for different users
 * const user1Storage = new ScopedAdapter(local, 'users/1');
 * const user2Storage = new ScopedAdapter(local, 'users/2');
 *
 * // Operations are automatically scoped
 * await user1Storage.put('file.txt', 'User 1 content');
 * await user2Storage.put('file.txt', 'User 2 content');
 *
 * // Files are isolated
 * const user1Files = await user1Storage.files(); // ['users/1/file.txt']
 * const user2Files = await user2Storage.files(); // ['users/2/file.txt']
 * ```
 */
export declare class ScopedAdapter implements FilesystemDisk {
    private adapter;
    private scope;
    private createScope;
    constructor(adapter: FilesystemDisk, scope: string, options?: ScopedAdapterOptions);
    /**
     * Get the contents of a file (scoped).
     */
    get(path: string): Promise<string | null>;
    /**
     * Write the contents of a file (scoped).
     */
    put(path: string, contents: string | Blob | ArrayBuffer | Uint8Array): Promise<boolean>;
    /**
     * Determine if a file exists (scoped).
     */
    exists(path: string): Promise<boolean>;
    /**
     * Determine if a file is missing (scoped).
     */
    missing(path: string): Promise<boolean>;
    /**
     * Delete the file at a given path (scoped).
     */
    delete(paths: string | string[]): Promise<boolean>;
    /**
     * Copy a file to a new location (scoped).
     */
    copy(from: string, to: string): Promise<boolean>;
    /**
     * Move a file to a new location (scoped).
     */
    move(from: string, to: string): Promise<boolean>;
    /**
     * Get the file size (scoped).
     */
    size(path: string): Promise<number>;
    /**
     * Get the file's last modification time (scoped).
     */
    lastModified(path: string): Promise<number>;
    /**
     * Get an array of all files in a directory (scoped).
     */
    files(directory?: string): Promise<string[]>;
    /**
     * Get all of the files from the given directory (scoped).
     */
    allFiles(directory?: string): Promise<string[]>;
    /**
     * Get all of the directories within a given directory (scoped).
     */
    directories(directory?: string): Promise<string[]>;
    /**
     * Get all (recursive) of the directories within a given directory (scoped).
     */
    allDirectories(directory?: string): Promise<string[]>;
    /**
     * Create a directory (scoped).
     */
    makeDirectory(path: string): Promise<boolean>;
    /**
     * Recursively delete a directory (scoped).
     */
    deleteDirectory(directory: string): Promise<boolean>;
    /**
     * Append data to a file (scoped).
     */
    append(path: string, data: string): Promise<boolean>;
    /**
     * Prepend data to a file (scoped).
     */
    prepend(path: string, data: string): Promise<boolean>;
    /**
     * Get the file visibility (scoped).
     */
    getVisibility(path: string): Promise<"public" | "private" | null>;
    /**
     * Set the file visibility (scoped).
     */
    setVisibility(path: string, visibility: "public" | "private"): Promise<boolean>;
    /**
     * Get the file MIME type (scoped).
     */
    mimeType(path: string): Promise<string | null>;
    /**
     * Get the URL for a file (scoped).
     */
    url(path: string): Promise<string>;
    /**
     * Get a temporary URL for a file (scoped).
     */
    temporaryUrl(path: string, expiresIn: number): Promise<string>;
    /**
     * Apply the scope prefix to a path.
     */
    private applyScope;
    /**
     * Remove the scope prefix from a path.
     */
    private removeScope;
    /**
     * Normalize a path.
     */
    private normalizePath;
    /**
     * Normalize a scope.
     */
    private normalizeScope;
    /**
     * Get the scope prefix.
     */
    getScope(): string;
}
