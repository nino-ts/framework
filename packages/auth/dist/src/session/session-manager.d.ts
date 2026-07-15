import type { SessionDriver } from "./contracts/session-driver";
import { type SessionConnectionInterface } from "./drivers/database-driver";
import { Session } from "./session";
import type { SessionConfig } from "./types";
/**
 * Session Manager Factory.
 */
export declare class SessionManager {
    /**
     * The application configuration.
     */
    protected config: SessionConfig;
    /**
     * The array of resolved drivers.
     */
    protected drivers: Map<string, SessionDriver>;
    /**
     * Optional database connection for the database driver.
     */
    protected connection: SessionConnectionInterface | null;
    /**
     * Create a new Session Manager instance.
     */
    constructor(config: SessionConfig, connection?: SessionConnectionInterface);
    /**
     * Get a driver instance.
     */
    driver(name?: string): SessionDriver;
    /**
     * Create a new driver instance.
     */
    protected createDriver(name: string): SessionDriver;
    /**
     * Create an instance of the file session driver.
     */
    protected createFileDriver(): SessionDriver;
    /**
     * Create an instance of the memory session driver.
     */
    protected createMemoryDriver(): SessionDriver;
    /**
     * Create an instance of the database session driver.
     */
    protected createDatabaseDriver(): SessionDriver;
    /**
     * Build the session instance.
     */
    build(driver: SessionDriver, id?: string, token?: string): Session;
}
