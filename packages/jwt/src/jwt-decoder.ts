import { JwtError } from './errors.ts';
import type { JwksKey, JwtDecoderOptions, JwtHeader, JwtPayload } from './types.ts';

/**
 * JWT Decoder — decode and verify JWT tokens
 *
 * Supports RS256 and ES256 algorithms using Bun-native crypto.subtle
 *
 * @example
 * ```typescript
 * const decoder = new JwtDecoder();
 * const { header, payload } = decoder.decode(token);
 * console.log(payload.email); // user@example.com
 * ```
 */
export class JwtDecoder {
  private options: JwtDecoderOptions;

  constructor(options: JwtDecoderOptions = {}) {
    this.options = {
      clockSkew: options.clockSkew ?? 0,
      skipExpiration: options.skipExpiration ?? false,
    };
  }

  /**
   * Decode a JWT token into header and payload
   *
   * Does NOT verify signature or validate claims.
   * Use verify() for full validation.
   *
   * @param token - JWT token string (header.payload.signature)
   * @returns Decoded header and payload
   * @throws {JwtError} If token format is invalid
   *
   * @example
   * ```typescript
   * const { header, payload } = decoder.decode(idToken);
   * console.log(header.alg); // "RS256"
   * console.log(payload.sub); // "110169484474386276334"
   * ```
   */
  decode(token: string): { header: JwtHeader; payload: JwtPayload } {
    try {
      // JWT format: header.payload.signature
      const parts = token.split('.');
      if (parts.length !== 3) {
        throw new JwtError('Invalid JWT format: expected 3 parts separated by dots');
      }

      const [headerB64, payloadB64] = parts;

      // Decode base64url to JSON
      const headerJson = this.base64UrlDecode(headerB64!);
      const payloadJson = this.base64UrlDecode(payloadB64!);

      const header = JSON.parse(headerJson) as JwtHeader;
      const payload = JSON.parse(payloadJson) as JwtPayload;

      return { header, payload };
    } catch (error) {
      if (error instanceof JwtError) {
        throw error;
      }
      throw new JwtError(`Failed to decode JWT: ${(error as Error).message}`);
    }
  }

  /**
   * Verify JWT token signature and validate claims
   *
   * Supports RS256 (RSA + SHA-256) and ES256 (ECDSA P-256 + SHA-256)
   *
   * @param token - JWT token string
   * @param publicKey - JWKS public key to verify signature
   * @returns True if signature is valid and claims pass validation
   *
   * @throws {JwtError} If verification fails critically (algorithm mismatch, crypto error)
   *
   * @example
   * ```typescript
   * const key = await jwksCache.getKey(issuer, header.kid);
   * const isValid = await decoder.verify(idToken, key);
   * if (!isValid) {
   *   throw new Error('Invalid token');
   * }
   * ```
   */
  async verify(token: string, publicKey: JwksKey): Promise<boolean> {
    try {
      const { header, payload } = this.decode(token);

      // Validate expiration (unless skipped)
      if (!this.options.skipExpiration && !this.verifyExpiration(payload)) {
        return false;
      }

      // Verify signature
      return await this.verifySignature(token, header, publicKey);
    } catch (error) {
      if (error instanceof JwtError) {
        throw error;
      }
      throw new JwtError(`Token verification failed: ${(error as Error).message}`);
    }
  }

