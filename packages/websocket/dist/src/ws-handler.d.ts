import type { ServerWebSocket } from "bun";
import type { WSData } from "../types";
import type { WSRoom } from "./ws-room";
/**
 * Create a WebSocket handler compatible with Bun.serve.
 *
 * This function takes a WSRoom and returns the handler object
 * that Bun.serve expects in the `websocket` option.
 *
 * @typeParam T - The type of data attached to each client
 * @param room - The WSRoom instance
 * @returns Bun.serve compatible websocket handler
 */
export declare function createWSHandler<T extends WSData = WSData>(room: WSRoom<T>): {
    open: (ws: ServerWebSocket<T>) => void;
    message: (ws: ServerWebSocket<T>, message: string | Buffer) => void;
    close: (ws: ServerWebSocket<T>, code: number, reason: string) => void;
    ping: (ws: ServerWebSocket<T>, data: Buffer) => void;
    pong: (ws: ServerWebSocket<T>, data: Buffer) => void;
    drain: (ws: ServerWebSocket<T>) => void;
};
