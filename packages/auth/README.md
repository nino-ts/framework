# @ninots/auth

Authentication for Bun with Laravel-like guards, providers, and unified auth utilities.

## Overview

`@ninots/auth` is the **unified authentication package** for the Ninots Framework. It consolidates session management, JWT decoding, social authentication, and encryption into a single, cohesive API.

Built with Bun-native primitives, zero dependencies, and Laravel-inspired DX.

## Features

- **Guards**: `SessionGuard`, `TokenGuard`, `RequestGuard`
- **Providers**: `DatabaseUserProvider`
- **Hashers**: `BcryptHasher`, `ArgonHasher`
- **Session**: Memory, File, Database drivers
- **JWT**: Decoding, verification, JWKs support
- **Social**: OAuth providers (GitHub, more coming)
- **Encryption**: Web Crypto API encrypter

## Installation

```bash
bun add @ninots/auth
```

## Quick Start

### Basic Session Authentication

```typescript
import {
  SessionGuard,
  DatabaseUserProvider,
  BcryptHasher,
  SessionManager,
} from '@ninots/auth';

// Setup session
const sessionManager = new SessionManager({ driver: 'memory', lifetime: 120 });
const session = sessionManager.build(sessionManager.driver());
await session.start();

// Setup provider
const provider = new DatabaseUserProvider(connection, new BcryptHasher(), 'users');

// Create guard
const guard = new SessionGuard('web', provider, session);

// Attempt login
const authenticated = await guard.attempt(
  { email: 'user@example.com', password: 'secret' },
  true // remember me
);

if (authenticated) {
  const user = await guard.user();
  console.log(`Welcome, ${user.name}!`);
}
```

### Using the Auth Facade

```typescript
import { Auth } from '@ninots/auth';

// Check authentication
if (await Auth.check()) {
  const user = await Auth.user();
}

// Access session
const session = Auth.session();
session.put('key', 'value');

// Verify JWT
const payload = await Auth.jwt().verify(token, secret);

// Social login
const url = Auth.social('github').redirectUrl();

// Encrypt data
const encrypted = Auth.encrypter().encrypt('sensitive data');
```

## API Reference

### Core Classes

| Class | Description |
|-------|-------------|
| `AuthManager` | Central auth manager and factory |
| `SessionGuard` | Session/cookie-based authentication |
| `TokenGuard` | Bearer token authentication |
| `RequestGuard` | Custom callback-based authentication |
| `DatabaseUserProvider` | SQL-based user provider |
| `BcryptHasher` | Bcrypt password hashing |
| `ArgonHasher` | Argon2 password hashing |

### Session

| Class | Description |
|-------|-------------|
| `SessionManager` | Session factory and configuration |
| `Session` | Session instance with get/put/forget |
| `MemorySessionDriver` | In-memory session storage |
| `FileSessionDriver` | File-based session storage |
| `DatabaseSessionDriver` | Database session storage |

### JWT

| Class | Description |
|-------|-------------|
| `JwtDecoder` | JWT decoding and verification |
| `JwksCache` | JWKs caching for OIDC |
| `JwtError` | JWT-related errors |
| `JwksError` | JWKs-related errors |

### Social

| Class | Description |
|-------|-------------|
| `SocialManager` | OAuth provider factory |
| `AbstractOAuthProvider` | Base class for OAuth providers |
| `GitHubProvider` | GitHub OAuth provider |
| `SocialUser` | Normalized social user data |

### Encryption

| Class | Description |
|-------|-------------|
| `WebEncrypter` | Web Crypto API encryption |
| `EncryptException` | Encryption errors |
| `DecryptException` | Decryption errors |

### Middleware

| Function | Description |
|----------|-------------|
| `authenticate()` | Require authentication middleware |
| `guest()` | Require guest (not authenticated) middleware |

### Contracts (TypeScript Interfaces)

| Interface | Description |
|-----------|-------------|
| `Authenticatable` | User model interface |
| `Guard` | Authentication guard contract |
| `StatefulGuard` | Stateful guard with session |
| `UserProvider` | User retrieval contract |
| `Hasher` | Password hashing contract |
| `SessionInterface` | Session storage contract |
| `ConnectionInterface` | Database connection contract |

## Configuration

### Complete Setup Example

