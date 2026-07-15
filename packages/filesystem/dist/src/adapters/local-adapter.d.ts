import type { FilesystemDisk } from "../contracts/filesystem";
export interface LocalAdapterConfig {
    root: string;
}
/**
 * Local filesystem driver utilizing native Bun and Node.js primitives.
 *
 * Implements the FilesystemDisk contract for local disk operations,
 * providing a consistent API for file and directory management.
 */
export declare class LocalAdapter implements FilesystemDisk {
    private readonly root;
    constructor(config: LocalAdapterConfig);
    /**
     * Resolves a given path against the absolute root directory.
     *
     * @param targetPath - The relative path to resolve
     * @returns The absolute path
     */
    private applyPathPrefix;
    /**
     * Strip the root prefix from absolute paths, returning relative storage paths.
     *
     * @param absolutePath - The absolute path to normalize
     * @returns The relative path with forward slashes
     */
    private removePathPrefix;
    /**
     * Ensures the directory structure for a given file path exists.
     *
     * @param filePath - The full file path
     */
    private ensureDirectory;
    /**
     * Determine if a file exists.
     *
     * @param targetPath - The path to check
     * @returns True if the file exists, false otherwise
     */
    exists(targetPath: string): Promise<boolean>;
    /**
     * Get the contents of a file.
     *
     * @param targetPath - The path to the file
     * @returns The file contents as string, or null if missing
     */
    get(targetPath: string): Promise<string | null>;
    /**
     * Write the contents of a file.
     *
     * @param targetPath - The path to the file
     * @param contents - The contents to write (string, Blob, ArrayBuffer, or Uint8Array)
     * @returns True on success, false on failure
     */
    put(targetPath: string, contents: string | Blob | ArrayBuffer | Uint8Array): Promise<boolean>;
    /**
     * Append data to a file.
     *
     * @param targetPath - The path to the file
     * @param data - The data to append
     * @returns True on success, false on failure
     */
    append(targetPath: string, data: string): Promise<boolean>;
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
     * @param targetPath - The file path
     * @returns The size in bytes, or 0 if file doesn't exist
     */
    size(targetPath: string): Promise<number>;
    /**
     * Get the file's last modification time.
     *
     * @param targetPath - The file path
     * @returns The UNIX timestamp of the last modification, or 0 on error
     */
    lastModified(targetPath: string): Promise<number>;
    getVisibility(targetPath: string): Promise<string | null>;
    setVisibility(_targetPath: string, _visibility: string): Promise<boolean>;
    mimeType(targetPath: string): Promise<string | null>;
    url(targetPath: string): Promise<string>;
    temporaryUrl(path: string, expiresInSeconds: number): Promise<string>;
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
     * @param targetPath - The directory path
     * @returns True on success, false on failure
     */
    makeDirectory(targetPath: string): Promise<boolean>;
    /**
     * Recursively delete a directory.
     *
     * @param directory - The directory path
     * @returns True on success, false on failure
     */
    deleteDirectory(directory: string): Promise<boolean>;
    /**
     * Helper to scan directories using pure directory parsing.
     *
     * @param directory - The directory to scan
     * @param recursive - Whether to scan recursively
     * @param returnFiles - True to return files, false for directories
     * @returns An array of relative paths
     */
    private scanDirectory;
}
