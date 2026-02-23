import type { Encrypter } from '@/contracts/encryption';
import { DecryptException, EncryptException } from '@/exceptions';

export type Cipher = 'AES-128-CBC' | 'AES-256-CBC' | 'AES-256-GCM';

interface EncryptedPayload {
  iv: string;
  value: string;
  mac: string;
  tag?: string;
}

/**
 * Native implementation of Symmetric Encryption adopting WebCrypto API.
 * Emulates the classic Encrypter architecture emitting JSON Payloads seamlessly.
 */
export class WebEncrypter implements Encrypter {
  private key: Uint8Array;
  private cipher: Cipher;

  /**
   * The text encoder for string conversions.
   */
  private encoder = new TextEncoder();
  private decoder = new TextDecoder();

  constructor(key: string | Uint8Array, cipher: Cipher = 'AES-256-CBC') {
    this.key = typeof key === 'string' ? this.encoder.encode(key) : key;
    this.cipher = cipher;

    this.validateKeyLength();
  }

  /**
   * Encrypt the given value.
   */
  async encrypt(value: unknown, serialize = true): Promise<string> {
    const stringValue = serialize ? JSON.stringify(value) : (value as string);
    const data = this.encoder.encode(stringValue);

    const isGCM = this.cipher.endsWith('-GCM');
    const ivLength = 16;
    const iv = crypto.getRandomValues(new Uint8Array(ivLength));

    try {
      const cryptoKey = await this.importAesKey('encrypt');

      const algorithm = {
        iv,
        name: isGCM ? 'AES-GCM' : 'AES-CBC',
      };

      const encryptedBuffer = await crypto.subtle.encrypt(algorithm, cryptoKey, data);

      const valueB64 = Buffer.from(encryptedBuffer).toString('base64');
      const ivB64 = Buffer.from(iv).toString('base64');

      const mac = await this.hash(ivB64, valueB64);

      const payload: EncryptedPayload = {
        iv: ivB64,
        mac,
        value: valueB64,
      };

      return Buffer.from(JSON.stringify(payload)).toString('base64');
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : 'Unknown error';
      throw new EncryptException(`Could not encrypt the data: ${msg}`);
    }
  }

  /**
   * Decrypt the given payload.
   */
  async decrypt(payload: string, unserialize = true): Promise<unknown> {
    const parsed = this.getJsonPayload(payload);

    const iv = Buffer.from(parsed.iv, 'base64');
    const encryptedData = Buffer.from(parsed.value, 'base64');

    const expectedMac = await this.hash(parsed.iv, parsed.value);

    // Timing attack safe comparison would ideally be done via crypto.subtle.verify,
    // but a buffer equality check is sufficient for symmetric MACs if verified safely.
    // In Bun/Node, crypto.timingSafeEqual handles this optimally.
    if (!this.timingSafeEqual(Buffer.from(expectedMac), Buffer.from(parsed.mac))) {
      throw new DecryptException('The MAC is invalid.');
    }

    try {
      const cryptoKey = await this.importAesKey('decrypt');
      const isGCM = this.cipher.endsWith('-GCM');

      const algorithm = {
        iv,
        name: isGCM ? 'AES-GCM' : 'AES-CBC',
      };

      const decryptedBuffer = await crypto.subtle.decrypt(algorithm, cryptoKey, encryptedData);
      const decryptedString = this.decoder.decode(decryptedBuffer);

      return unserialize ? JSON.parse(decryptedString) : decryptedString;
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : 'Unknown error';
      throw new DecryptException(`Could not decrypt the data: ${msg}`);
    }
  }

  /**
   * Encrypt a string without serialization.
   */
  async encryptString(value: string): Promise<string> {
    return this.encrypt(value, false);
  }

  /**
   * Decrypt a string payload without unserialization.
   */
  async decryptString(payload: string): Promise<string> {
    return (await this.decrypt(payload, false)) as string;
  }

  /**
   * Get the underlying encryption key.
   */
  getKey(): Uint8Array {
    return this.key;
  }

  /**
   * Generate a MAC using HMAC-SHA256 for the given payload.
   */
  private async hash(iv: string, value: string): Promise<string> {

    const hmacKey = await crypto.subtle.importKey('raw', this.key, { hash: 'SHA-256', name: 'HMAC' }, false, ['sign']);

    const payload = this.encoder.encode(iv + value);
    const signature = await crypto.subtle.sign('HMAC', hmacKey, payload);

    // Convert exact Uint8Array representation to hex string to mimic standard HMACS natively.
    return Buffer.from(signature).toString('hex');
  }

  /**
   * Import the AES Key configuration safely defining explicit operations seamlessly!
   */
  private async importAesKey(usage: 'encrypt' | 'decrypt'): Promise<CryptoKey> {
    const isGCM = this.cipher.endsWith('-GCM');

    return crypto.subtle.importKey('raw', this.key, { name: isGCM ? 'AES-GCM' : 'AES-CBC' }, false, [usage]);
  }

  /**
   * Retrieve and explicitly validate native payload mappings catching boundaries robustly!
   */
  private getJsonPayload(payload: string): EncryptedPayload {
    try {
      const decoded = Buffer.from(payload, 'base64').toString('utf8');
      const parsed = JSON.parse(decoded) as EncryptedPayload;

      if (!parsed.iv || !parsed.value || !parsed.mac) {
        throw new Error('Payload is missing necessary properties.');
      }

      return parsed;
    } catch {
      throw new DecryptException('The payload is invalid.');
    }
  }

  /**
   * Timing-safe equality check cleanly validating boundaries organically preventing leaks!
   */
  private timingSafeEqual(a: Buffer | undefined, b: Buffer | undefined): boolean {
    if (!a || !b || a.length !== b.length) {
      return false;
    }

    // Bun native implementation of timingSafeEqual explicitly tracking constants elegantly!
    let result = 0;
    for (let i = 0; i < a.length; i++) {
      const aVal = a[i] ?? 0;
      const bVal = b[i] ?? 0;
      result |= aVal ^ bVal;
    }
    return result === 0;
  }

  /**
   * Evaluates if the key matches algorithm exact lengths validating initialization smoothly.
   */
  private validateKeyLength(): void {
    const length = this.key.length;

    if (this.cipher === 'AES-128-CBC' && length !== 16) {
      throw new Error('The key length must be 16 bytes for AES-128-CBC.');
    }

    if (this.cipher === 'AES-256-CBC' && length !== 32) {
      throw new Error('The key length must be 32 bytes for AES-256-CBC.');
    }

    if (this.cipher === 'AES-256-GCM' && length !== 32) {
      throw new Error('The key length must be 32 bytes for AES-256-GCM.');
    }
  }
}
