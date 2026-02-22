import { appendFile, copyFile, mkdir, readdir, rename, rm, stat } from 'node:fs/promises';
import path from 'node:path';
import type { FilesystemDisk } from '@/contracts/filesystem';

export interface LocalAdapterConfig {
  root: string;
}

/**
 * Local filesystem driver utilizing native Bun and Node.js primitives.
 */
export class LocalAdapter implements FilesystemDisk {
  private readonly root: string;

  constructor(config: LocalAdapterConfig) {
    this.root = config.root;
  }

  /**
   * Resolves a given path against the absolute root directory.
   */
  private applyPathPrefix(targetPath: string): string {
    return path.join(this.root, targetPath);
  }

  /**
   * Strip the root prefix from absolute paths, returning relative storage paths.
   */
  private removePathPrefix(absolutePath: string): string {
    return path.relative(this.root, absolutePath).split(path.sep).join('/');
  }

  async exists(targetPath: string): Promise<boolean> {
    const file = Bun.file(this.applyPathPrefix(targetPath));
    return await file.exists();
  }

  async get(targetPath: string): Promise<string | null> {
    const file = Bun.file(this.applyPathPrefix(targetPath));
    if (!(await file.exists())) {
      return null;
    }
    return await file.text();
  }

  async put(targetPath: string, contents: string | Blob | ArrayBuffer | Uint8Array): Promise<boolean> {
    try {
      const fullPath = this.applyPathPrefix(targetPath);
      // Ensure the directory exists before writing
      await mkdir(path.dirname(fullPath), { recursive: true });
      await Bun.write(fullPath, contents);
      return true;
    } catch {
      return false;
    }
  }

  async append(targetPath: string, data: string): Promise<boolean> {
    try {
      const fullPath = this.applyPathPrefix(targetPath);
      await mkdir(path.dirname(fullPath), { recursive: true });
      await appendFile(fullPath, data);
      return true;
    } catch {
      return false;
    }
  }

  async delete(paths: string | string[]): Promise<boolean> {
    const targetPaths = Array.isArray(paths) ? paths : [paths];
    let success = true;

    for (const p of targetPaths) {
      try {
        const fullPath = this.applyPathPrefix(p);
        const file = Bun.file(fullPath);
        if (await file.exists()) {
          // unlink using nodes rm since Bun.file(..).delete() is still partial
          await rm(fullPath, { force: true });
        }
      } catch {
        success = false;
      }
    }

    return success;
  }

  async copy(from: string, to: string): Promise<boolean> {
    try {
      const source = this.applyPathPrefix(from);
      const destination = this.applyPathPrefix(to);
      await mkdir(path.dirname(destination), { recursive: true });
      await copyFile(source, destination);
      return true;
    } catch {
      return false;
    }
  }

  async move(from: string, to: string): Promise<boolean> {
    try {
      const source = this.applyPathPrefix(from);
      const destination = this.applyPathPrefix(to);
      await mkdir(path.dirname(destination), { recursive: true });
      await rename(source, destination);
      return true;
    } catch {
      return false;
    }
  }

  async size(targetPath: string): Promise<number> {
    const file = Bun.file(this.applyPathPrefix(targetPath));
    if (!(await file.exists())) return 0;
    return file.size;
  }

  async lastModified(targetPath: string): Promise<number> {
    try {
      const stats = await stat(this.applyPathPrefix(targetPath));
      return Math.floor(stats.mtimeMs / 1000); // Unix timestamp (seconds)
    } catch {
      return 0;
    }
  }

  async files(directory = ''): Promise<string[]> {
    return this.scanDirectory(directory, false, true);
  }

  async allFiles(directory = ''): Promise<string[]> {
    return this.scanDirectory(directory, true, true);
  }

  async directories(directory = ''): Promise<string[]> {
    return this.scanDirectory(directory, false, false);
  }

  async allDirectories(directory = ''): Promise<string[]> {
    return this.scanDirectory(directory, true, false);
  }

  async makeDirectory(targetPath: string): Promise<boolean> {
    try {
      await mkdir(this.applyPathPrefix(targetPath), { recursive: true });
      return true;
    } catch {
      return false;
    }
  }

  async deleteDirectory(directory: string): Promise<boolean> {
    try {
      await rm(this.applyPathPrefix(directory), { force: true, recursive: true });
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Helper to scan directories using pure directory parsing matching Glob constraints.
   */
  private async scanDirectory(directory: string, recursive: boolean, returnFiles: boolean): Promise<string[]> {
    const fullDir = directory ? this.applyPathPrefix(directory) : this.root;
    const results: string[] = [];

    try {
      const entries = await readdir(fullDir, { recursive, withFileTypes: true });

      for (const entry of entries) {
        // Bun's native readdir recursive puts everything globally or splits it on subpaths.
        const isMatch = returnFiles ? entry.isFile() : entry.isDirectory();
        if (isMatch) {
          const absolutePath = path.join(entry.parentPath || fullDir, entry.name);
          // Only normalize strings matching the exact paths safely
          const rel = this.removePathPrefix(absolutePath);
          // In some OS configs relative output is missing the base directory param from original query
          results.push(rel.replace(/\\/g, '/'));
        }
      }

      return results;
    } catch {
      return [];
    }
  }
}
