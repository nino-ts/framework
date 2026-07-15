import type { Store } from "../contracts/store";
/**
 * FileStore implements an asynchronous cache driver storing values in the local filesystem.
 * Items are saved accurately via `Bun.file()` and `Bun.write()` inside JSON payloads.
 */
export declare class FileStore implements Store {
    protected directory: string;
    constructor(directory: string);
    /**
     * Hashes the given key into a reliable MD5 filename ending in .json.
     */
    protected getPath(key: string): string;
    get<T>(key: string): Promise<T | undefined>;
    put(key: string, value: unknown, ttlSeconds?: number): Promise<boolean>;
    increment(key: string, value?: number): Promise<number | boolean>;
    decrement(key: string, value?: number): Promise<number | boolean>;
    forever(key: string, value: unknown): Promise<boolean>;
    forget(key: string): Promise<boolean>;
    flush(): Promise<boolean>;
    getPrefix(): string;
}
