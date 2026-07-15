import type { Hasher } from "../contracts/hasher";
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
export declare class BcryptHasher implements Hasher {
    private readonly rounds;
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
     * Hash the given password using bcrypt.
     *
     * @param password - The plain text password to hash
     * @returns The hashed password
     */
    hash(password: string): Promise<string>;
    /**
     * Verify a password against a bcrypt hash.
     *
     * @param password - The plain text password
     * @param hash - The hashed password to verify against
     * @returns True if the password matches the hash, false otherwise
     */
    verify(password: string, hash: string): Promise<boolean>;
    /**
     * Check if the hash needs to be rehashed with current rounds setting.
     *
     * @param hash - The hashed password to check
     * @returns True if rehash is needed, false otherwise
     */
    needsRehash(hash: string): Promise<boolean>;
}
