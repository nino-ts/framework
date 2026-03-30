import type { SessionDriver } from '@/session/contracts/session-driver.ts';

export class MemorySessionDriver implements SessionDriver {
  private storage = new Map<string, { data: Record<string, unknown>; expires: number }>();

  async read(sessionId: string): Promise<Record<string, unknown>> {
    const session = this.storage.get(sessionId);
    if (!session) {
      return {};
    }

    if (Date.now() >= session.expires) {
      this.storage.delete(sessionId);
      return {};
    }

    return session.data;
  }

  async write(sessionId: string, data: Record<string, unknown>, lifetime: number): Promise<boolean> {
    // lifetime is in minutes
    this.storage.set(sessionId, {
      data,
      expires: Date.now() + lifetime * 60 * 1000,
    });
    return true;
  }

  async destroy(sessionId: string): Promise<boolean> {
    return this.storage.delete(sessionId);
  }

  async gc(_maxLifetime: number): Promise<number> {
    let count = 0;
    const now = Date.now();

    for (const [id, session] of this.storage.entries()) {
      if (now >= session.expires) {
        this.storage.delete(id);
        count++;
      }
    }

    return count;
  }
}
