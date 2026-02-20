import { beforeAll, describe, expect, it } from 'bun:test';
import { JwtError } from '../../src/errors.ts';
import { JwtDecoder } from '../../src/jwt-decoder.ts';
import type { JwksKey } from '../../src/types.ts';

describe('JwtDecoder.verify()', () => {
  let rsaKey: CryptoKeyPair;
  let ecKey: CryptoKeyPair;
  let rsaJwk: JwksKey;
  let ecJwk: JwksKey;

  // Generate test keys before running tests
  beforeAll(async () => {
    // Generate RSA key pair for RS256
    rsaKey = await crypto.subtle.generateKey(
      {
        hash: 'SHA-256',
        modulusLength: 2048,
        name: 'RSASSA-PKCS1-v1_5',
        publicExponent: new Uint8Array([1, 0, 1]), // 65537
      },
      true,
      ['sign', 'verify'],
    );

    // Export RSA public key as JWK
    const rsaPublicJwk = await crypto.subtle.exportKey('jwk', rsaKey.publicKey);
    rsaJwk = {
      alg: 'RS256',
      e: rsaPublicJwk.e!,
      kid: 'test-rsa-key',
      kty: 'RSA',
      n: rsaPublicJwk.n!,
      use: 'sig',
    };

    // Generate EC key pair for ES256
    ecKey = (await crypto.subtle.generateKey(
      {
        name: 'ECDSA',
        namedCurve: 'P-256',
      },
      true,
      ['sign', 'verify'],
    )) as CryptoKeyPair;

    // Export EC public key as JWK
    const ecPublicJwk = await crypto.subtle.exportKey('jwk', ecKey.publicKey);
    ecJwk = {
      alg: 'ES256',
      crv: ecPublicJwk.crv!,
      kid: 'test-ec-key',
      kty: 'EC',
      use: 'sig',
      x: ecPublicJwk.x!,
      y: ecPublicJwk.y!,
    };
  });

  it('should verify RS256 signature with valid RSA public key', async () => {
    const decoder = new JwtDecoder();

    // Create a real signed JWT token
    const token = await createSignedToken(
      { alg: 'RS256', kid: 'test-rsa-key', typ: 'JWT' },
      {
        aud: 'client-id',
        exp: Math.floor(Date.now() / 1000) + 3600, // 1 hour from now
        iat: Math.floor(Date.now() / 1000),
        iss: 'https://accounts.google.com',
        sub: '123',
      },
      rsaKey.privateKey,
      'RS256',
    );

    const isValid = await decoder.verify(token, rsaJwk);

    expect(isValid).toBe(true);
  });

  it('should verify ES256 signature with valid EC public key', async () => {
    const decoder = new JwtDecoder();

    const token = await createSignedToken(
      { alg: 'ES256', kid: 'test-ec-key', typ: 'JWT' },
      {
        aud: 'client-id',
        exp: Math.floor(Date.now() / 1000) + 3600,
        iat: Math.floor(Date.now() / 1000),
        iss: 'https://appleid.apple.com',
        sub: '456',
      },
      ecKey.privateKey,
      'ES256',
    );

    const isValid = await decoder.verify(token, ecJwk);

    expect(isValid).toBe(true);
  });

  it('should reject token with invalid signature', async () => {
    const decoder = new JwtDecoder();

    const validToken = await createSignedToken(
      { alg: 'RS256', kid: 'test-rsa-key', typ: 'JWT' },
      {
        aud: 'client-id',
        exp: Math.floor(Date.now() / 1000) + 3600,
        iat: Math.floor(Date.now() / 1000),
        iss: 'https://accounts.google.com',
        sub: '123',
      },
      rsaKey.privateKey,
      'RS256',
    );

    // Tamper with the token (change payload)
    const parts = validToken.split('.');
    const tamperedPayload = base64UrlEncode(JSON.stringify({ tampered: 'data' }));
    const tamperedToken = `${parts[0]}.${tamperedPayload}.${parts[2]}`;

    const isValid = await decoder.verify(tamperedToken, rsaJwk);

    expect(isValid).toBe(false);
  });

  it('should reject expired token', async () => {
    const decoder = new JwtDecoder();

    const expiredToken = await createSignedToken(
      { alg: 'RS256', kid: 'test-rsa-key', typ: 'JWT' },
      {
        aud: 'client-id',
        exp: Math.floor(Date.now() / 1000) - 3600, // 1 hour ago
        iat: Math.floor(Date.now() / 1000) - 7200, // 2 hours ago
        iss: 'https://accounts.google.com',
        sub: '123',
      },
      rsaKey.privateKey,
      'RS256',
    );

    const isValid = await decoder.verify(expiredToken, rsaJwk);

    expect(isValid).toBe(false);
  });

  it('should accept expired token when skipExpiration is true', async () => {
    const decoder = new JwtDecoder({ skipExpiration: true });

    const expiredToken = await createSignedToken(
      { alg: 'RS256', kid: 'test-rsa-key', typ: 'JWT' },
      {
        aud: 'client-id',
        exp: Math.floor(Date.now() / 1000) - 3600, // 1 hour ago
        iat: Math.floor(Date.now() / 1000) - 7200,
        iss: 'https://accounts.google.com',
        sub: '123',
      },
      rsaKey.privateKey,
      'RS256',
    );

    const isValid = await decoder.verify(expiredToken, rsaJwk);

    expect(isValid).toBe(true); // Expiration check skipped
  });

  it('should reject token with algorithm mismatch', async () => {
    const decoder = new JwtDecoder();

    // Create RS256 token but try to verify with EC key
    const token = await createSignedToken(
      { alg: 'RS256', kid: 'test-rsa-key', typ: 'JWT' },
      {
        aud: 'client-id',
        exp: Math.floor(Date.now() / 1000) + 3600,
        iat: Math.floor(Date.now() / 1000),
        iss: 'https://accounts.google.com',
        sub: '123',
      },
      rsaKey.privateKey,
      'RS256',
    );

    // Should fail because algorithm doesn't match key type
    await expect(decoder.verify(token, ecJwk)).rejects.toThrow(JwtError);
  });

  it('should handle clockSkew tolerance', async () => {
    const decoder = new JwtDecoder({ clockSkew: 60 }); // 60 seconds tolerance

    // Token expires in 30 seconds (would fail without clock skew)
    const tokenExpiringSoon = await createSignedToken(
      { alg: 'RS256', kid: 'test-rsa-key', typ: 'JWT' },
      {
        aud: 'client-id',
        exp: Math.floor(Date.now() / 1000) + 30, // 30 seconds from now
        iat: Math.floor(Date.now() / 1000),
        iss: 'https://accounts.google.com',
        sub: '123',
      },
      rsaKey.privateKey,
      'RS256',
    );

    const isValid = await decoder.verify(tokenExpiringSoon, rsaJwk);

    expect(isValid).toBe(true);
  });
});

