import type { ServerWebSocket } from "bun";
import type { WSClient, WSData } from "../types";
/**
 * WebSocket client implementation.
 *
 * Wraps Bun's ServerWebSocket with convenience methods
 * for sending messages, managing subscriptions, and handling
 * connection lifecycle.
 *
 * @typeParam T - The type of data attached to the client
 */
export declare class WSClientImpl<T extends WSData = WSData> implements WSClient<T> {
    /**
     * Unique client identifier
     */
    readonly id: string;
    /**
     * Data attached to this client
     */
    data: T;
    /**
     * The underlying ServerWebSocket
     */
    readonly ws: ServerWebSocket<T>;
    /**
     * Set of topics this client is subscribed to
     */
    private subscribedTopics;
    /**
     * Create a new WebSocket client.
     *
     * @param ws - The underlying ServerWebSocket
     * @param data - Initial client data
     */
    constructor(ws: ServerWebSocket<T>, data: T);
    /**
     * Send a message to this client.
     *
     * @param message - The message to send
     * @returns Whether the send was successful
     */
    send(message: Record<string, unknown>): boolean;
    /**
     * Close the connection.
     *
     * @param code - Close code
     * @param reason - Close reason
     */
    close(code?: number, reason?: string): void;
    /**
     * Subscribe to a topic/room.
     *
     * @param topic - The topic name
     */
    subscribe(topic: string): void;
    /**
     * Unsubscribe from a topic/room.
     *
     * @param topic - The topic name
     */
    unsubscribe(topic: string): void;
    /**
     * Get the topics this client is subscribed to.
     *
     * @returns Array of topic names
     */
    topics(): string[];
    /**
     * Check if the client is subscribed to a topic.
     *
     * @param topic - The topic name
     * @returns Whether subscribed
     */
    isSubscribed(topic: string): boolean;
}
