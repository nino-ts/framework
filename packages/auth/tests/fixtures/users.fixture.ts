/**
 * Users Fixture - Dados fixos de usuários para testes.
 *
 * @packageDocumentation
 */

/**
 * Representa um usuário no banco de dados.
 */
export interface UserFixture {
  id: number;
  email: string;
  name: string;
  password: string;
  remember_token: string | null;
}

/**
 * Create a user fixture with default values.
 *
 * @param overrides - Optional overrides for user properties
 * @returns A user fixture object
 *
 * @example
 * ```typescript
 * const user = createUserFixture({ id: 1, email: 'admin@example.com' });
 * ```
 */
export function createUserFixture(overrides?: Partial<UserFixture>): UserFixture {
  return {
    email: overrides?.email ?? 'user@example.com',
    id: overrides?.id ?? 1,
    name: overrides?.name ?? 'Test User',
    password: overrides?.password ?? 'hashed:password',
    remember_token: overrides?.remember_token ?? null,
  };
}

/**
 * Create an admin user fixture.
 *
 * @param overrides - Optional overrides for admin user properties
 * @returns An admin user fixture object
 *
 * @example
 * ```typescript
 * const admin = createAdminUserFixture();
 * ```
 */
export function createAdminUserFixture(overrides?: Partial<UserFixture>): UserFixture {
  return createUserFixture({
    email: overrides?.email ?? 'admin@example.com',
    id: overrides?.id ?? 1,
    name: overrides?.name ?? 'Admin User',
    password: overrides?.password ?? 'hashed:admin_password',
    remember_token: overrides?.remember_token ?? null,
  });
}

/**
 * Create a guest user fixture (unauthenticated).
 *
 * @param overrides - Optional overrides for guest user properties
 * @returns A guest user fixture object
 */
export function createGuestUserFixture(overrides?: Partial<UserFixture>): UserFixture {
  return createUserFixture({
    email: overrides?.email ?? 'guest@example.com',
    id: overrides?.id ?? 2,
    name: overrides?.name ?? 'Guest User',
    password: overrides?.password ?? 'hashed:guest_password',
    remember_token: overrides?.remember_token ?? null,
  });
}

/**
 * Create a user fixture with remember token.
 *
 * @param token - The remember token value
 * @param overrides - Optional overrides for user properties
 * @returns A user fixture with remember token
 */
export function createUserWithRememberTokenFixture(token: string, overrides?: Partial<UserFixture>): UserFixture {
  return createUserFixture({
    ...overrides,
    remember_token: token,
  });
}

/**
 * Create multiple user fixtures.
 *
 * @param count - Number of users to create
 * @param baseOverrides - Base overrides applied to all users
 * @returns Array of user fixtures
 *
 * @example
 * ```typescript
 * const users = createMultipleUserFixtures(5, { name: 'User' });
 * ```
 */
export function createMultipleUserFixtures(count: number, baseOverrides?: Partial<UserFixture>): UserFixture[] {
  return Array.from({ length: count }, (_, index) =>
    createUserFixture({
      ...baseOverrides,
      email: baseOverrides?.email ? `${index + 1}_${baseOverrides.email}` : `user${index + 1}@example.com`,
      id: baseOverrides?.id ? baseOverrides.id + index : index + 1,
    }),
  );
}
