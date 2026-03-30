/**
 * MockHasher - Implementação fake de Hasher para testes.
 *
 * Hasher mock que simula operações de hash sem criptografia real.
 * Usa prefixo 'hashed:' para identificar valores "hasheados".
 *
 * @packageDocumentation
 */

import type { Hasher } from '@/contracts/hasher.ts';

/**
 * MockHasher - Fake hasher implementation for testing.
 *
 * @example
 * ```typescript
 * const hasher = new MockHasher();
 * const hash = await hasher.hash('password');
 * expect(hash).toBe('hashed:password');
 * expect(await hasher.verify('password', hash)).toBe(true);
 * ```
 */
export class MockHasher implements Hasher {
  /**
   * Hash the given value.
   *
   * @param value - The value to hash
   * @returns The hashed value with 'hashed:' prefix
   */
  async hash(value: string): Promise<string> {
    return `hashed:${value}`;
  }

  /**
   * Check the given value against a hashed value.
   *
   * @param value - The plain value to check
   * @param hashedValue - The hashed value to compare against
   * @returns True if value matches the hash
   */
  async verify(value: string, hashedValue: string): Promise<boolean> {
    return hashedValue === `hashed:${value}`;
  }

  /**
   * Check if the given hash has been hashed using the given options.
   *
   * @param _hashedValue - The hash to check
   * @returns False always (mock never needs rehash)
   */
  async needsRehash(_hashedValue: string): Promise<boolean> {
    return false;
  }

  /**
   * Check if a value is in hashed format.
   *
   * @param value - The value to check
   * @returns True if value starts with 'hashed:'
   */
  isHashed(value: string): boolean {
    return value.startsWith('hashed:');
  }
}

/**
 * Factory function to create a MockHasher instance.
 *
 * @returns A new MockHasher instance
 */
export function createMockHasher(): MockHasher {
  return new MockHasher();
}
