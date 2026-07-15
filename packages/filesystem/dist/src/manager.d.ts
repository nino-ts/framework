import type { FilesystemDisk } from "./contracts/filesystem";
export interface FilesystemConfig {
    /**
     * The default disk to be used when no specific disk is requested.
     */
    default: string;
    /**
     * Configurations for the available storage disks.
     */
    disks: Record<string, Record<string, unknown>>;
}
export type DiskFactory = (config: Record<string, unknown>) => FilesystemDisk;
/**
 * Manages filesystem disks and resolves configurations into active driver instances.
 */
export declare class FilesystemManager implements FilesystemDisk {
    private config;
    private customCreators;
    private disks;
    constructor(config: FilesystemConfig);
    /**
     * Get a filesystem disk instance.
     *
     * @param name - The name of the configured disk
     */
    disk(name?: string): FilesystemDisk;
    /**
     * Resolve the given disk configuration.
     */
    private resolve;
    /**
     * Get the system's default disk name.
     */
    getDefaultDisk(): string;
    /**
     * Get the configuration for a given disk.
     */
    private getConfig;
    /**
     * Register a custom driver creator.
     */
    extend(driver: string, callback: DiskFactory): this;
    exists(path: string): Promise<boolean>;
    get(path: string): Promise<string | null>;
    put(path: string, contents: string | Blob | ArrayBuffer | Uint8Array): Promise<boolean>;
    delete(path: string | string[]): Promise<boolean>;
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
    getVisibility(path: string): Promise<string | null>;
    setVisibility(path: string, visibility: string): Promise<boolean>;
    mimeType(path: string): Promise<string | null>;
    url(path: string): Promise<string>;
    temporaryUrl(path: string, expiresInSeconds: number): Promise<string>;
}
