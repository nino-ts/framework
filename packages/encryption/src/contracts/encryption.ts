/**
 * Defines the contract for all encryption handlers.
 * Operations are strictly asynchronous as they rely on standard Web Crypto APIs.
 */
export interface Encrypter {
  /**
   * Encrypt the given value.
   *
   * @param value - The value to encrypt
   * @param serialize - Whether to JSON serialize the value before encryption (default: true)
   * @returns A base64 encoded JSON string containing the IV, MAC, and Ciphertext
   */
  encrypt(value: unknown, serialize?: boolean): Promise<string>;

  /**
   * Decrypt the given payload.
   *
   * @param payload - The base64 JSON payload string to decrypt
   * @param unserialize - Whether to JSON parse the decrypted string (default: true)
   * @returns The decrypted value
   * @throws {DecryptException} If the MAC is invalid or payload is malformed
   */
  decrypt(payload: string, unserialize?: boolean): Promise<unknown>;

  /**
   * Encrypt a string without serialization.
   *
   * @param value - The string to encrypt
   * @returns Equivalent to `encrypt(value, false)`
   */
  encryptString(value: string): Promise<string>;

  /**
   * Decrypt a string payload without unserialization.
   *
   * @param payload - The payload to decrypt
   * @returns Equivalent to `decrypt(payload, false)`
   */
  decryptString(payload: string): Promise<string>;

  /**
   * Get the encryption key.
   *
   * @returns The raw key bytes used for encryption.
   */
  getKey(): Uint8Array;
}
