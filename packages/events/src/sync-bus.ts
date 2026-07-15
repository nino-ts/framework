import type { Job, QueueConnection } from "./types";

/**
 * Synchronous job bus — executes jobs immediately when connection is `sync`.
 */
export class SyncBus {
    constructor(private readonly connection: QueueConnection = "sync") {}

    /**
     * Current queue connection name.
     */
    public getConnection(): QueueConnection {
        return this.connection;
    }

    /**
     * Dispatch a job on the configured connection.
     */
    public async dispatch(job: Job): Promise<void> {
        switch (this.connection) {
            case "sync":
                await job.handle();
                return;
            default: {
                const neverConnection: never = this.connection;
                throw new Error(`Queue connection [${neverConnection}] is not supported`);
            }
        }
    }
}
