import { afterEach, describe, expect, it, mock } from 'bun:test';
import { JwksError } from '@/errors.ts';
import { JwksCache } from '@/jwks-cache.ts';
import type { JwksResponse } from '@/types.ts';

const GOOGLE_JWKS_URL = 'https://www.googleapis.com/oauth2/v3/certs';

const SAMPLE_JWKS: JwksResponse = {
  keys: [
    {
      alg: 'RS256',
      e: 'AQAB',
      kid: 'key-1',
      kty: 'RSA',
      n: 'test-modulus',
      use: 'sig',
    },
    {
      alg: 'RS256',
      e: 'AQAB',
      kid: 'key-2',
      kty: 'RSA',
      n: 'test-modulus-2',
      use: 'sig',
    },
  ],
};

const originalFetch = globalThis.fetch;
const originalDateNow = Date.now;

afterEach(() => {
  globalThis.fetch = originalFetch;
  Date.now = originalDateNow;
});

describe('JwksCache', () => {
  it('fetches JWKS on cache miss', async () => {
    const fetchMock = setFetchMock(async () => createJsonResponse(SAMPLE_JWKS));
    const cache = new JwksCache();

    const key = await cache.getKey('accounts.google.com', 'key-1');

    expect(fetchMock.mock.calls.length).toBe(1);
    expect(key?.kid).toBe('key-1');
  });

  it('returns cached key on cache hit', async () => {
    const fetchMock = setFetchMock(async () => createJsonResponse(SAMPLE_JWKS));
    const cache = new JwksCache();

    const first = await cache.getKey('accounts.google.com', 'key-1');
    const second = await cache.getKey('accounts.google.com', 'key-2');

    expect(fetchMock.mock.calls.length).toBe(1);
    expect(first?.kid).toBe('key-1');
    expect(second?.kid).toBe('key-2');
  });

  it('re-fetches when TTL expires', async () => {
    const fetchMock = setFetchMock(async () => createJsonResponse(SAMPLE_JWKS));
    const cache = new JwksCache({ ttl: 100 });

    const baseNow = Date.now();
    Date.now = () => baseNow;
    await cache.getKey('accounts.google.com', 'key-1');

    Date.now = () => baseNow + 200;
    await cache.getKey('accounts.google.com', 'key-1');

    expect(fetchMock.mock.calls.length).toBe(2);
  });

  it('returns null for unknown kid', async () => {
    setFetchMock(async () => createJsonResponse(SAMPLE_JWKS));
    const cache = new JwksCache();

    const key = await cache.getKey('accounts.google.com', 'missing-key');

    expect(key).toBeNull();
  });

  it('throws JwksError on fetch failure', async () => {
    setFetchMock(async () => new Response('fail', { status: 500 }));
    const cache = new JwksCache();

    await expect(cache.getKey('accounts.google.com', 'key-1')).rejects.toThrow(JwksError);
  });

  it('throws JwksError on fetch exception', async () => {
    setFetchMock(async () => {
      throw new Error('timeout');
    });
    const cache = new JwksCache();

    await expect(cache.getKey('accounts.google.com', 'key-1')).rejects.toThrow('JWKS fetch failed');
  });

  it('refresh forces cache invalidation', async () => {
    const fetchMock = setFetchMock(async () => createJsonResponse(SAMPLE_JWKS));
    const cache = new JwksCache();

    await cache.getKey('accounts.google.com', 'key-1');
    await cache.refresh('accounts.google.com');
    await cache.getKey('accounts.google.com', 'key-1');

    expect(fetchMock.mock.calls.length).toBe(2);
  });

  it('clear(issuer) removes one cache entry', async () => {
    const fetchMock = setFetchMock(async () => createJsonResponse(SAMPLE_JWKS));
    const cache = new JwksCache();

    await cache.getKey('accounts.google.com', 'key-1');
    cache.clear('accounts.google.com');
    await cache.getKey('accounts.google.com', 'key-1');

    expect(fetchMock.mock.calls.length).toBe(2);
  });

  it('clear() removes all cache entries', async () => {
    const fetchMock = setFetchMock(async () => createJsonResponse(SAMPLE_JWKS));
    const cache = new JwksCache();

    await cache.getKey('accounts.google.com', 'key-1');
    await cache.getKey('https://appleid.apple.com', 'key-1');
    cache.clear();
    await cache.getKey('accounts.google.com', 'key-1');

    expect(fetchMock.mock.calls.length).toBe(3);
  });

  it('uses hardcoded URL for Google issuer', async () => {
    const fetchMock = setFetchMock(async () => createJsonResponse(SAMPLE_JWKS));
    const cache = new JwksCache();

    await cache.getKey('accounts.google.com', 'key-1');

    const url = getFetchUrl(fetchMock.mock.calls[0] as unknown[]);
    expect(url).toBe(GOOGLE_JWKS_URL);
  });

  it('falls back to .well-known for unknown issuer', async () => {
    const fetchMock = setFetchMock(async () => createJsonResponse(SAMPLE_JWKS));
    const cache = new JwksCache();

    await cache.getKey('custom-issuer.com', 'key-1');

    const url = getFetchUrl(fetchMock.mock.calls[0] as unknown[]);
    expect(url).toBe('https://custom-issuer.com/.well-known/jwks.json');
  });
});

function setFetchMock(handler: (input: string | URL | Request, init?: RequestInit) => Promise<Response>) {
  const fetchMock = mock(handler);
  globalThis.fetch = fetchMock as unknown as typeof fetch;
  return fetchMock;
}

function createJsonResponse(body: JwksResponse): Response {
  return new Response(JSON.stringify(body), {
    headers: { 'Content-Type': 'application/json' },
    status: 200,
  });
}

function getFetchUrl(call: unknown[]): string {
  const input = call[0] as string | URL | Request;
  if (typeof input === 'string') {
    return input;
  }

  if (input instanceof URL) {
    return input.toString();
  }

  if (input instanceof Request) {
    return input.url;
  }

  return String(input);
}
