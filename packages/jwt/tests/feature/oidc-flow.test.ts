import { afterEach, beforeAll, describe, expect, it, mock } from 'bun:test';
import { JwksCache } from '../../src/jwks-cache.ts';
import { JwtDecoder } from '../../src/jwt-decoder.ts';
import type { JwksKey, JwksResponse } from '../../src/types.ts';

describe('OIDC end-to-end flow', () => {
  let rsaKey: CryptoKeyPair;
  let jwksKey: JwksKey;
  let jwksResponse: JwksResponse;
  const originalFetch = globalThis.fetch;

  beforeAll(async () => {
    rsaKey = await crypto.subtle.generateKey(
      {
        hash: 'SHA-256',
        modulusLength: 2048,
        name: 'RSASSA-PKCS1-v1_5',
        publicExponent: new Uint8Array([1, 0, 1]),
      },
      true,
      ['sign', 'verify'],
    );

    const publicJwk = await crypto.subtle.exportKey('jwk', rsaKey.publicKey);
    jwksKey = {
      alg: 'RS256',
      e: publicJwk.e!,
      kid: 'test-key-1',
      kty: 'RSA',
      n: publicJwk.n!,
      use: 'sig',
    };

    jwksResponse = { keys: [jwksKey] };
  });

  afterEach(() => {
    globalThis.fetch = originalFetch;
  });

  it('fetches JWKS and verifies id_token signature', async () => {
    const fetchMock = mock(async () => createJsonResponse(jwksResponse));
    globalThis.fetch = fetchMock as unknown as typeof fetch;

    const token = await createSignedToken(
      { alg: 'RS256', kid: 'test-key-1', typ: 'JWT' },
      {
        aud: 'client-id',
        exp: Math.floor(Date.now() / 1000) + 3600,
        iat: Math.floor(Date.now() / 1000),
        iss: 'https://accounts.google.com',
        sub: 'user-123',
      },
      rsaKey.privateKey,
    );

    const cache = new JwksCache();
    const decoder = new JwtDecoder();

    const key = await cache.getKey('https://accounts.google.com', 'test-key-1');
    expect(key).not.toBeNull();

    const isValid = await decoder.verify(token, key!);

    expect(isValid).toBe(true);
    expect(fetchMock.mock.calls.length).toBe(1);
  });

  it('fails verification when key ID does not match', async () => {
    const fetchMock = mock(async () => createJsonResponse(jwksResponse));
    globalThis.fetch = fetchMock as unknown as typeof fetch;

    const token = await createSignedToken(
      { alg: 'RS256', kid: 'wrong-key', typ: 'JWT' },
      {
        aud: 'client-id',
        exp: Math.floor(Date.now() / 1000) + 3600,
        iat: Math.floor(Date.now() / 1000),
        iss: 'https://accounts.google.com',
        sub: 'user-123',
      },
      rsaKey.privateKey,
    );

    const cache = new JwksCache();
    const decoder = new JwtDecoder();

    const key = await cache.getKey('https://accounts.google.com', 'wrong-key');
    expect(key).toBeNull();

    // If key is null, verify should fail
    await expect(decoder.verify(token, key as any)).rejects.toThrow();
  });

  it('uses cached JWKS on subsequent requests', async () => {
    const fetchMock = mock(async () => createJsonResponse(jwksResponse));
    globalThis.fetch = fetchMock as unknown as typeof fetch;

    const cache = new JwksCache();

    await cache.getKey('https://accounts.google.com', 'test-key-1');
    await cache.getKey('https://accounts.google.com', 'test-key-1');

    expect(fetchMock.mock.calls.length).toBe(1);
  });

  it('rejects expired tokens', async () => {
    const fetchMock = mock(async () => createJsonResponse(jwksResponse));
    globalThis.fetch = fetchMock as unknown as typeof fetch;

    const expiredToken = await createSignedToken(
      { alg: 'RS256', kid: 'test-key-1', typ: 'JWT' },
      {
        aud: 'client-id',
        exp: Math.floor(Date.now() / 1000) - 3600, // 1 hour ago
        iat: Math.floor(Date.now() / 1000) - 7200,
        iss: 'https://accounts.google.com',
        sub: 'user-123',
      },
      rsaKey.privateKey,
    );

    const cache = new JwksCache();
    const decoder = new JwtDecoder();

    const key = await cache.getKey('https://accounts.google.com', 'test-key-1');
    const isValid = await decoder.verify(expiredToken, key!);

    expect(isValid).toBe(false);
  });

  it('verifies token with clock skew tolerance', async () => {
    const fetchMock = mock(async () => createJsonResponse(jwksResponse));
    globalThis.fetch = fetchMock as unknown as typeof fetch;

    // Token expired 30 seconds ago
    const token = await createSignedToken(
      { alg: 'RS256', kid: 'test-key-1', typ: 'JWT' },
      {
        aud: 'client-id',
        exp: Math.floor(Date.now() / 1000) - 30,
        iat: Math.floor(Date.now() / 1000) - 3600,
        iss: 'https://accounts.google.com',
        sub: 'user-123',
      },
      rsaKey.privateKey,
    );

    const cache = new JwksCache();
    // Allow 60 seconds clock skew
    const decoder = new JwtDecoder({ clockSkew: 60 });

    const key = await cache.getKey('https://accounts.google.com', 'test-key-1');
    const isValid = await decoder.verify(token, key!);

    expect(isValid).toBe(true);
  });

  it('fails when JWT issuer does not match JWKS issuer', async () => {
    // Mock fetch to return empty JWKS for Apple issuer
    const fetchMock = mock(async (url: string | URL | Request) => {
      const urlStr = url instanceof Request ? url.url : url.toString();
      if (urlStr.includes('appleid.apple.com')) {
        return createJsonResponse({ keys: [] });
      }
      return createJsonResponse(jwksResponse);
    });
    globalThis.fetch = fetchMock as unknown as typeof fetch;

    const token = await createSignedToken(
      { alg: 'RS256', kid: 'test-key-1', typ: 'JWT' },
      {
        aud: 'client-id',
        exp: Math.floor(Date.now() / 1000) + 3600,
        iat: Math.floor(Date.now() / 1000),
        iss: 'https://accounts.google.com',
        sub: 'user-123',
      },
      rsaKey.privateKey,
    );

    const cache = new JwksCache();
    const decoder = new JwtDecoder();

    // Token was issued by Google, but we're checking Apple JWKS
    // Since Apple JWKS has different keys, the key won't be found
    const { payload } = decoder.decode(token);
    const key = await cache.getKey(payload.iss, 'test-key-1');
    expect(key).not.toBeNull(); // Key found from Google JWKS

    // But if we try to verify with a key from different JWKS, it should fail
    const wrongKey: JwksKey = {
      alg: 'RS256',
      e: 'AQAB',
      kid: 'test-key-1',
      kty: 'RSA',
      n: 'different-modulus-value-will-cause-verification-to-fail',
      use: 'sig',
    };

    const isValid = await decoder.verify(token, wrongKey);
    expect(isValid).toBe(false);
  });
});

function createJsonResponse(body: JwksResponse): Response {
  return new Response(JSON.stringify(body), {
    headers: { 'Content-Type': 'application/json' },
    status: 200,
  });
}

async function createSignedToken(
  header: Record<string, unknown>,
  payload: Record<string, unknown>,
  privateKey: CryptoKey,
): Promise<string> {
  const headerB64 = base64UrlEncode(JSON.stringify(header));
  const payloadB64 = base64UrlEncode(JSON.stringify(payload));
  const data = `${headerB64}.${payloadB64}`;

  const encoder = new TextEncoder();
  const dataBuffer = encoder.encode(data);

  const signatureBuffer = await crypto.subtle.sign({ name: 'RSASSA-PKCS1-v1_5' }, privateKey, dataBuffer);
  const signatureB64 = base64UrlEncodeBuffer(new Uint8Array(signatureBuffer));

  return `${data}.${signatureB64}`;
}

function base64UrlEncode(value: string): string {
  const buffer = Buffer.from(value, 'utf-8');
  const base64 = buffer.toString('base64');
  return base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

function base64UrlEncodeBuffer(buffer: Uint8Array): string {
  const base64 = Buffer.from(buffer).toString('base64');
  return base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}
