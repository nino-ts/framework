import type { FilesystemDisk } from "../contracts/filesystem";
/**
 * Options for CachedAdapter.
 */
export interface CachedAdapterOptions {
    /**
     * Time-to-live for cache entries in milliseconds.
     * @default 60000 (1 minute)
     */
    ttl?: number;
    /**
     * Maximum number of cache entries.
     * @default 1000
     */
    maxSize?: number;
}
/**
 * Caching filesystem decorator.
 *
 * Wraps another filesystem adapter and caches metadata operations
 * to improve performance. Automatically invalidates cache on write operations.
 *
 * @example
 * ```typescript
 * const local = new LocalAdapter({ root: './storage' });
 * const cached = new CachedAdapter(local, { ttl: 60000 });
 *
 * // First call hits the filesystem
 * const content = await cached.get('file.txt');
 *
 * // Second call (within TTL) hits the cache
 * const cachedContent = await cached.get('file.txt');
 * ```
 */
export declare class CachedAdapter implements FilesystemDisk {
    private adapter;
    private cache;
    private ttl;
    private maxSize;
    constructor(adapter: FilesystemDisk, options?: CachedAdapterOptions);
    /**
     * Get the contents of a file (cached).
     */
    get(path: string): Promise<string | null>;
    /**
     * Write the contents of a file (invalidates cache).
     */
    put(path: string, contents: string | Blob | ArrayBuffer | Uint8Array): Promise<boolean>;
    /**
     * Determine if a file exists (cached).
     */
    exists(path: string): Promise<boolean>;
    /**
     * Determine if a file is missing (cached).
     */
    missing(path: string): Promise<boolean>;
    /**
     * Delete the file at a given path (invalidates cache).
     */
    delete(paths: string | string[]): Promise<boolean>;
    /**
     * Copy a file to a new location (invalidates cache).
     */
    copy(from: string, to: string): Promise<boolean>;
    /**
     * Move a file to a new location (invalidates cache).
     */
    move(from: string, to: string): Promise<boolean>;
    /**
     * Get the file size (cached).
     */
    size(path: string): Promise<number>;
    /**
     * Get the file's last modification time (cached).
     */
    lastModified(path: string): Promise<number>;
    /**
     * Get an array of all files in a directory (cached).
     */
    files(directory?: string): Promise<string[]>;
    /**
     * Get all of the files from the given directory (cached).
     */
    allFiles(directory?: string): Promise<string[]>;
    /**
     * Get all of the directories within a given directory (cached).
     */
    directories(directory?: string): Promise<string[]>;
    /**
     * Get all (recursive) of the directories within a given directory (cached).
     */
    allDirectories(directory?: string): Promise<string[]>;
    /**
     * Create a directory (invalidates cache).
     */
    makeDirectory(path: string): Promise<boolean>;
    /**
     * Recursively delete a directory (invalidates cache).
     */
    deleteDirectory(directory: string): Promise<boolean>;
    /**
     * Append data to a file (invalidates cache).
     */
    append(path: string, data: string): Promise<boolean>;
    /**
     * Prepend data to a file (invalidates cache).
     */
    prepend(path: string, data: string): Promise<boolean>;
    /**
     * Get the file visibility (cached).
     */
    getVisibility(path: string): Promise<"public" | "private" | null>;
    /**
     * Set the file visibility (invalidates cache).
     */
    setVisibility(path: string, visibility: "public" | "private"): Promise<boolean>;
    /**
     * Get the file MIME type (cached).
     */
    mimeType(path: string): Promise<string | null>;
    /**
     * Get the URL for a file (cached).
     */
    url(path: string): Promise<string>;
    /**
     * Get a temporary URL for a file (not cached).
     */
    temporaryUrl(path: string, expiresIn: number): Promise<string>;
    /**
     * Get a value from the cache if it exists and is not expired.
     */
    private getFromCache;
    /**
     * Set a value in the cache.
     */
    private setCache;
    /**
     * Invalidate cache entries for a path.
     */
    private invalidate;
    /**
     * Invalidate all directory cache entries.
     */
    private invalidateDirectoryCache;
    /**
     * Clear all cache entries.
     */
    clearCache(): void;
    /**
     * Get the number of cache entries.
     */
    getCacheSize(): number;
}
