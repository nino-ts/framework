/**
 * Tokens Fixture - Dados fixos de tokens para testes.
 *
 * @packageDocumentation
 */

import { createHash } from 'node:crypto';

/**
 * Create a remember token fixture.
 *
 * @param value - Optional custom token value (random if not provided)
 * @returns A remember token string
 *
 * @example
 * ```typescript
 * const token = createRememberTokenFixture();
 * ```
 */
export function createRememberTokenFixture(value?: string): string {
  if (value) {
    return value;
  }

  // Generate a random 64-character hex token
  return createHash('sha256').update(`${Date.now()}-${Math.random()}`).digest('hex');
}

/**
 * Create a JWT token fixture.
 *
 * @param payload - Optional payload to encode (default: minimal claims)
 * @param secret - Optional secret for signing (default: 'test-secret')
 * @returns A JWT token string (mock format: header.payload.signature)
 *
 * @example
 * ```typescript
 * const token = createJwtTokenFixture({ sub: '1', email: 'test@example.com' });
 * ```
 */
export function createJwtTokenFixture(payload?: Record<string, unknown>, secret: string = 'test-secret'): string {
  const header = {
    alg: 'HS256',
    typ: 'JWT',
  };

  const defaultPayload = {
    exp: Math.floor(Date.now() / 1000) + 3600, // 1 hour
    iat: Math.floor(Date.now() / 1000),
    sub: '1',
    ...payload,
  };

  // Base64URL encode header and payload
  const headerEncoded = base64UrlEncode(JSON.stringify(header));
  const payloadEncoded = base64UrlEncode(JSON.stringify(defaultPayload));

  // Create signature (mock - not cryptographically secure)
  const signature = base64UrlEncode(
    createHash('sha256').update(`${headerEncoded}.${payloadEncoded}.${secret}`).digest('hex'),
  );

  return `${headerEncoded}.${payloadEncoded}.${signature}`;
}

/**
 * Create an expired JWT token fixture.
 *
 * @param payload - Optional additional payload
 * @param secret - Optional secret for signing
 * @returns An expired JWT token string
 */
export function createExpiredJwtTokenFixture(
  payload?: Record<string, unknown>,
  secret: string = 'test-secret',
): string {
  return createJwtTokenFixture(
    {
      ...payload,
      exp: Math.floor(Date.now() / 1000) - 3600, // Expired 1 hour ago
    },
    secret,
  );
}

/**
 * Create a JWT token fixture with custom expiration.
 *
 * @param expiresInSeconds - Token expiration time in seconds
 * @param payload - Optional additional payload
 * @param secret - Optional secret for signing
 * @returns A JWT token string with custom expiration
 */
export function createJwtTokenWithExpirationFixture(
  expiresInSeconds: number,
  payload?: Record<string, unknown>,
  secret: string = 'test-secret',
): string {
  return createJwtTokenFixture(
    {
      ...payload,
      exp: Math.floor(Date.now() / 1000) + expiresInSeconds,
    },
    secret,
  );
}

/**
 * Create an API token fixture.
 *
 * @param prefix - Optional prefix for the token (default: 'api_')
 * @returns An API token string
 */
export function createApiTokenFixture(prefix: string = 'api_'): string {
  const randomPart = createHash('sha256').update(`${Date.now()}-${Math.random()}`).digest('hex').substring(0, 32);

  return `${prefix}${randomPart}`;
}

/**
 * Base64URL encode a string.
 *
 * @param input - The string to encode
 * @returns Base64URL encoded string
 */
function base64UrlEncode(input: string): string {
  return Buffer.from(input, 'utf-8').toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}
