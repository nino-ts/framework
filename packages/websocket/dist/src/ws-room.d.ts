import type { Server } from "bun";
import type { WSClient, WSData, WSRoomConfig, WSRoomHandler } from "../types";
/**
 * WebSocket room manager.
 *
 * Manages a group of WebSocket connections with pub/sub
 * support, message broadcasting, and lifecycle hooks.
 *
 * @typeParam T - The type of data attached to each client
 */
export declare class WSRoom<T extends WSData = WSData> {
    /**
     * Map of connected clients
     */
    private clients;
    /**
     * Room handler implementation
     */
    private handler;
    /**
     * Room configuration
     */
    private config;
    /**
     * Create a new WebSocket room.
     *
     * @param handler - The room handler implementation
     * @param config - Room configuration options
     */
    constructor(handler: WSRoomHandler<T>, config?: WSRoomConfig<T>);
    /**
     * Get the room configuration.
     *
     * @returns The room configuration
     */
    getConfig(): WSRoomConfig<T>;
    /**
     * Get the number of connected clients.
     *
     * @returns Number of connected clients
     */
    get clientCount(): number;
    /**
     * Get a client by ID.
     *
     * @param id - The client ID
     * @returns The client or undefined if not found
     */
    getClient(id: string): WSClient<T> | undefined;
    /**
     * Get all connected clients.
     *
     * @returns Array of clients
     */
    getClients(): WSClient<T>[];
    /**
     * Broadcast a message to all clients in the room.
     *
     * @param message - The message to broadcast
     * @param excludeId - Optional client ID to exclude
     * @returns Number of clients the message was sent to
     */
    broadcast(message: Record<string, unknown>, excludeId?: string): number;
    /**
     * Handle a new client connection.
     *
     * @param ws - The ServerWebSocket
     * @param server - The Bun server instance
     * @returns The created WSClient
     */
    handleOpen(ws: ServerWebSocket<T>, _server: Server): WSClient<T>;
    /**
     * Handle a message from a client.
     *
     * @param client - The client that sent the message
     * @param message - The raw message data
     */
    handleMessage(client: WSClient<T>, message: string | Buffer): void;
    /**
     * Handle a client disconnection.
     *
     * @param client - The disconnected client
     * @param code - Close code
     * @param reason - Close reason
     */
    handleClose(client: WSClient<T>, code: number, reason: string): void;
    /**
     * Handle a ping frame.
     *
     * @param client - The client that sent the ping
     * @param data - Ping data
     */
    handlePing(client: WSClient<T>, data: Buffer): void;
    /**
     * Handle a pong frame.
     *
     * @param client - The client that sent the pong
     * @param data - Pong data
     */
    handlePong(client: WSClient<T>, data: Buffer): void;
}
