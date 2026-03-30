/**
 * MockUser - Implementação fake de Authenticatable para testes.
 *
 * Usuário mock para testes de autenticação.
 *
 * @packageDocumentation
 */

import type { Authenticatable } from '@/contracts/authenticatable.ts';

/**
 * Opções para criar um MockUser.
 */
interface MockUserOptions {
  id: string | number;
  email: string;
  name?: string | null;
  password?: string | null;
  rememberToken?: string | null;
}

/**
 * MockUser - Fake authenticatable user for testing.
 *
 * @example
 * ```typescript
 * const user = new MockUser(1, 'test@example.com', 'Test User', 'hashed:password');
 * expect(user.getAuthIdentifier()).toBe(1);
 * expect(user.getAuthPassword()).toBe('hashed:password');
 * ```
 */
export class MockUser implements Authenticatable {
  private readonly id: string | number;
  private readonly email: string;
  private readonly name: string | null;
  private readonly password: string | null;
  private rememberToken: string | null;

  /**
   * Create a new MockUser instance.
   *
   * @param id - Unique identifier for the user
   * @param email - User's email address
   * @param name - User's display name (optional)
   * @param password - User's hashed password (optional)
   * @param rememberToken - Remember me token (optional)
   */
  constructor(
    id: string | number,
    email: string,
    name: string | null = null,
    password: string | null = null,
    rememberToken: string | null = null,
  ) {
    this.id = id;
    this.email = email;
    this.name = name;
    this.password = password;
    this.rememberToken = rememberToken;
  }

  /**
   * Get the name of the unique identifier for the user.
   *
   * @returns The identifier column name
   */
  getAuthIdentifierName(): string {
    return 'id';
  }

  /**
   * Get the unique identifier for the user.
   *
   * @returns The user's unique identifier
   */
  getAuthIdentifier(): string | number {
    return this.id;
  }

  /**
   * Get the password for the user.
   *
   * @returns The user's hashed password
   * @throws Error if password is not set
   */
  getAuthPassword(): string {
    if (this.password === null) {
      throw new Error('Password is not set');
    }
    return this.password;
  }

  /**
   * Get the name of the password attribute for the user.
   *
   * @returns The password column name
   */
  getAuthPasswordName(): string {
    return 'password';
  }

  /**
   * Get the token value for the "remember me" session.
   *
   * @returns The remember token or null if not set
   */
  getRememberToken(): string | null {
    return this.rememberToken;
  }

  /**
   * Set the token value for the "remember me" session.
   *
   * @param value - The remember token value
   */
  setRememberToken(value: string | null): void {
    this.rememberToken = value;
  }

  /**
   * Get the column name for the "remember me" token.
   *
   * @returns The remember token column name
   */
  getRememberTokenName(): string {
    return 'remember_token';
  }

  /**
   * Get the user's email address.
   *
   * @returns The user's email
   */
  getEmail(): string {
    return this.email;
  }

  /**
   * Get the user's display name.
   *
   * @returns The user's name or null
   */
  getName(): string | null {
    return this.name;
  }

  /**
   * Get a plain object representation of the user.
   *
   * @returns Object with user properties
   */
  toJSON(): Record<string, unknown> {
    return {
      email: this.email,
      id: this.id,
      name: this.name,
      remember_token: this.rememberToken,
    };
  }
}

/**
 * Factory function to create a MockUser instance.
 *
 * @param overrides - Optional overrides for user properties
 * @returns A new MockUser instance
 *
 * @example
 * ```typescript
 * const user = createMockUser({ id: 1, email: 'admin@example.com' });
 * ```
 */
export function createMockUser(overrides?: Partial<MockUserOptions>): MockUser {
  const options: MockUserOptions = {
    email: overrides?.email ?? 'user@example.com',
    id: overrides?.id ?? 1,
    name: overrides?.name ?? 'Test User',
    password: overrides?.password ?? null,
    rememberToken: overrides?.rememberToken ?? null,
  };

  return new MockUser(
    options.id,
    options.email,
    options.name ?? null,
    options.password ?? null,
    options.rememberToken ?? null,
  );
}
