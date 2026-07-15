/**
 * Base error for JWT-related failures
 */
export declare class JwtError extends Error {
    constructor(message: string);
}
/**
 * Error for JWKS-related failures (fetch, cache, key lookup)
 */
export declare class JwksError extends Error {
    constructor(message: string);
}
