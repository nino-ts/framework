import type { Encrypter } from "./contracts/encryption";
export type Cipher = "AES-128-CBC" | "AES-256-CBC" | "AES-256-GCM";
/**
 * Native implementation of Symmetric Encryption adopting WebCrypto API.
 * Emulates the classic Encrypter architecture emitting JSON Payloads seamlessly.
 */
export declare class WebEncrypter implements Encrypter {
    private key;
    private cipher;
    /**
     * The text encoder for string conversions.
     */
    private encoder;
    private decoder;
    constructor(key: string | Uint8Array, cipher?: Cipher);
    /**
     * Encrypt the given value.
     */
    encrypt(value: unknown, serialize?: boolean): Promise<string>;
    /**
     * Decrypt the given payload.
     */
    decrypt(payload: string, unserialize?: boolean): Promise<unknown>;
    /**
     * Encrypt a string without serialization.
     */
    encryptString(value: string): Promise<string>;
    /**
     * Decrypt a string payload without unserialization.
     */
    decryptString(payload: string): Promise<string>;
    /**
     * Get the underlying encryption key.
     */
    getKey(): Uint8Array;
    /**
     * Generate a MAC using HMAC-SHA256 for the given payload.
     */
    private hash;
    /**
     * Import the AES Key configuration safely defining explicit operations seamlessly!
     */
    private importAesKey;
    /**
     * Retrieve and explicitly validate native payload mappings catching boundaries robustly!
     */
    private getJsonPayload;
    /**
     * Evaluates if the key matches algorithm exact lengths validating initialization smoothly.
     */
    private validateKeyLength;
}
