import type { SessionDriver } from "../contracts/session-driver";
export declare class MemorySessionDriver implements SessionDriver {
    private storage;
    read(sessionId: string): Promise<Record<string, unknown>>;
    write(sessionId: string, data: Record<string, unknown>, lifetime: number): Promise<boolean>;
    destroy(sessionId: string): Promise<boolean>;
    gc(_maxLifetime: number): Promise<number>;
}
