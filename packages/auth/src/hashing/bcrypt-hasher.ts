import type { Hasher } from '@/contracts/hasher.ts';

/**
 * Configuration options for BcryptHasher.
 */
export interface BcryptHasherConfig {
  /**
   * The number of rounds to use for bcrypt hashing (default: 10).
   */
  rounds?: number;
}

/**
 * Bcrypt password hasher implementation.
 *
 * Uses Bun's native bcrypt hashing with configurable cost factor.
 */
export class BcryptHasher implements Hasher {
  private readonly rounds: number;

  /**
   * Creates a new BcryptHasher instance.
   *
   * @param rounds - The number of rounds (default: 10)
   */
  constructor(rounds?: number);

  /**
   * Creates a new BcryptHasher instance.
   *
   * @param config - The hasher configuration options
   */
  constructor(config?: BcryptHasherConfig);

  /**
   * Creates a new BcryptHasher instance.
   *
   * @param configOrRounds - The hasher configuration options or rounds
   */
  constructor(configOrRounds?: BcryptHasherConfig | number) {
    if (typeof configOrRounds === 'number') {
      this.rounds = configOrRounds;
    } else {
      this.rounds = configOrRounds?.rounds ?? 10;
    }
  }

  /**
   * Hash the given password using bcrypt.
   *
   * @param password - The plain text password to hash
   * @returns The hashed password
   */
  async hash(password: string): Promise<string> {
    return await Bun.password.hash(password, {
      algorithm: 'bcrypt',
      cost: this.rounds,
    });
  }

  /**
   * Verify a password against a bcrypt hash.
   *
   * @param password - The plain text password
   * @param hash - The hashed password to verify against
   * @returns True if the password matches the hash, false otherwise
   */
  async verify(password: string, hash: string): Promise<boolean> {
    return await Bun.password.verify(password, hash);
  }

  /**
   * Check if the hash needs to be rehashed with current rounds setting.
   *
   * @param hash - The hashed password to check
   * @returns True if rehash is needed, false otherwise
   */
  async needsRehash(hash: string): Promise<boolean> {
    const parts = hash.split('$');

    if (parts.length !== 4) {
      return true;
    }

    const costStr = parts[2];
    if (!costStr) {
      return true;
    }

    const cost = parseInt(costStr, 10);
    return cost !== this.rounds;
  }
}