/**
 * Create a real signed JWT token using crypto.subtle
 */
async function createSignedToken(
  header: Record<string, unknown>,
  payload: Record<string, unknown>,
  privateKey: CryptoKey,
  algorithm: 'RS256' | 'ES256',
): Promise<string> {
  const headerB64 = base64UrlEncode(JSON.stringify(header));
  const payloadB64 = base64UrlEncode(JSON.stringify(payload));
  const data = `${headerB64}.${payloadB64}`;

  // Sign the data
  const encoder = new TextEncoder();
  const dataBuffer = encoder.encode(data);

  let signatureBuffer: ArrayBuffer;
  if (algorithm === 'RS256') {
    signatureBuffer = await crypto.subtle.sign({ name: 'RSASSA-PKCS1-v1_5' }, privateKey, dataBuffer);
  } else {
    // ES256
    signatureBuffer = await crypto.subtle.sign({ hash: 'SHA-256', name: 'ECDSA' }, privateKey, dataBuffer);
  }

  const signatureB64 = base64UrlEncodeBuffer(new Uint8Array(signatureBuffer));

  return `${data}.${signatureB64}`;
}

function base64UrlEncode(str: string): string {
  const buffer = Buffer.from(str, 'utf-8');
  const base64 = buffer.toString('base64');
  return base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

function base64UrlEncodeBuffer(buffer: Uint8Array): string {
  const base64 = Buffer.from(buffer).toString('base64');
  return base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}
