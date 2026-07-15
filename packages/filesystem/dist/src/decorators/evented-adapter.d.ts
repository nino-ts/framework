import type { FilesystemDisk } from "../contracts/filesystem";
/**
 * Filesystem events.
 */
export type FilesystemEvent = "file.created" | "file.deleted" | "file.moved" | "file.copied" | "file.updated" | "directory.created" | "directory.deleted";
/**
 * Event callback function.
 */
export type EventCallback = (path: string) => void | Promise<void>;
/**
 * Event listener handle.
 */
export interface EventListener {
    event: FilesystemEvent;
    callback: EventCallback;
}
/**
 * Evented filesystem decorator.
 *
 * Wraps another filesystem adapter and emits events for filesystem operations,
 * enabling reactive programming patterns and audit logging.
 *
 * @example
 * ```typescript
 * const local = new LocalAdapter({ root: './storage' });
 * const evented = new EventedAdapter(local);
 *
 * // Listen for file creation
 * evented.on('file.created', (path) => {
 *   console.log(`File created: ${path}`);
 * });
 *
 * // Listen for file deletion
 * evented.on('file.deleted', (path) => {
 *   console.log(`File deleted: ${path}`);
 * });
 *
 * // Operations will emit events
 * await evented.put('file.txt', 'Content'); // Emits 'file.created'
 * await evented.delete('file.txt'); // Emits 'file.deleted'
 * ```
 */
export declare class EventedAdapter implements FilesystemDisk {
    private adapter;
    private listeners;
    constructor(adapter: FilesystemDisk);
    /**
     * Get the contents of a file.
     */
    get(path: string): Promise<string | null>;
    /**
     * Write the contents of a file (emits file.created or file.updated).
     */
    put(path: string, contents: string | Blob | ArrayBuffer | Uint8Array): Promise<boolean>;
    /**
     * Determine if a file exists.
     */
    exists(path: string): Promise<boolean>;
    /**
     * Determine if a file is missing.
     */
    missing(path: string): Promise<boolean>;
    /**
     * Delete the file at a given path (emits file.deleted).
     */
    delete(paths: string | string[]): Promise<boolean>;
    /**
     * Copy a file to a new location (emits file.copied).
     */
    copy(from: string, to: string): Promise<boolean>;
    /**
     * Move a file to a new location (emits file.moved).
     */
    move(from: string, to: string): Promise<boolean>;
    /**
     * Get the file size.
     */
    size(path: string): Promise<number>;
    /**
     * Get the file's last modification time.
     */
    lastModified(path: string): Promise<number>;
    /**
     * Get an array of all files in a directory.
     */
    files(directory?: string): Promise<string[]>;
    /**
     * Get all of the files from the given directory.
     */
    allFiles(directory?: string): Promise<string[]>;
    /**
     * Get all of the directories within a given directory.
     */
    directories(directory?: string): Promise<string[]>;
    /**
     * Get all (recursive) of the directories within a given directory.
     */
    allDirectories(directory?: string): Promise<string[]>;
    /**
     * Create a directory (emits directory.created).
     */
    makeDirectory(path: string): Promise<boolean>;
    /**
     * Recursively delete a directory (emits directory.deleted).
     */
    deleteDirectory(directory: string): Promise<boolean>;
    /**
     * Append data to a file (emits file.updated).
     */
    append(path: string, data: string): Promise<boolean>;
    /**
     * Prepend data to a file (emits file.updated).
     */
    prepend(path: string, data: string): Promise<boolean>;
    /**
     * Get the file visibility.
     */
    getVisibility(path: string): Promise<"public" | "private" | null>;
    /**
     * Set the file visibility (emits file.updated).
     */
    setVisibility(path: string, visibility: "public" | "private"): Promise<boolean>;
    /**
     * Get the file MIME type.
     */
    mimeType(path: string): Promise<string | null>;
    /**
     * Get the URL for a file.
     */
    url(path: string): Promise<string>;
    /**
     * Get a temporary URL for a file.
     */
    temporaryUrl(path: string, expiresIn: number): Promise<string>;
    /**
     * Register an event listener.
     *
     * @param event - The event to listen for
     * @param callback - The callback to invoke when the event is emitted
     * @returns An event listener handle that can be used to remove the listener
     */
    on(event: FilesystemEvent, callback: EventCallback): EventListener;
    /**
     * Remove an event listener.
     *
     * @param listener - The event listener handle to remove
     */
    off(listener: EventListener): void;
    /**
     * Remove all event listeners.
     */
    offAll(): void;
    /**
     * Get the number of listeners for an event.
     */
    listenerCount(event: FilesystemEvent): number;
    /**
     * Emit an event to all registered listeners.
     */
    private emit;
}
