import type { FilesystemDisk } from "../contracts/filesystem";
/**
 * In-memory filesystem adapter for testing.
 *
 * Implements the FilesystemDisk contract using a Map for storage,
 * providing fast, isolated filesystem operations without disk I/O.
 *
 * @example
 * ```typescript
 * const adapter = new MemoryAdapter();
 * await adapter.put('file.txt', 'Content');
 * const content = await adapter.get('file.txt');
 * ```
 */
export declare class MemoryAdapter implements FilesystemDisk {
    private storage;
    private directorySet;
    private visibility;
    /**
     * Get the contents of a file.
     *
     * @param path - The path to the file
     * @returns The file contents as string, or null if missing
     */
    get(path: string): Promise<string | null>;
    /**
     * Write the contents of a file.
     *
     * @param path - The path to the file
     * @param contents - The contents to write (string, Blob, ArrayBuffer, or Uint8Array)
     * @returns True on success, false on failure
     */
    put(path: string, contents: string | Blob | ArrayBuffer | Uint8Array): Promise<boolean>;
    /**
     * Determine if a file exists.
     *
     * @param path - The path to check
     * @returns True if the file exists, false otherwise
     */
    exists(path: string): Promise<boolean>;
    /**
     * Determine if a file is missing.
     *
     * @param path - The path to check
     * @returns True if the file is missing, false otherwise
     */
    missing(path: string): Promise<boolean>;
    /**
     * Delete the file at a given path.
     *
     * @param paths - The path(s) to the file(s)
     * @returns True if all files were deleted successfully
     */
    delete(paths: string | string[]): Promise<boolean>;
    /**
     * Copy a file to a new location.
     *
     * @param from - The original file path
     * @param to - The destination path
     * @returns True on success, false on failure
     */
    copy(from: string, to: string): Promise<boolean>;
    /**
     * Move a file to a new location.
     *
     * @param from - The original file path
     * @param to - The destination path
     * @returns True on success, false on failure
     */
    move(from: string, to: string): Promise<boolean>;
    /**
     * Get the file size of a given file.
     *
     * @param path - The file path
     * @returns The size in bytes, or 0 if file doesn't exist
     */
    size(path: string): Promise<number>;
    /**
     * Get the file's last modification time.
     *
     * @param path - The file path
     * @returns The UNIX timestamp of the last modification, or 0 on error
     */
    lastModified(path: string): Promise<number>;
    /**
     * Get an array of all files in a directory (non-recursive).
     *
     * @param directory - The directory path (defaults to root)
     * @returns An array of file paths
     */
    files(directory?: string): Promise<string[]>;
    /**
     * Get all of the files from the given directory (recursive).
     *
     * @param directory - The directory path (defaults to root)
     * @returns An array of all file paths
     */
    allFiles(directory?: string): Promise<string[]>;
    /**
     * Get all of the directories within a given directory (non-recursive).
     *
     * @param directory - The directory path (defaults to root)
     * @returns An array of directory paths
     */
    directories(directory?: string): Promise<string[]>;
    /**
     * Get all (recursive) of the directories within a given directory.
     *
     * @param directory - The directory path (defaults to root)
     * @returns An array of all directory paths
     */
    allDirectories(directory?: string): Promise<string[]>;
    /**
     * Create a directory.
     *
     * @param path - The directory path
     * @returns True on success, false on failure
     */
    makeDirectory(path: string): Promise<boolean>;
    /**
     * Recursively delete a directory.
     *
     * @param directory - The directory path
     * @returns True on success, false on failure
     */
    deleteDirectory(directory: string): Promise<boolean>;
    /**
     * Append data to a file.
     *
     * @param path - The path to the file
     * @param data - The data to append
     * @returns True on success, false on failure
     */
    append(path: string, data: string): Promise<boolean>;
    /**
     * Prepend data to a file.
     *
     * @param path - The path to the file
     * @param data - The data to prepend
     * @returns True on success, false on failure
     */
    prepend(path: string, data: string): Promise<boolean>;
    /**
     * Get the file visibility.
     *
     * @param path - The file path
     * @returns The visibility ('public' or 'private'), or null if not set
     */
    getVisibility(path: string): Promise<"public" | "private" | null>;
    /**
     * Set the file visibility.
     *
     * @param path - The file path
     * @param visibility - The visibility ('public' or 'private')
     * @returns True on success, false on failure
     */
    setVisibility(path: string, visibility: "public" | "private"): Promise<boolean>;
    /**
     * Get the file MIME type.
     *
     * @param path - The file path
     * @returns The MIME type, or null if not determinable
     */
    mimeType(path: string): Promise<string | null>;
    /**
     * Get the URL for a file.
     *
     * @param path - The file path
     * @returns The file URL
     */
    url(path: string): Promise<string>;
    /**
     * Get a temporary URL for a file.
     *
     * @param path - The file path
     * @param expiresIn - Expiration time in seconds
     * @returns The temporary URL
     */
    temporaryUrl(path: string, expiresIn: number): Promise<string>;
    /**
     * Normalize a path by removing leading/trailing slashes and normalizing separators.
     *
     * @param path - The path to normalize
     * @returns The normalized path
     */
    private normalizePath;
    /**
     * Scan a directory and return files or directories.
     *
     * @param directory - The directory to scan
     * @param recursive - Whether to scan recursively
     * @param returnFiles - True to return files, false for directories
     * @returns An array of paths
     */
    private scanDirectory;
}
