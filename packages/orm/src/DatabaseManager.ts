import { Connection } from './Connection';
import type { ConnectionConfig } from './Types';

export class DatabaseManager {
    protected connections: Map<string, Connection> = new Map();
    protected configs: Map<string, ConnectionConfig> = new Map();
    protected defaultConnection: string = 'default';

    addConnection(name: string, config: ConnectionConfig): void {
        this.configs.set(name, config);
    }

    connection(name?: string): Connection {
        const connectionName = name || this.defaultConnection;

        if (this.connections.has(connectionName)) {
            return this.connections.get(connectionName)!;
        }

        const config = this.configs.get(connectionName);
        if (!config) {
            throw new Error(`Database connection [${connectionName}] not configured.`);
        }

        const connection = new Connection(config);
        this.connections.set(connectionName, connection);

        return connection;
    }

    setDefaultConnection(name: string): void {
        this.defaultConnection = name;
    }

    getDefaultConnection(): string {
        return this.defaultConnection;
    }

    async closeALl(): Promise<void> {
        for (const connection of this.connections.values()) {
            await connection.close();
        }
        this.connections.clear();
    }
}
