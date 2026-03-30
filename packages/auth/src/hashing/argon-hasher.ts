import type { Hasher } from '@/contracts/hasher.ts';

/**
 * Configuration options for ArgonHasher.
 */
export interface ArgonHasherConfig {
  /**
   * The memory cost in KiB (default: 65536).
   */
  memoryCost?: number;

  /**
   * The time cost (number of iterations) (default: 3).
   */
  timeCost?: number;

  /**
   * The parallelism factor (default: 1).
   */
  parallelism?: number;
}

/**
 * Argon2 password hasher implementation.
 *
 * Uses Bun's native argon2id hashing with configurable parameters.
 */
export class ArgonHasher implements Hasher {
  private readonly memoryCost: number;
  private readonly timeCost: number;
  private readonly parallelism: number;

  /**
   * Creates a new ArgonHasher instance.
   *
   * @param memoryCost - The memory cost in KiB (default: 65536)
   * @param timeCost - The time cost (default: 3)
   * @param parallelism - The parallelism factor (default: 1)
   */
  constructor(memoryCost?: number, timeCost?: number, parallelism?: number);

  /**
   * Creates a new ArgonHasher instance.
   *
   * @param config - The hasher configuration options
   */
  constructor(config?: ArgonHasherConfig);

  /**
   * Creates a new ArgonHasher instance.
   *
   * @param configOrMemoryCost - The hasher configuration options or memory cost
   * @param timeCost - The time cost (used when first param is memoryCost)
   * @param parallelism - The parallelism factor (used when first param is memoryCost)
   */
  constructor(
    configOrMemoryCost?: ArgonHasherConfig | number,
    timeCost?: number,
    parallelism?: number,
  ) {
    if (typeof configOrMemoryCost === 'number') {
      this.memoryCost = configOrMemoryCost;
      this.timeCost = timeCost ?? 3;
      this.parallelism = parallelism ?? 1;
    } else {
      this.memoryCost = configOrMemoryCost?.memoryCost ?? 65536;
      this.timeCost = configOrMemoryCost?.timeCost ?? 3;
      this.parallelism = configOrMemoryCost?.parallelism ?? 1;
    }
  }

  /**
   * Hash the given password using Argon2id.
   *
   * @param password - The plain text password to hash
   * @returns The hashed password
   */
  async hash(password: string): Promise<string> {
    return await Bun.password.hash(password, {
      algorithm: 'argon2id',
      memoryCost: this.memoryCost,
      timeCost: this.timeCost,
      parallelism: this.parallelism,
    });
  }

  /**
   * Verify a password against an Argon2 hash.
   *
   * @param password - The plain text password
   * @param hash - The hashed password to verify against
   * @returns True if the password matches the hash, false otherwise
   */
  async verify(password: string, hash: string): Promise<boolean> {
    return await Bun.password.verify(password, hash);
  }

  /**
   * Check if the hash needs to be rehashed with current settings.
   *
   * @param hash - The hashed password to check
   * @returns True if rehash is needed, false otherwise
   */
  async needsRehash(hash: string): Promise<boolean> {
    const parts = hash.split('$');

    if (parts.length < 5) {
      return true;
    }

    const params = parts[3];
    if (!params) {
      return true;
    }

    const match = params.match(/m=(\d+),t=(\d+),p=(\d+)/);

    if (!match) {
      return true;
    }

    const [, memory, time, parallelism] = match.map(Number);

    return (
      memory !== this.memoryCost ||
      time !== this.timeCost ||
      parallelism !== this.parallelism
    );
  }
}
