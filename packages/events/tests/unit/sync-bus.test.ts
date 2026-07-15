import { describe, expect, test } from "bun:test";
import { SyncBus } from "../../src/sync-bus";
import type { Job } from "../../src/types";

class PingJob implements Job {
    public ran = false;

    public async handle(): Promise<void> {
        this.ran = true;
    }
}

describe("SyncBus", () => {
    test("runs jobs immediately on sync connection", async () => {
        const bus = new SyncBus("sync");
        const job = new PingJob();

        await bus.dispatch(job);

        expect(job.ran).toBe(true);
        expect(bus.getConnection()).toBe("sync");
    });
});
