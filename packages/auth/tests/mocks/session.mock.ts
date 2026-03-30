/**
 * MemorySession - Implementação fake de SessionInterface para testes.
 *
 * Simula operações de sessão em memória usando Map.
 * Rastreia se save() foi chamado para propósitos de teste.
 *
 * @packageDocumentation
 */

import type { SessionInterface } from '@/contracts/session-interface.ts';

/**
 * MemorySession - Fake session implementation for testing.
 *
 * @example
 * ```typescript
 * const session = new MemorySession();
 * await session.start();
 * session.put('user_id', 1);
 * expect(session.get('user_id')).toBe(1);
 * await session.save();
 * ```
 */
export class MemorySession implements SessionInterface {
  private data: Map<string, unknown> = new Map();
  private saved: boolean = false;
  private started: boolean = false;
  private id: string | null = null;

  /**
   * Get a value from the session.
   *
   * @param key - The key to retrieve
   * @param defaultValue - Optional default value if key doesn't exist
   * @returns The value or default value
   */
  get<T = unknown>(key: string, defaultValue?: T): T {
    if (this.data.has(key)) {
      return this.data.get(key) as T;
    }
    return defaultValue as T;
  }

  /**
   * Put a value in the session.
   *
   * @param key - The key to store
   * @param value - The value to store
   */
  put(key: string, value: unknown): void {
    this.data.set(key, value);
  }

  /**
   * Forget a value in the session.
   *
   * @param key - The key to remove
   */
  forget(key: string): void {
    this.data.delete(key);
  }

  /**
   * Flush all data from the session.
   */
  flush(): void {
    this.data.clear();
  }

  /**
   * Regenerate the session ID.
   *
   * @param _destroy - Whether to destroy old session data (not implemented in memory)
   * @returns True if regeneration succeeded
   */
  async regenerate(_destroy?: boolean): Promise<boolean> {
    this.id = this.generateId();
    return true;
  }

  /**
   * Save the session (marks as saved for testing).
   *
   * @returns Promise that resolves when save is complete
   */
  async save(): Promise<void> {
    this.saved = true;
  }

  /**
   * Start the session.
   *
   * @returns Promise that resolves when session is started
   */
  async start(): Promise<void> {
    this.started = true;
    if (!this.id) {
      this.id = this.generateId();
    }
  }

  /**
   * Check if the session has been saved.
   *
   * @returns True if save() has been called
   */
  isSaved(): boolean {
    return this.saved;
  }

  /**
   * Check if the session has been started.
   *
   * @returns True if start() has been called
   */
  isStarted(): boolean {
    return this.started;
  }

  /**
   * Get the session ID.
   *
   * @returns The session ID or null if not started
   */
  getId(): string | null {
    return this.id;
  }

  /**
   * Get all session data (for testing purposes).
   *
   * @returns Copy of all session data
   */
  all(): Record<string, unknown> {
    const result: Record<string, unknown> = {};
    this.data.forEach((value, key) => {
      result[key] = value;
    });
    return result;
  }

  /**
   * Check if a key exists in the session.
   *
   * @param key - The key to check
   * @returns True if key exists
   */
  has(key: string): boolean {
    return this.data.has(key);
  }

  /**
   * Reset the session state (for test cleanup).
   */
  reset(): void {
    this.data.clear();
    this.saved = false;
    this.started = false;
    this.id = null;
  }

  /**
   * Generate a random session ID.
   *
   * @returns A random session ID string
   */
  private generateId(): string {
    return `session_${Math.random().toString(36).substring(2, 15)}`;
  }
}

/**
 * Factory function to create a MemorySession instance.
 *
 * @returns A new MemorySession instance
 */
export function createMemorySession(): MemorySession {
  return new MemorySession();
}

/**
 * Alias for createMemorySession - creates a mock session for testing.
 *
 * @returns A new MemorySession instance
 */
export function createMockSession(): MemorySession {
  return createMemorySession();
}
