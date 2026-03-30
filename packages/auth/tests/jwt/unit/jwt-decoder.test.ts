import { describe, expect, it } from 'bun:test';
import { JwtError } from '@/jwt/errors.ts';
import { JwtDecoder } from '@/jwt/jwt-decoder.ts';

describe('JwtDecoder.decode()', () => {
  const decoder = new JwtDecoder();

  it('should decode a valid JWT token', () => {
    // JWT token: header.payload.signature
    // Header: { "typ": "JWT", "alg": "RS256", "kid": "test-key-1" }
    // Payload: { "iss": "https://accounts.google.com", "sub": "123", "aud": "client-id", "exp": 9999999999, "iat": 1234567890 }
    const token =
      'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImtpZCI6InRlc3Qta2V5LTEifQ.eyJpc3MiOiJodHRwczovL2FjY291bnRzLmdvb2dsZS5jb20iLCJzdWIiOiIxMjMiLCJhdWQiOiJjbGllbnQtaWQiLCJleHAiOjk5OTk5OTk5OTksImlhdCI6MTIzNDU2Nzg5MH0.signature';

    const { header, payload } = decoder.decode(token);

    expect(header.typ).toBe('JWT');
    expect(header.alg).toBe('RS256');
    expect(header.kid).toBe('test-key-1');

    expect(payload.iss).toBe('https://accounts.google.com');
    expect(payload.sub).toBe('123');
    expect(payload.aud).toBe('client-id');
    expect(payload.exp).toBe(9999999999);
    expect(payload.iat).toBe(1234567890);
  });

  it('should throw error for malformed token (missing parts)', () => {
    const malformedToken = 'header.payload'; // Missing signature

    expect(() => decoder.decode(malformedToken)).toThrow(JwtError);
    expect(() => decoder.decode(malformedToken)).toThrow('Invalid JWT format: expected 3 parts separated by dots');
  });

  it('should throw error for invalid base64url encoding', () => {
    const invalidToken = 'invalid@base64.invalid@base64.signature';

    expect(() => decoder.decode(invalidToken)).toThrow(JwtError);
    expect(() => decoder.decode(invalidToken)).toThrow('Failed to decode JWT');
  });

  it('should decode token with additional payload claims', () => {
    // Payload with custom claims: email, email_verified, name, picture
    const token = generateTestToken({
      header: { alg: 'RS256', kid: 'key-1', typ: 'JWT' },
      payload: {
        aud: 'client-id',
        email: 'user@example.com',
        email_verified: true,
        exp: 9999999999,
        iat: 1234567890,
        iss: 'https://accounts.google.com',
        name: 'John Doe',
        picture: 'https://example.com/avatar.jpg',
        sub: '123',
      },
    });

    const { payload } = decoder.decode(token);

    expect(payload.email).toBe('user@example.com');
    expect(payload.email_verified).toBe(true);
    expect(payload.name).toBe('John Doe');
    expect(payload.picture).toBe('https://example.com/avatar.jpg');
  });

  it('should handle empty payload fields gracefully', () => {
    const token = generateTestToken({
      header: { alg: 'RS256', typ: 'JWT' },
      payload: {
        aud: 'client-id',
        exp: 9999999999,
        iat: 1234567890,
        iss: 'https://issuer.com',
        sub: '',
      },
    });

    const { payload } = decoder.decode(token);

    expect(payload.sub).toBe('');
  });
});

/**
 * Helper function to generate test JWT tokens
 *
 * Generates header.payload.signature where signature is just "test-signature"
 */
function generateTestToken(params: { header: Record<string, unknown>; payload: Record<string, unknown> }): string {
  const headerBase64 = base64UrlEncode(JSON.stringify(params.header));
  const payloadBase64 = base64UrlEncode(JSON.stringify(params.payload));
  return `${headerBase64}.${payloadBase64}.test-signature`;
}

function base64UrlEncode(str: string): string {
  // Convert to base64 using Buffer
  const buffer = Buffer.from(str, 'utf-8');
  const base64 = buffer.toString('base64');
  // Convert to base64url: replace + with -, / with _, remove padding =
  return base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}
