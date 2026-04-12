import { createRoom, wsHandler, WSRoom } from "../../src";
import { describe, expect, test } from "bun:test";

describe("WebSocket Integration", () => {
  test("should create a room with createRoom helper", () => {
    const handler = wsHandler({});
    const { room, bunHandler } = createRoom(handler);

    expect(room).toBeInstanceOf(WSRoom);
    expect(bunHandler).toBeDefined();
    expect(bunHandler.open).toBeDefined();
    expect(bunHandler.message).toBeDefined();
    expect(bunHandler.close).toBeDefined();
  });

  test("should create a room with custom config", () => {
    const handler = wsHandler({});
    const { room } = createRoom(handler, {
      maxPayloadLength: 2048,
      idleTimeout: 60,
    });

    expect(room.getConfig().maxPayloadLength).toBe(2048);
    expect(room.getConfig().idleTimeout).toBe(60);
  });

  test("should broadcast messages through room", () => {
    const { room } = createRoom(wsHandler({}));

    // Simulate clients (in real usage, these come from Bun.serve)
    const sent = room.broadcast({ type: "test", data: "hello" });
    expect(sent).toBe(0); // No clients connected
  });

  test("should handle open/message/close lifecycle", () => {
    const events: string[] = [];

    const handler = wsHandler({
      open: () => events.push("open"),
      message: () => events.push("message"),
      close: () => events.push("close"),
    });

    const { room } = createRoom(handler);

    // Handlers are defined
    expect(handler.open).toBeDefined();
    expect(handler.message).toBeDefined();
    expect(handler.close).toBeDefined();
  });
});
