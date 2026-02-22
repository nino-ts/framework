import fs from 'node:fs';
import path from 'node:path';
import { Glob } from 'bun';
import type { Store } from '../contracts/store';

interface CachePayload<T> {
  value: T;
  expiresAt: number | null;
}

/**
 * FileStore implements an asynchronous cache driver storing values in the local filesystem.
 * Items are saved accurately via `Bun.file()` and `Bun.write()` inside JSON payloads.
 */
export class FileStore implements Store {
  constructor(protected directory: string) {
    if (!fs.existsSync(this.directory)) {
      fs.mkdirSync(this.directory, { recursive: true });
    }
  }

  /**
   * Hashes the given key into a reliable MD5 filename ending in .json.
   */
  protected getPath(key: string): string {
    const hasher = new Bun.CryptoHasher('md5');
    hasher.update(key);
    const hash = hasher.digest('hex');
    return path.join(this.directory, `${hash}.json`);
  }

  async get<T>(key: string): Promise<T | undefined> {
    const file = Bun.file(this.getPath(key));

    if (!(await file.exists())) {
      return undefined;
    }

    try {
      const payload: CachePayload<T> = await file.json();

      if (payload.expiresAt !== null && Date.now() > payload.expiresAt) {
        // Asynchronous native un-linking
        await file.delete();
        return undefined;
      }

      return payload.value;
    } catch {
      return undefined;
    }
  }

  async put(key: string, value: unknown, ttlSeconds?: number): Promise<boolean> {
    const expiresAt = ttlSeconds ? Date.now() + ttlSeconds * 1000 : null;
    const payload: CachePayload<unknown> = { expiresAt, value };

    try {
      await Bun.write(this.getPath(key), JSON.stringify(payload));
      return true;
    } catch {
      return false;
    }
  }

  async increment(key: string, value = 1): Promise<number | boolean> {
    const current = (await this.get(key)) as number | undefined;
    const next = (current ?? 0) + value;

    const success = await this.put(key, next); // Increments remove TTL
    return success ? next : false;
  }

  async decrement(key: string, value = 1): Promise<number | boolean> {
    const current = (await this.get(key)) as number | undefined;
    const next = (current ?? 0) - value;

    const success = await this.put(key, next);
    return success ? next : false;
  }

  async forever(key: string, value: unknown): Promise<boolean> {
    const payload: CachePayload<unknown> = { expiresAt: null, value };
    try {
      await Bun.write(this.getPath(key), JSON.stringify(payload));
      return true;
    } catch {
      return false;
    }
  }

  async forget(key: string): Promise<boolean> {
    const file = Bun.file(this.getPath(key));
    if (!(await file.exists())) {
      return false;
    }

    await file.delete();
    return true;
  }

  async flush(): Promise<boolean> {
    const glob = new Glob('*.json');
    for await (const file of glob.scan(this.directory)) {
      await Bun.file(path.join(this.directory, file)).delete();
    }
    return true;
  }

  getPrefix(): string {
    return '';
  }
}
