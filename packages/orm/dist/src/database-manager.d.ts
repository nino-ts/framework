import { Connection } from "./connection";
import type { ConnectionConfig } from "./types";
/**
 * The DatabaseManager class manages database connections.
 * It acts as a factory and registry for Connection instances.
 */
export declare class DatabaseManager {
    protected connections: Map<string, Connection>;
    protected configs: Map<string, ConnectionConfig>;
    protected defaultConnection: string;
    /**
     * Register a connection configuration.
     * @param name Connection name
     * @param config Connection configuration
     */
    addConnection(name: string, config: ConnectionConfig): void;
    /**
     * Get a connection instance.
     * @param name Connection name (optional, defaults to default connection)
     */
    connection(name?: string): Connection;
    /**
     * Set the default connection name.
     * @param name Connection name
     */
    setDefaultConnection(name: string): void;
    /**
     * Get the default connection name.
     */
    getDefaultConnection(): string;
    /**
     * Close all active connections.
     */
    closeALl(): Promise<void>;
}