  /**
   * Verify token signature using crypto.subtle
   *
   * @param token - Full JWT token (header.payload.signature)
   * @param header - Decoded JWT header
   * @param publicKey - JWKS public key
   * @returns True if signature is valid
   */
  private async verifySignature(token: string, header: JwtHeader, publicKey: JwksKey): Promise<boolean> {
    try {
      const parts = token.split('.');
      if (parts.length !== 3) {
        throw new JwtError('Invalid JWT format');
      }

      const [headerB64, payloadB64, signatureB64] = parts;
      const data = `${headerB64}.${payloadB64}`;

      // Decode signature from base64url
      const signatureBuffer = this.base64UrlDecodeToBuffer(signatureB64!);

      // Import public key based on algorithm
      let cryptoKey: CryptoKey;
      let algorithm: AlgorithmIdentifier | EcdsaParams;

      if (header.alg === 'RS256') {
        if (publicKey.kty !== 'RSA') {
          throw new JwtError(`Algorithm mismatch: token uses RS256 but key type is ${publicKey.kty}`);
        }

        algorithm = { name: 'RSASSA-PKCS1-v1_5' };
        cryptoKey = await crypto.subtle.importKey(
          'jwk',
          {
            alg: 'RS256',
            e: publicKey.e,
            ext: true,
            kty: publicKey.kty,
            n: publicKey.n,
          },
          { hash: 'SHA-256', name: 'RSASSA-PKCS1-v1_5' },
          false,
          ['verify'],
        );
      } else if (header.alg === 'ES256') {
        if (publicKey.kty !== 'EC') {
          throw new JwtError(`Algorithm mismatch: token uses ES256 but key type is ${publicKey.kty}`);
        }

        algorithm = { hash: 'SHA-256', name: 'ECDSA' };
        cryptoKey = await crypto.subtle.importKey(
          'jwk',
          {
            alg: 'ES256',
            crv: publicKey.crv,
            ext: true,
            kty: publicKey.kty,
            x: publicKey.x,
            y: publicKey.y,
          },
          { name: 'ECDSA', namedCurve: 'P-256' },
          false,
          ['verify'],
        );
      } else {
        throw new JwtError(`Unsupported algorithm: ${header.alg}`);
      }

      // Verify signature
      const encoder = new TextEncoder();
      const dataBuffer = encoder.encode(data);
      const isValid = await crypto.subtle.verify(algorithm, cryptoKey, signatureBuffer as BufferSource, dataBuffer);

      return isValid;
    } catch (error) {
      if (error instanceof JwtError) {
        throw error;
      }
      throw new JwtError(`Signature verification failed: ${(error as Error).message}`);
    }
  }

  /**
   * Verify token expiration claim
   *
   * Checks if current time is before exp claim (with optional clock skew)
   *
   * @param payload - Decoded JWT payload
   * @returns True if token is not expired
   */
  private verifyExpiration(payload: JwtPayload): boolean {
    const now = Math.floor(Date.now() / 1000);
    const clockSkew = this.options.clockSkew || 0;

    // Token is valid if current time < expiration + clock skew
    return now < payload.exp + clockSkew;
  }

  /**
   * Decode base64url to Uint8Array buffer
   *
   * @param str - Base64url encoded string
   * @returns Decoded buffer
   */
  private base64UrlDecodeToBuffer(str: string): Uint8Array {
    // Convert base64url to base64
    let base64 = str.replace(/-/g, '+').replace(/_/g, '/');

    // Add padding if needed
    const padding = base64.length % 4;
    if (padding > 0) {
      base64 += '='.repeat(4 - padding);
    }

    // Decode base64 to buffer
    const buffer = Buffer.from(base64, 'base64');
    return new Uint8Array(buffer);
  }

  /**
   * Decode base64url string to UTF-8
   *
   * Base64url encoding:
   * - Replace - with +
   * - Replace _ with /
   * - Add padding if needed
   * - Decode base64
   *
   * @param str - Base64url encoded string
   * @returns Decoded UTF-8 string
   */
  private base64UrlDecode(str: string): string {
    try {
      // Convert base64url to base64
      let base64 = str.replace(/-/g, '+').replace(/_/g, '/');

      // Add padding if needed (base64 requires length divisible by 4)
      const padding = base64.length % 4;
      if (padding > 0) {
        base64 += '='.repeat(4 - padding);
      }

      // Decode base64 using Bun/Node.js Buffer
      const buffer = Buffer.from(base64, 'base64');
      return buffer.toString('utf-8');
    } catch (error) {
      throw new JwtError(`Failed to decode base64url: ${(error as Error).message}`);
    }
  }
}
