/**
 * Hasher contract for password hashing implementations.
 */
export interface Hasher {
  /**
   * Hash the given password.
   *
   * @param password - The plain text password to hash
   * @returns The hashed password
   */
  hash(password: string): Promise<string>;

  /**
   * Verify a password against a hash.
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
