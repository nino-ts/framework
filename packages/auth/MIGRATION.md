# Migration Guide: Auth Packages Unification

## Overview

Starting from version 0.1.0, all authentication-related packages have been unified into a single `@ninots/auth` package. This simplifies dependencies and provides a cohesive API for all authentication needs.

## Before (v0.0.x)

```typescript
// Multiple packages required
import { SessionManager } from '@ninots/session';
import { JwtDecoder } from '@ninots/jwt';
import { SocialManager } from '@ninots/social';
import { WebEncrypter } from '@ninots/encryption';
import { SessionGuard, DatabaseUserProvider } from '@ninots/auth';
```

## After (v0.1.0+)

```typescript
// Single package - all imports from @ninots/auth
import {
  SessionManager,
  JwtDecoder,
  SocialManager,
  WebEncrypter,
  SessionGuard,
  DatabaseUserProvider,
} from '@ninots/auth';

// Or use the unified Auth facade
import { Auth } from '@ninots/auth';
```

## Package Changes

| Old Package | New Location | Status |
|-------------|--------------|--------|
| `@ninots/session` | `@ninots/auth/session` | ✅ Merged |
| `@ninots/jwt` | `@ninots/auth/jwt` | ✅ Merged |
| `@ninots/social` | `@ninots/auth/social` | ✅ Merged |
| `@ninots/encryption` | `@ninots/auth/encryption` | ✅ Merged |
| `@ninots/auth` (core) | `@ninots/auth` | ✅ Enhanced |

## Breaking Changes

**None** - All exports are backward compatible via barrel exports.

Your existing code will continue to work without modifications. The unification is additive and maintains all previous exports.

## Migration Examples

### Session Management

```typescript
// Before
import { SessionManager } from '@ninots/session';

// After (both work)
import { SessionManager } from '@ninots/auth';
// or
import { SessionManager } from '@ninots/auth/session';
```

### JWT Decoding

```typescript
// Before
import { JwtDecoder } from '@ninots/jwt';

// After (both work)
import { JwtDecoder } from '@ninots/auth';
// or
import { JwtDecoder } from '@ninots/auth/jwt';
```

### Social Authentication

```typescript
// Before
import { SocialManager, GitHubProvider } from '@ninots/social';

// After (both work)
import { SocialManager, GitHubProvider } from '@ninots/auth';
// or
import { SocialManager } from '@ninots/auth/social';
```

### Encryption

```typescript
// Before
import { WebEncrypter } from '@ninots/encryption';

// After (both work)
import { WebEncrypter } from '@ninots/auth';
// or
import { WebEncrypter } from '@ninots/auth/encryption';
```

## New Unified API

### Auth Facade

```typescript
import { Auth } from '@ninots/auth';

// Access all auth features through a single facade
const user = await Auth.user();
const session = Auth.session();
const jwt = Auth.jwt();
const social = Auth.social('github');
const encrypter = Auth.encrypter();
```

### Complete Configuration Example

```typescript
import {
  AuthManager,
  SessionGuard,
  DatabaseUserProvider,
  BcryptHasher,
  SessionManager,
  JwtDecoder,
  SocialManager,
  WebEncrypter,
} from '@ninots/auth';

// Session setup
const sessionManager = new SessionManager({ driver: 'memory', lifetime: 120 });
const session = sessionManager.build(sessionManager.driver());

// Database provider
const provider = new DatabaseUserProvider(connection, new BcryptHasher(), 'users');

// Guard setup
const guard = new SessionGuard('web', provider, session);

// JWT setup
const jwtDecoder = new JwtDecoder({ secret: process.env.JWT_SECRET });

// Social setup
const socialManager = new SocialManager({
  github: {
    clientId: process.env.GITHUB_ID,
    clientSecret: process.env.GITHUB_SECRET,
    redirectUri: '/auth/github/callback',
  },
});

// Encryption setup
const encrypter = new WebEncrypter(process.env.APP_KEY);
```

## Update Your package.json

Remove old dependencies:

```json
{
  "dependencies": {
    "@ninots/auth": "^0.1.0",
    "@ninots/session": "^0.0.x",     // ❌ Remove
    "@ninots/jwt": "^0.0.x",         // ❌ Remove
    "@ninots/social": "^0.0.x",      // ❌ Remove
    "@ninots/encryption": "^0.0.x"   // ❌ Remove
  }
}
```

Keep only:

```json
{
  "dependencies": {
    "@ninots/auth": "^0.1.0"
  }
}
```

## Checklist

- [ ] Update `package.json` to use only `@ninots/auth`
- [ ] Update imports to use `@ninots/auth` (optional, old imports still work)
- [ ] Run tests to verify everything works
- [ ] Update documentation if referencing old package names

## Support

For issues or questions, refer to the main [README.md](./README.md) or open an issue on the framework repository.
