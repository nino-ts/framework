import type { FilesystemDisk } from "../contracts/filesystem";
/**
 * Archive utilities for creating and extracting tar archives.
 *
 * Uses Bun's native Archive API for fast tar operations.
 */
export declare function create(outputPath: string, paths: string[]): Promise<boolean>;
/**
 * Extract a tar archive to a directory.
 *
 * @param archivePath - Path to the tar archive
 * @param destination - Destination directory
 * @returns True on success, false on failure
 */
export declare function extract(archivePath: string, destination: string): Promise<boolean>;
/**
 * Create a tar archive from a directory.
 *
 * @param outputPath - Path for the output tar file
 * @param directory - Directory to archive
 * @param adapter - Filesystem adapter to list files
 * @returns True on success, false on failure
 */
export declare function createFromDirectory(outputPath: string, directory: string, adapter: FilesystemDisk): Promise<boolean>;
/**
 * Extract a tar archive to a directory using an adapter.
 *
 * @param archivePath - Path to the tar archive
 * @param destination - Destination directory
 * @param adapter - Filesystem adapter for extraction
 * @returns True on success, false on failure
 */
export declare function extractToDirectory(archivePath: string, destination: string, adapter: FilesystemDisk): Promise<boolean>;
/**
 * Create and download a tar archive as a Blob.
 *
 * @param paths - Array of file paths to include
 * @param adapter - Filesystem adapter to read files
 * @returns Blob containing the tar archive, or null on failure
 */
export declare function createBlob(paths: string[], adapter: FilesystemDisk): Promise<Blob | null>;
/**
 * List contents of a tar archive.
 *
 * @param archivePath - Path to the tar archive
 * @returns Array of file paths in the archive, or empty array on failure
 */
export declare function list(archivePath: string): Promise<string[]>;
export declare const ArchiveUtils: {
    create: typeof create;
    createBlob: typeof createBlob;
    createFromDirectory: typeof createFromDirectory;
    extract: typeof extract;
    extractToDirectory: typeof extractToDirectory;
    list: typeof list;
};
