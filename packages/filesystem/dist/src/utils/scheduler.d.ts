import type { FilesystemDisk } from "../contracts/filesystem";
/**
 * Cron job callback.
 */
export type CronJobCallback = () => void | Promise<void>;
/**
 * Cron job handle.
 */
export interface CronJob {
    /**
     * Start the cron job.
     */
    start(): void;
    /**
     * Stop the cron job.
     */
    stop(): void;
    /**
     * Check if the job is running.
     */
    isRunning(): boolean;
}
/**
 * Filesystem scheduler for automated tasks.
 *
 * Uses Bun's native Cron API for scheduling filesystem operations.
 *
 * @example
 * ```typescript
 * const scheduler = new FilesystemScheduler(adapter);
 *
 * // Schedule daily cleanup of temp files
 * scheduler.scheduleCleanup('temp/', '0 0 * * *'); // Every day at midnight
 *
 * // Schedule hourly backup
 * scheduler.scheduleBackup('important/', './backups/backup.tar', '0 * * * *');
 * ```
 */
export declare class FilesystemScheduler {
    private adapter;
    private jobs;
    constructor(adapter: FilesystemDisk);
    /**
     * Schedule a cleanup job.
     *
     * @param pattern - File pattern to clean (glob pattern)
     * @param cronExpression - Cron expression (e.g., '0 0 * * *' for daily at midnight)
     * @param options - Cleanup options
     * @returns Cron job handle
     */
    scheduleCleanup(pattern: string, cronExpression: string, options?: {
        /**
         * Maximum age of files to delete (in milliseconds).
         * @default 86400000 (24 hours)
         */
        maxAge?: number;
        /**
         * Whether to delete directories.
         * @default false
         */
        includeDirectories?: boolean;
    }): CronJob;
    /**
     * Schedule a backup job.
     *
     * @param source - Source directory to backup
     * @param destination - Destination path for backup archive
     * @param cronExpression - Cron expression
     * @returns Cron job handle
     */
    scheduleBackup(source: string, destination: string, cronExpression: string): CronJob;
    /**
     * Schedule a custom job.
     *
     * @param jobId - Unique job identifier
     * @param cronExpression - Cron expression
     * @param callback - Job callback
     * @returns Cron job handle
     */
    schedule(jobId: string, cronExpression: string, callback: CronJobCallback): CronJob;
    /**
     * Stop all scheduled jobs.
     */
    stopAll(): void;
    /**
     * Get the number of scheduled jobs.
     */
    getJobCount(): number;
    /**
     * Perform cleanup operation.
     */
    private cleanup;
    /**
     * Perform backup operation.
     */
    private backup;
    /**
     * Check if a path matches a glob pattern.
     */
    private matchesPattern;
    /**
     * Convert cron expression to interval in milliseconds.
     * Supports basic expressions only.
     */
    private cronToInterval;
}
