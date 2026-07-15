import type { JwksKey, JwtDecoderOptions, JwtHeader, JwtPayload } from "./types";
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
export declare class JwtDecoder {
    private options;
    constructor(options?: JwtDecoderOptions);
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
    decode(token: string): {
        header: JwtHeader;
        payload: JwtPayload;
    };
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
    verify(token: string, publicKey: JwksKey): Promise<boolean>;
    /**
     * Verify token signature using crypto.subtle
     *
     * @param token - Full JWT token (header.payload.signature)
     * @param header - Decoded JWT header
     * @param publicKey - JWKS public key
     * @returns True if signature is valid
     */
    private verifySignature;
    /**
     * Verify token expiration claim
     *
     * Checks if current time is before exp claim (with optional clock skew)
     *
     * @param payload - Decoded JWT payload
     * @returns True if token is not expired
     */
    private verifyExpiration;
    /**
     * Decode base64url to Uint8Array buffer
     *
     * @param str - Base64url encoded string
     * @returns Decoded buffer
     */
    private base64UrlDecodeToBuffer;
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
    private base64UrlDecode;
}
