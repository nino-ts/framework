# @ninots/jwt

JWT decoder and JWKS cache for OIDC providers — 100% Bun-native.

## Overview

`@ninots/jwt` provides zero-dependency JWT decoding and verification using Bun's native `crypto.subtle` API. It includes:

- **JwtDecoder**: Decode JWT tokens and verify signatures with RS256/ES256
- **JwksCache**: Fetch and cache JSON Web Key Sets from OIDC providers (Google, Microsoft, Apple)

Perfect for verifying ID tokens from OAuth providers without external dependencies.

## Installation

```bash
bun install @ninots/jwt
```

## Features

- ✅ **Zero Dependencies** — Only Bun runtime APIs
- ✅ **Bun-Native Crypto** — Uses `crypto.subtle` for signature verification
- ✅ **RS256 & ES256 Support** — RSA and ECDSA signature algorithms
- ✅ **JWKS Cache** — In-memory caching with TTL (default 1 hour)
- ✅ **OIDC Provider Support** — Pre-configured URLs for Google, Microsoft, Apple
- ✅ **Complete Error Handling** — `JwtError` and `JwksError` for clear failure modes

## Quick Start

### Decode a JWT Token

```typescript
import { JwtDecoder } from '@ninots/jwt';

const decoder = new JwtDecoder();
const token = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImtpZCI6InRlc3Qta2V5LTEifQ.eyJpc3MiOiJodHRwczovL2FjY291bnRzLmdvb2dsZS5jb20iLCJzdWIiOiIxMjMiLCJhdWQiOiJjbGllbnQtaWQiLCJleHAiOjk5OTk5OTk5OTksImlhdCI6MTIzNDU2Nzg5MH0.signature';

const { header, payload } = decoder.decode(token);
console.log(payload.iss); // "https://accounts.google.com"
console.log(payload.sub); // "123"
console.log(payload.email); // "user@example.com" (if present)
```

### Verify Token with JWKS

```typescript
import { JwtDecoder, JwksCache } from '@ninots/jwt';

const decoder = new JwtDecoder();
const jwksCache = new JwksCache();

// ID token from OIDC provider (Google, Microsoft, etc.)
const idToken = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImtpZCI6ImtleS0xIn0.eyJpc3MiOiJodHRwczovL2FjY291bnRzLmdvb2dsZS5jb20iLCJzdWIiOiIxMjM0NTYiLCJhdWQiOiJjbGllbnQtaWQiLCJleHAiOjk5OTk5OTk5OTksImlhdCI6MTIzNDU2Nzg5MH0.signature';

// Step 1: Decode to get kid and issuer
const { header, payload } = decoder.decode(idToken);

// Step 2: Fetch public key from JWKS
const publicKey = await jwksCache.getKey(payload.iss, header.kid!);
if (!publicKey) {
    throw new Error('Public key not found');
}

// Step 3: Verify signature
const isValid = await decoder.verify(idToken, publicKey);
if (!isValid) {
    throw new Error('Invalid token signature');
}

// Step 4: Check expiration (handled by verify by default)
console.log('Token is valid!');
```

### Handle Expired Tokens

```typescript
import { JwtDecoder } from '@ninots/jwt';

// Default: verify() rejects expired tokens
const decoder = new JwtDecoder();
const isValid = await decoder.verify(token, publicKey);

// For testing: skip expiration check
const testDecoder = new JwtDecoder({ skipExpiration: true });
const isValidForTesting = await testDecoder.verify(token, publicKey);
```

### Advanced: JWKS Cache Management

```typescript
import { JwksCache } from '@ninots/jwt';

// Cache with custom TTL (30 minutes)
const cache = new JwksCache({ ttl: 30 * 60 * 1000 });

// Get key (uses cache if available)
const key = await cache.getKey('accounts.google.com', 'key-1');

// Force refresh cached keys
await cache.refresh('accounts.google.com');

// Clear cache for one issuer
cache.clear('accounts.google.com');

// Clear all cached keys
cache.clear();
```

## API Overview

### JwtDecoder

| Method | Description |
|--------|-------------|
| `decode(token)` | Decode JWT into `{ header, payload }` (no verification) |
| `verify(token, publicKey)` | Verify signature and expiration |

**Options:**
- `clockSkew?: number` — Tolerance in seconds (default: 0)
- `skipExpiration?: boolean` — Skip exp claim validation (default: false)

### JwksCache

| Method | Description |
|--------|-------------|
| `getKey(issuer, kid)` | Fetch public key by issuer and key ID |
| `refresh(issuer)` | Force refresh keys for issuer |
| `clear(issuer?)` | Clear cache (one issuer or all) |

**Options:**
- `ttl?: number` — Cache lifetime in ms (default: 3600000 = 1 hour)

### Types

- `JwtHeader` — Token header with alg, kid, typ
- `JwtPayload` — Registered claims (iss, sub, aud, exp, iat)
- `JwksKey` — Public key from JWKS endpoint
- `JwksResponse` — JWKS endpoint response

## Testing

```bash
# Run all tests
bun test

# Run with coverage
bun test --coverage

# Watch mode
bun test --watch
```

**Test Coverage:** 100% functions, 100% lines

## OIDC Provider Support

The `JwksCache` automatically detects JWKS URLs for:

| Provider | Issuer Pattern | JWKS URL |
|----------|----------------|----------|
| Google | `accounts.google.com` or `https://accounts.google.com` | `https://www.googleapis.com/oauth2/v3/certs` |
| Apple | `https://appleid.apple.com` | `https://appleid.apple.com/auth/keys` |
| Microsoft | `login.microsoftonline.com/{tenant}/v2.0` | `.../discovery/v2.0/keys` |
| Custom | Any other issuer | `https://{issuer}/.well-known/jwks.json` |

## Notes

- **Zero Dependencies** — Uses only Bun's built-in APIs (`crypto.subtle`, `fetch`, `Buffer`)
- **No Symmetric Algorithms** — Only RS256 (RSA) and ES256 (ECDSA) supported for security
- **Fetch Timeout** — JWKS requests timeout after 5 seconds
- **Error Handling** — All operations throw `JwtError` or `JwksError` with clear messages
