/**
 * MockGuard - Implementação fake de Guard para testes.
 *
 * Guard mock para testes de autenticação.
 *
 * @packageDocumentation
 */

import type { Authenticatable } from '@/contracts/authenticatable.ts';
import type { Guard } from '@/contracts/guard.ts';

/**
 * MockGuard - Fake guard implementation for testing.
 *
 * @example
 * ```typescript
 * const mockGuard = new MockGuard(true);
 * const isAuthenticated = await mockGuard.check();
 * expect(isAuthenticated).toBe(true);
 * ```
 */
export class MockGuard implements Guard {
  private mockUser: Authenticatable | null = null;
  private checkResult: boolean = false;

  /**
   * Create a new MockGuard instance.
   *
   * @param isAuthenticated - Whether the guard should report as authenticated
   */
  constructor(isAuthenticated: boolean = false) {
    this.checkResult = isAuthenticated;
  }

  /**
   * Determine if the current user is authenticated.
   *
   * @returns True if authenticated
   */
  async check(): Promise<boolean> {
    return this.checkResult;
  }

  /**
   * Determine if the current user is a guest.
   *
   * @returns True if guest (not authenticated)
   */
  async guest(): Promise<boolean> {
    return !this.checkResult;
  }

  /**
   * Get the currently authenticated user.
   *
   * @returns The authenticated user or null
   */
  async user(): Promise<Authenticatable | null> {
    return this.mockUser;
  }

  /**
   * Get the ID for the currently authenticated user.
   *
   * @returns The user ID or null
   */
  async id(): Promise<string | number | null> {
    return this.mockUser ? this.mockUser.getAuthIdentifier() : null;
  }

  /**
   * Validate a user's credentials.
   *
   * @param _credentials - The credentials to validate
   * @returns True if credentials are valid
   */
  async validate(_credentials: Record<string, unknown>): Promise<boolean> {
    return this.checkResult;
  }

  /**
   * Set the mock user for this guard.
   *
   * @param user - The user to set
   */
  setUser(user: Authenticatable | null): void {
    this.mockUser = user;
  }

  /**
   * Set the authentication state.
   *
   * @param isAuthenticated - The authentication state
   */
  setAuthenticated(isAuthenticated: boolean): void {
    this.checkResult = isAuthenticated;
  }
}

/**
 * Factory function to create a MockGuard instance.
 *
 * @param isAuthenticated - Whether the guard should report as authenticated
 * @returns A new MockGuard instance
 *
 * @example
 * ```typescript
 * const guard = createMockGuard(true);
 * ```
 */
export function createMockGuard(isAuthenticated: boolean = false): MockGuard {
  return new MockGuard(isAuthenticated);
}
