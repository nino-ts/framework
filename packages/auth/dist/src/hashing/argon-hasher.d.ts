import type { Hasher } from "../contracts/hasher";
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
export declare class ArgonHasher implements Hasher {
    private readonly memoryCost;
    private readonly timeCost;
    private readonly parallelism;
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
     * Hash the given password using Argon2id.
     *
     * @param password - The plain text password to hash
     * @returns The hashed password
     */
    hash(password: string): Promise<string>;
    /**
     * Verify a password against an Argon2 hash.
     *
     * @param password - The plain text password
     * @param hash - The hashed password to verify against
     * @returns True if the password matches the hash, false otherwise
     */
    verify(password: string, hash: string): Promise<boolean>;
    /**
     * Check if the hash needs to be rehashed with current settings.
     *
     * @param hash - The hashed password to check
     * @returns True if rehash is needed, false otherwise
     */
    needsRehash(hash: string): Promise<boolean>;
}