```typescript
import {
  AuthManager,
  SessionGuard,
  TokenGuard,
  DatabaseUserProvider,
  BcryptHasher,
  SessionManager,
  JwtDecoder,
  SocialManager,
  WebEncrypter,
} from '@ninots/auth';

// Auth configuration
const config = {
  // Guard settings
  guard: 'session',
  guards: {
    session: { driver: 'session', provider: 'users' },
    token: { driver: 'token', provider: 'users' },
  },

  // User providers
  providers: {
    users: { driver: 'database', table: 'users' },
  },

  // Hashing
  hashing: { driver: 'bcrypt', rounds: 10 },

  // Session
  session: {
    driver: 'database',
    table: 'sessions',
    lifetime: 120,
    cookie: 'ninots_session',
  },

  // JWT
  jwt: {
    secret: process.env.JWT_SECRET,
    clockSkew: 0,
  },

  // Encryption
  encryption: {
    key: process.env.APP_KEY,
    cipher: 'AES-256-CBC',
  },

  // Social
  social: {
    github: {
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET,
      redirectUri: '/auth/github/callback',
    },
  },
};

// Initialize AuthManager
const authManager = new AuthManager(config);
```

## Advanced Usage

### Remember Me Cookies

```typescript
import { SessionGuard } from '@ninots/auth';

const guard = new SessionGuard('web', provider, session);

// Login with remember me
const authenticated = await guard.attempt(credentials, true);

if (authenticated) {
  const rememberCookie = guard.getRememberCookie();
  response.headers.append('Set-Cookie', rememberCookie);
}

// Auto-login from cookie
const cookieHeader = request.headers.get('Cookie') ?? '';
const rememberValue = cookieHeader.match(/remember_web_web=([^;]+)/)?.[1];
const user = await guard.user(rememberValue);
```

### Custom User Provider

```typescript
import { UserProvider, Authenticatable } from '@ninots/auth';

class CustomUserProvider implements UserProvider {
  async retrieveById(id: number): Promise<Authenticatable | null> {
    // Custom retrieval logic
  }

  async retrieveByToken(id: number, token: string): Promise<Authenticatable | null> {
    // Custom token retrieval
  }

  async updateRememberToken(user: Authenticatable, token: string): Promise<void> {
    // Custom token update
  }

  async validateCredentials(user: Authenticatable, credentials: unknown): Promise<boolean> {
    // Custom credential validation
  }
}
```

### JWT with JWKs

```typescript
import { JwtDecoder, JwksCache } from '@ninots/auth';

const jwksCache = new JwksCache('https://auth.example.com/.well-known/jwks.json');
const decoder = new JwtDecoder({ jwksCache });

const payload = await decoder.verify(token);
console.log(payload.sub); // User ID
```

### Social OAuth Flow

```typescript
import { SocialManager } from '@ninots/auth';

const socialManager = new SocialManager({
  github: {
    clientId: process.env.GITHUB_ID,
    clientSecret: process.env.GITHUB_SECRET,
    redirectUri: '/auth/github/callback',
  },
});

// Redirect to GitHub
const provider = socialManager.driver('github');
const url = provider.redirectUrl();
response.headers.set('Location', url);

// Handle callback
const code = request.url.searchParams.get('code');
const socialUser = await provider.user(code);

// Find or create local user
const user = await findOrCreateUser(socialUser);
```

### Encryption

```typescript
import { WebEncrypter } from '@ninots/auth';

const encrypter = new WebEncrypter(process.env.APP_KEY);

// Encrypt
const encrypted = encrypter.encrypt('sensitive data');

// Decrypt
const decrypted = encrypter.decrypt(encrypted);

// Encrypt with context
const encryptedWithContext = encrypter.encryptWithContext('data', { userId: 1 });
```

## Testing

```bash
bun test packages/auth/
```

### Targeted Test Suites

```bash
# Session tests
bun test packages/auth/tests/session/

# JWT tests
bun test packages/auth/tests/jwt/

# Social tests
bun test packages/auth/tests/social/

# Encryption tests
bun test packages/auth/tests/encryption/

# Feature tests
bun test packages/auth/tests/feature/
```

## Migration Guide

Coming from separate packages? See [MIGRATION.md](./MIGRATION.md) for a complete migration guide.

## Package Structure

```
@ninots/auth/
├── src/
│   ├── guards/           # SessionGuard, TokenGuard, RequestGuard
│   ├── providers/        # DatabaseUserProvider
│   ├── hashing/          # BcryptHasher, ArgonHasher
│   ├── session/          # Session, SessionManager, drivers
│   ├── jwt/              # JwtDecoder, JwksCache
│   ├── social/           # SocialManager, OAuth providers
│   ├── encryption/       # WebEncrypter
│   ├── middleware/       # authenticate, guest
│   └── contracts/        # TypeScript interfaces
└── tests/
    ├── unit/             # Unit tests
    └── feature/          # Integration tests
```

## License

MIT License - See LICENSE file for details.
