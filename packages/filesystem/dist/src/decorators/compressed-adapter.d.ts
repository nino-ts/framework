import type { FilesystemDisk } from "../contracts/filesystem";
/**
 * Options for CompressedAdapter.
 */
export interface CompressedAdapterOptions {
    /**
     * File extensions to compress.
     * @default All files
     */
    extensions?: string[];
    /**
     * Minimum file size to compress (in bytes).
     * @default 0 (compress all)
     */
    minSize?: number;
    /**
     * Compression level (1-9).
     * @default 6
     */
    level?: number;
}
/**
 * Compressed filesystem decorator.
 *
 * Wraps another filesystem adapter and transparently compresses/decompresses
 * files using Bun's native gzip/gunzip APIs.
 *
 * @example
 * ```typescript
 * const local = new LocalAdapter({ root: './storage' });
 * const compressed = new CompressedAdapter(local, { level: 9 });
 *
 * // Files are automatically compressed on write
 * await compressed.put('large-file.txt', 'Large content...');
 *
 * // Files are automatically decompressed on read
 * const content = await compressed.get('large-file.txt');
 * ```
 */
export declare class CompressedAdapter implements FilesystemDisk {
    private adapter;
    private extensions?;
    private minSize;
    private level;
    constructor(adapter: FilesystemDisk, options?: CompressedAdapterOptions);
    /**
     * Check if a file should be compressed.
     */
    private shouldCompress;
    /**
     * Get the size of content.
     */
    private getContentSize;
    /**
     * Get the contents of a file (decompressed if needed).
     */
    get(path: string): Promise<string | null>;
    /**
     * Write the contents of a file (compressed if applicable).
     */
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
    /**
     * Get compression statistics.
     */
    getCompressionStats(path: string): Promise<{
        originalSize: number;
        compressedSize: number;
        ratio: number;
    } | null>;
}
