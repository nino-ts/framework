/**
 * MockProvider - Implementação fake de UserProvider para testes.
 *
 * Provider mock para testes de autenticação.
 *
 * @packageDocumentation
 */

import type { Authenticatable } from '@/contracts/authenticatable.ts';
import type { UserProvider } from '@/contracts/user-provider.ts';

/**
 * MockProvider - Fake user provider implementation for testing.
 *
 * @example
 * ```typescript
 * const provider = new MockProvider();
 * const user = await provider.retrieveById(1);
 * const isValid = await provider.validateCredentials(user, 'password');
 * ```
 */
export class MockProvider implements UserProvider {
  private users: Map<string | number, Authenticatable> = new Map();
  private tokens: Map<string, string> = new Map();

  /**
   * Create a new MockProvider instance.
   *
   * @param users - Optional initial users to populate the provider
   */
  constructor(users?: Authenticatable[]) {
    if (users) {
      users.forEach((user) => {
        this.users.set(user.getAuthIdentifier(), user);
      });
    }
  }

  /**
   * Retrieve a user by their unique identifier.
   *
   * @param identifier - The user's unique identifier
   * @returns The user or null if not found
   */
  async retrieveById(identifier: string | number): Promise<Authenticatable | null> {
    return this.users.get(identifier) ?? null;
  }

  /**
   * Retrieve a user by their unique identifier and "remember me" token.
   *
   * @param identifier - The user's unique identifier
   * @param token - The remember token
   * @returns The user or null if not found or token doesn't match
   */
  async retrieveByToken(identifier: string | number, token: string): Promise<Authenticatable | null> {
    const user = this.users.get(identifier);
    if (!user) {
      return null;
    }

    const storedToken = this.tokens.get(identifier.toString());
    if (storedToken !== token) {
      return null;
    }

    return user;
  }

  /**
   * Retrieve a user by their "remember me" token only.
   *
   * Used by TokenGuard for token-based authentication.
   *
   * @param token - The token to search for
   * @returns The user or null if not found
   */
  async retrieveByTokenOnly(token: string): Promise<Authenticatable | null> {
    // Search through all users for a matching token
    for (const user of this.users.values()) {
      const storedToken = this.tokens.get(user.getAuthIdentifier().toString());
      if (storedToken === token) {
        return user;
      }
    }
    return null;
  }

  /**
   * Update the "remember me" token for the given user in storage.
   *
   * @param user - The user to update
   * @param token - The new remember token
   */
  async updateRememberToken(user: Authenticatable, token: string): Promise<void> {
    this.tokens.set(user.getAuthIdentifier().toString(), token);
    user.setRememberToken(token);
  }

  /**
   * Retrieve a user by the given credentials.
   *
   * @param credentials - The credentials to search by (e.g., { email: 'test@example.com' })
   * @returns The user or null if not found
   */
  async retrieveByCredentials(credentials: Record<string, unknown>): Promise<Authenticatable | null> {
    // Search by email (most common case)
    if (typeof credentials.email === 'string') {
      for (const user of this.users.values()) {
        if ('getEmail' in user && typeof user.getEmail === 'function') {
          const userEmail = user.getEmail();
          if (userEmail === credentials.email) {
            return user;
          }
        }
      }
    }

    return null;
  }

  /**
   * Validate a user against the given credentials.
   *
   * @param user - The user to validate
   * @param credentials - The credentials to validate against (e.g., { password: 'secret' })
   * @returns True if credentials are valid
   */
  async validateCredentials(user: Authenticatable, credentials: Record<string, unknown>): Promise<boolean> {
    if (typeof credentials.password !== 'string') {
      return false;
    }

    try {
      const hashedPassword = user.getAuthPassword();
      // Check if password matches (handles both plain and hashed comparison)
      if (hashedPassword === `hashed:${credentials.password}`) {
        return true;
      }

      // Also check plain password match (for pre-hashed fixtures)
      if (hashedPassword === credentials.password) {
        return true;
      }

      return false;
    } catch {
      return false;
    }
  }

  /**
   * Add a user to the provider.
   *
   * @param user - The user to add
   */
  addUser(user: Authenticatable): void {
    this.users.set(user.getAuthIdentifier(), user);
  }

  /**
   * Remove a user from the provider.
   *
   * @param identifier - The user's unique identifier
   * @returns True if user was removed
   */
  removeUser(identifier: string | number): boolean {
    this.tokens.delete(identifier.toString());
    return this.users.delete(identifier);
  }

  /**
   * Get all users (for testing purposes).
   *
   * @returns Array of all users
   */
  getAllUsers(): Authenticatable[] {
    return Array.from(this.users.values());
  }

  /**
   * Clear all users and tokens (for test cleanup).
   */
  clear(): void {
    this.users.clear();
    this.tokens.clear();
  }

  /**
   * Get the stored token for a user (for testing purposes).
   *
   * @param identifier - The user's unique identifier
   * @returns The stored token or undefined
   */
  getToken(identifier: string | number): string | undefined {
    return this.tokens.get(identifier.toString());
  }
}

/**
 * Factory function to create a MockProvider instance.
 *
 * @param users - Optional initial users to populate the provider
 * @returns A new MockProvider instance
 *
 * @example
 * ```typescript
 * const provider = createMockProvider([createMockUser({ id: 1, email: 'admin@example.com' })]);
 * ```
 */
export function createMockProvider(users?: Authenticatable[]): MockProvider {
  return new MockProvider(users);
}
