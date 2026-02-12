/**
 * JWT Header structure (RFC 7519)
 *
 * @see https://datatracker.ietf.org/doc/html/rfc7519#section-5
 */
export interface JwtHeader {
    /**
     * Token type (always "JWT")
     */
    typ: string;

    /**
     * Signing algorithm used
     *
     * Common values:
     * - "RS256": RSA-PKCS1-v1_5 with SHA-256
     * - "ES256": ECDSA P-256 with SHA-256
     * - "HS256": HMAC with SHA-256 (not supported)
     */
    alg: 'RS256' | 'ES256' | string;

    /**
     * Key ID for JWKS lookup
     *
     * Used to identify which public key to use for signature verification
     */
    kid?: string;
}

/**
 * JWT Payload structure (registered claims)
 *
 * @see https://datatracker.ietf.org/doc/html/rfc7519#section-4.1
 */
export interface JwtPayload {
    /**
     * Issuer — who created and signed the token
     *
     * Example: "https://accounts.google.com"
     */
    iss: string;

    /**
     * Subject — unique identifier for the user
     *
     * Example: "110169484474386276334"
     */
    sub: string;

    /**
     * Audience — intended recipient(s) of the token
     *
     * Typically the client_id of the OAuth application
     */
    aud: string | string[];

    /**
     * Expiration time — Unix timestamp (seconds since epoch)
     *
     * Token must not be accepted after this time
     */
    exp: number;

    /**
     * Issued at — Unix timestamp when token was created
     */
    iat: number;

    /**
     * Additional claims (OpenID Connect, custom)
     *
     * Examples:
     * - email: string
     * - email_verified: boolean
     * - name: string
     * - picture: string
     */
    [key: string]: unknown;
}

/**
 * JWKS Key structure (JSON Web Key Set)
 *
 * @see https://datatracker.ietf.org/doc/html/rfc7517
 */
export interface JwksKey {
    /**
     * Key type
     *
     * - "RSA": RSA public key
     * - "EC": Elliptic Curve public key
     */
    kty: 'RSA' | 'EC' | string;

    /**
     * Public key use
     *
     * - "sig": Signature verification
     * - "enc": Encryption (not used for JWT)
     */
    use: string;

    /**
     * Algorithm intended for use with this key
     */
    alg: string;

    /**
     * Key ID — unique identifier for this key
     */
    kid: string;

    /**
     * RSA modulus (base64url encoded)
     *
     * Required for RSA keys (kty="RSA")
     */
    n?: string;

    /**
     * RSA exponent (base64url encoded)
     *
     * Required for RSA keys (kty="RSA"), typically "AQAB" (65537)
     */
    e?: string;

    /**
     * Elliptic curve name
     *
     * Required for EC keys (kty="EC")
     * Example: "P-256" (secp256r1)
     */
    crv?: string;

    /**
     * EC x coordinate (base64url encoded)
     *
     * Required for EC keys (kty="EC")
     */
    x?: string;

    /**
     * EC y coordinate (base64url encoded)
     *
     * Required for EC keys (kty="EC")
     */
    y?: string;
}

/**
 * JWKS endpoint response structure
 */
export interface JwksResponse {
    /**
     * Array of public keys
     */
    keys: JwksKey[];
}

/**
 * JWT Decoder options
 */
export interface JwtDecoderOptions {
    /**
     * Skip expiration validation (for testing)
     *
     * @default false
     */
    skipExpiration?: boolean;

    /**
     * Clock skew tolerance in seconds
     *
     * Allows tokens to be accepted within this window before/after exp/iat
     *
     * @default 0
     */
    clockSkew?: number;
}

/**
 * JWKS Cache options
 */
export interface JwksCacheOptions {
    /**
     * Time-to-live for cached keys in milliseconds
     *
     * @default 3600000 (1 hour)
     */
    ttl?: number;
}
