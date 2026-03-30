import { describe, expect, it } from 'bun:test';
import { WebEncrypter } from '@/encryption/encrypter';
import { DecryptException } from '@/encryption/exceptions';

describe('WebEncrypter', () => {
  // Generate a random 32-byte key for AES-256
  const key32 = crypto.getRandomValues(new Uint8Array(32));
  const key16 = crypto.getRandomValues(new Uint8Array(16));

  it('throws an error if the key length is invalid', () => {
    expect(() => new WebEncrypter(key16, 'AES-256-CBC')).toThrow('The key length must be 32 bytes for AES-256-CBC.');

    expect(() => new WebEncrypter(key32, 'AES-128-CBC')).toThrow('The key length must be 16 bytes for AES-128-CBC.');
  });

  it('securely encrypts and decrypts string without serialization', async () => {
    const encrypter = new WebEncrypter(key32);
    const plaintext = 'ninots-secret-value';

    const encrypted = await encrypter.encryptString(plaintext);
    expect(encrypted).not.toEqual(plaintext);

    // The payload should be valid base64
    expect(Buffer.from(encrypted, 'base64').toString('base64')).toEqual(encrypted);

    const decrypted = await encrypter.decryptString(encrypted);
    expect(decrypted).toEqual(plaintext);
  });

  it('securely encrypts and decrypts complex objects seamlessly', async () => {
    const encrypter = new WebEncrypter(key32);
    const rawData = { email: 'teste@ninots.dev', permissions: ['admin', 'edit'], user_id: 1 };

    const encrypted = await encrypter.encrypt(rawData);
    expect(typeof encrypted).toBe('string');

    const decrypted = await encrypter.decrypt(encrypted);
    expect(decrypted).toEqual(rawData);
  });

  it('fails to decrypt if the JSON payload is unparseable', async () => {
    const encrypter = new WebEncrypter(key32);
    const invalidBase64 = Buffer.from('invalid-json-data').toString('base64');

    await expect(encrypter.decrypt(invalidBase64)).rejects.toThrow(DecryptException);
    await expect(encrypter.decrypt(invalidBase64)).rejects.toThrow('The payload is invalid.');
  });

  it('fails to decrypt if payload is missing key constraints', async () => {
    const encrypter = new WebEncrypter(key32);
    const incompletePayload = Buffer.from(JSON.stringify({ iv: 'test' })).toString('base64');

    await expect(encrypter.decrypt(incompletePayload)).rejects.toThrow(DecryptException);
  });

  it('fails to decrypt if the MAC is modified explicitly checking tampering', async () => {
    const encrypter = new WebEncrypter(key32);
    const plaintext = 'sensitive_data';

    const encrypted = await encrypter.encryptString(plaintext);

    // Decode base64 back to JSON
    const decodedJson = Buffer.from(encrypted, 'base64').toString('utf8');
    const parsed = JSON.parse(decodedJson);

    // Tamper the MAC strictly invalidating it
    parsed.mac = parsed.mac.replace(/[a-zA-Z0-9]/, 'X');

    const tamperedPayload = Buffer.from(JSON.stringify(parsed)).toString('base64');

    await expect(encrypter.decryptString(tamperedPayload)).rejects.toThrow(DecryptException);
    await expect(encrypter.decryptString(tamperedPayload)).rejects.toThrow('The MAC is invalid.');
  });
});
