/**
 * Base error for JWT-related failures
 */
export class JwtError extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'JwtError';
    }
}

/**
 * Error for JWKS-related failures (fetch, cache, key lookup)
 */
export class JwksError extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'JwksError';
    }
}
