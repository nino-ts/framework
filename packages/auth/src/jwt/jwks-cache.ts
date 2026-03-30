import { JwksError } from '@/jwt/errors.ts';
import type { JwksCacheOptions, JwksKey, JwksResponse } from '@/jwt/types.ts';

const DEFAULT_TTL_MS = 60 * 60 * 1000;
const DEFAULT_FETCH_TIMEOUT_MS = 5000;

const KNOWN_JWKS_URLS: Record<string, string> = {
  'accounts.google.com': 'https://www.googleapis.com/oauth2/v3/certs',
  'https://accounts.google.com': 'https://www.googleapis.com/oauth2/v3/certs',
  'https://appleid.apple.com': 'https://appleid.apple.com/auth/keys',
};

interface CacheEntry {
  fetchedAt: number;
  keys: JwksKey[];
  ttl: number;
}

/**
 * JWKS Cache - fetch and cache JSON Web Key Sets
 *
 * Used for OIDC providers (Google, Microsoft, Apple) to verify JWT signatures.
 */
export class JwksCache {
  private cache = new Map<string, CacheEntry>();
  private options: Required<JwksCacheOptions>;

  constructor(options: JwksCacheOptions = {}) {
    this.options = {
      ttl: options.ttl ?? DEFAULT_TTL_MS,
    };
  }

  /**
   * Get a public key by issuer and key ID (kid)
   *
   * Uses cached JWKS when available and valid; otherwise fetches from network.
   */
  async getKey(issuer: string, kid: string): Promise<JwksKey | null> {
    const normalizedIssuer = this.normalizeIssuer(issuer);
    if (!normalizedIssuer) {
      throw new JwksError('Issuer is required');
    }

    const keyId = kid?.trim();
    if (!keyId) {
      return null;
    }

    const cached = this.cache.get(normalizedIssuer);
    if (cached && !this.isExpired(cached)) {
      return cached.keys.find((key) => key.kid === keyId) ?? null;
    }

    const jwks = await this.fetchJwks(normalizedIssuer);
    this.cache.set(normalizedIssuer, {
      fetchedAt: Date.now(),
      keys: jwks.keys,
      ttl: this.options.ttl,
    });

    return jwks.keys.find((key) => key.kid === keyId) ?? null;
  }

  /**
   * Force refresh JWKS for the given issuer
   */
  async refresh(issuer: string): Promise<void> {
    const normalizedIssuer = this.normalizeIssuer(issuer);
    if (!normalizedIssuer) {
      throw new JwksError('Issuer is required');
    }

    const jwks = await this.fetchJwks(normalizedIssuer);
    this.cache.set(normalizedIssuer, {
      fetchedAt: Date.now(),
      keys: jwks.keys,
      ttl: this.options.ttl,
    });
  }

  /**
   * Clear cache for one issuer or all issuers
   */
  clear(issuer?: string): void {
    if (issuer) {
      const normalizedIssuer = this.normalizeIssuer(issuer);
      if (normalizedIssuer) {
        this.cache.delete(normalizedIssuer);
      }
      return;
    }

    this.cache.clear();
  }

  private isExpired(entry: CacheEntry): boolean {
    return Date.now() - entry.fetchedAt >= entry.ttl;
  }

  private normalizeIssuer(issuer: string): string {
    return issuer.trim().replace(/\/+$/, '');
  }

  private getJwksUrl(issuer: string): string {
    const mapped = KNOWN_JWKS_URLS[issuer];
    if (mapped) {
      return mapped;
    }

    const microsoftUrl = this.getMicrosoftJwksUrl(issuer);
    if (microsoftUrl) {
      return microsoftUrl;
    }

    const withScheme = this.ensureScheme(issuer);
    return `${withScheme}/.well-known/jwks.json`;
  }

  private getMicrosoftJwksUrl(issuer: string): string | null {
    const withScheme = this.ensureScheme(issuer);
    if (!withScheme.includes('login.microsoftonline.com/')) {
      return null;
    }

    const normalized = withScheme.replace(/\/v2\.0$/, '');
    return `${normalized}/discovery/v2.0/keys`;
  }

  private ensureScheme(issuer: string): string {
    if (issuer.startsWith('http://') || issuer.startsWith('https://')) {
      return issuer;
    }

    return `https://${issuer}`;
  }

  private async fetchJwks(issuer: string): Promise<JwksResponse> {
    const jwksUrl = this.getJwksUrl(issuer);

    let response: Response;
    try {
      response = await fetch(jwksUrl, {
        signal: AbortSignal.timeout(DEFAULT_FETCH_TIMEOUT_MS),
      });
    } catch (error) {
      throw new JwksError(`JWKS fetch failed: ${(error as Error).message}`);
    }

    if (!response.ok) {
      throw new JwksError(`JWKS fetch failed: HTTP ${response.status}`);
    }

    let jwks: JwksResponse;
    try {
      jwks = (await response.json()) as JwksResponse;
    } catch (error) {
      throw new JwksError(`Invalid JWKS response: ${(error as Error).message}`);
    }

    if (!jwks || !Array.isArray(jwks.keys)) {
      throw new JwksError('Invalid JWKS response: missing keys');
    }

    return jwks;
  }
}
