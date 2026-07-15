import type { Job, QueueConnection } from "./types";
/**
 * Synchronous job bus — executes jobs immediately when connection is `sync`.
 */
export declare class SyncBus {
    private readonly connection;
    constructor(connection?: QueueConnection);
    /**
     * Current queue connection name.
     */
    getConnection(): QueueConnection;
    /**
     * Dispatch a job on the configured connection.
     */
    dispatch(job: Job): Promise<void>;
}
