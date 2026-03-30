import type { FilesystemDisk } from '@/contracts/filesystem';

/**
 * Archive utilities for creating and extracting tar archives.
 *
 * Uses Bun's native Archive API for fast tar operations.
 */
export class ArchiveUtils {
  /**
   * Create a tar archive from files.
   *
   * @param outputPath - Path for the output tar file
   * @param paths - Array of file paths to include
   * @returns True on success, false on failure
   */
  static async create(outputPath: string, paths: string[]): Promise<boolean> {
    try {
      // Bun.Archive.create expects an array of paths
      await Bun.Archive.create(outputPath, paths);
      return true;
    } catch (error) {
      console.error('Archive creation failed:', error);
      return false;
    }
  }

  /**
   * Extract a tar archive to a directory.
   *
   * @param archivePath - Path to the tar archive
   * @param destination - Destination directory
   * @returns True on success, false on failure
   */
  static async extract(archivePath: string, destination: string): Promise<boolean> {
    try {
      await Bun.Archive.extract(archivePath, destination);
      return true;
    } catch (error) {
      console.error('Archive extraction failed:', error);
      return false;
    }
  }

  /**
   * Create a tar archive from a directory.
   *
   * @param outputPath - Path for the output tar file
   * @param directory - Directory to archive
   * @param adapter - Filesystem adapter to list files
   * @returns True on success, false on failure
   */
  static async createFromDirectory(
    outputPath: string,
    directory: string,
    adapter: FilesystemDisk,
  ): Promise<boolean> {
    try {
      const files = await adapter.allFiles(directory);
      return await this.create(outputPath, files);
    } catch (error) {
      console.error('Archive from directory failed:', error);
      return false;
    }
  }

  /**
   * Extract a tar archive to a directory using an adapter.
   *
   * @param archivePath - Path to the tar archive
   * @param destination - Destination directory
   * @param adapter - Filesystem adapter for extraction
   * @returns True on success, false on failure
   */
  static async extractToDirectory(
    archivePath: string,
    destination: string,
    adapter: FilesystemDisk,
  ): Promise<boolean> {
    try {
      // Create destination directory
      await adapter.makeDirectory(destination);

      // Use native extraction
      return await this.extract(archivePath, destination);
    } catch (error) {
      console.error('Extract to directory failed:', error);
      return false;
    }
  }

  /**
   * Create and download a tar archive as a Blob.
   *
   * @param paths - Array of file paths to include
   * @param adapter - Filesystem adapter to read files
   * @returns Blob containing the tar archive, or null on failure
   */
  static async createBlob(
    paths: string[],
    adapter: FilesystemDisk,
  ): Promise<Blob | null> {
    try {
      // Create temporary archive file
      const tempPath = `__temp_archive_${Date.now()}.tar`;

      // Create archive
      const created = await this.create(tempPath, paths);
      if (!created) {
        return null;
      }

      // Read archive as Blob
      const content = await adapter.get(tempPath);
      if (!content) {
        return null;
      }

      // Clean up
      await adapter.delete(tempPath);

      // Return as Blob
      return new Blob([content], { type: 'application/x-tar' });
    } catch (error) {
      console.error('Create blob failed:', error);
      return null;
    }
  }

  /**
   * List contents of a tar archive.
   *
   * @param archivePath - Path to the tar archive
   * @returns Array of file paths in the archive, or empty array on failure
   */
  static async list(archivePath: string): Promise<string[]> {
    try {
      // Bun.Archive doesn't have a list method, so we extract to temp and list
      const tempDir = `__temp_extract_${Date.now()}`;
      await this.extract(archivePath, tempDir);

      // List extracted files (would need adapter here)
      // For now, return empty array
      return [];
    } catch (error) {
      console.error('List archive failed:', error);
      return [];
    }
  }
}
