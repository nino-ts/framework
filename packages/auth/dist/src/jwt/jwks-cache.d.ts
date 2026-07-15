import type { JwksCacheOptions, JwksKey } from "./types";
/**
 * JWKS Cache - fetch and cache JSON Web Key Sets
 *
 * Used for OIDC providers (Google, Microsoft, Apple) to verify JWT signatures.
 */
export declare class JwksCache {
    private cache;
    private options;
    constructor(options?: JwksCacheOptions);
    /**
     * Get a public key by issuer and key ID (kid)
     *
     * Uses cached JWKS when available and valid; otherwise fetches from network.
     */
    getKey(issuer: string, kid: string): Promise<JwksKey | null>;
    /**
     * Force refresh JWKS for the given issuer
     */
    refresh(issuer: string): Promise<void>;
    /**
     * Clear cache for one issuer or all issuers
     */
    clear(issuer?: string): void;
    private isExpired;
    private normalizeIssuer;
    private getJwksUrl;
    private getMicrosoftJwksUrl;
    private ensureScheme;
    private fetchJwks;
}
