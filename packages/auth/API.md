# @ninots/auth - API Documentation

**Version:** 1.0.0  
**Status:** ✅ Production Ready  
**Tests:** 289 passing, 0 failing (100% coverage)

---

## Overview

`@ninots/auth` is the unified authentication package for the Ninots Framework, built with Bun-native primitives and zero dependencies.

### Key Features

- **Guards:** Session-based and Token-based authentication
- **Providers:** Database user provider with SQL support
- **Hashers:** Bcrypt and Argon2id password hashing
- **Middleware:** Function-based authenticate and guest middleware
- **Contracts:** TypeScript interfaces for extensibility

---

## Installation

```bash
bun add @ninots/auth
```

---

## Quick Start

### Basic Session Authentication

```typescript
import {
  AuthManager,
  SessionGuard,
  DatabaseUserProvider,
  BcryptHasher,
  SessionManager,
} from '@ninots/auth';

// Setup session
const sessionManager = new SessionManager({ driver: 'memory', lifetime: 120 });
const session = sessionManager.build(sessionManager.driver());
await session.start();

// Setup database provider
const hasher = new BcryptHasher();
const provider = new DatabaseUserProvider(connection, hasher, 'users');

// Create guard
const guard = new SessionGuard('web', provider, session);

// Attempt login
const authenticated = await guard.attempt({
  email: 'user@example.com',
  password: 'secret',
}, true); // remember me

if (authenticated) {
  const user = await guard.user();
  console.log(`Welcome, ${user?.getName()}!`);
}
```

### Using AuthManager

```typescript
import { AuthManager, SessionGuard, DatabaseUserProvider } from '@ninots/auth';

const auth = new AuthManager();

// Register guard
auth.extend('session', (name) => {
  const provider = new DatabaseUserProvider(connection, hasher, 'users');
  const session = sessionManager.build(sessionManager.driver());
  return new SessionGuard(name, provider, session);
});

// Use guard
const guard = auth.guard('session');
const authenticated = await auth.check();
const user = await auth.user();
const userId = await auth.id();
```

---

## API Reference

### Core Classes

#### AuthManager

Central authentication manager and factory.

```typescript
class AuthManager {
  constructor(config?: { default?: string });
  
  // Resolve guard instance
  guard(name?: string): Guard;
  
  // Register custom guard factory
  extend(name: string, factory: (name: string) => Guard): void;
  
  // Delegate methods to default guard
  check(): Promise<boolean>;
  user(): Promise<Authenticatable | null>;
  id(): Promise<string | number | null>;
}
```

**Example:**
```typescript
const auth = new AuthManager({ default: 'session' });

auth.extend('session', (name) => {
  return new SessionGuard(name, provider, session);
});

const authenticated = await auth.check();
```

---

### Guards

Authentication guards implement the `Guard` interface.

#### SessionGuard

Session-based authentication with cookie support.

```typescript
class SessionGuard implements StatefulGuard {
  constructor(
    name: string,
    provider: UserProvider,
    session: SessionInterface
  );
  
  // Check if user is authenticated
  check(): Promise<boolean>;
  guest(): boolean;
  
  // Get authenticated user
  user(): Promise<Authenticatable | null>;
  id(): Promise<string | number | null>;
  
  // Login/logout
  login(user: Authenticatable, remember?: boolean): Promise<void>;
  logout(): Promise<void>;
  attempt(credentials: Credentials, remember?: boolean): Promise<boolean>;
  validate(credentials: Credentials): Promise<boolean>;
  
  // Login by ID
  loginUsingId(id: string | number): Promise<boolean>;
}
```

**Example:**
```typescript
const guard = new SessionGuard('web', provider, session);

// Login
const success = await guard.attempt({
  email: 'user@example.com',
  password: 'secret',
}, true); // remember me

// Check authentication
if (await guard.check()) {
  const user = await guard.user();
}

// Logout
await guard.logout();
```

#### TokenGuard

Bearer token authentication via header or query parameter.

```typescript
class TokenGuard implements Guard {
  constructor(
    provider: UserProvider,
    request: Request,
    config?: {
      inputKey?: string;      // Default: 'token'
      storageKey?: string;    // Default: 'token'
    }
  );
  
  check(): Promise<boolean>;
  guest(): boolean;
  user(): Promise<Authenticatable | null>;
  id(): Promise<string | number | null>;
  validate(credentials: Credentials): Promise<boolean>;
}
```

**Example:**
```typescript
const guard = new TokenGuard(provider, request);

// Automatically checks:
// 1. Authorization: Bearer <token> header
// 2. ?token=<token> query parameter

if (await guard.check()) {
  const user = await guard.user();
}
```

---

### Providers

User providers retrieve users from storage.

#### DatabaseUserProvider

SQL-based user provider.

```typescript
class DatabaseUserProvider implements UserProvider {
  constructor(
    connection: ConnectionInterface,
    hasher: Hasher,
    table?: string,           // Default: 'users'
    userModel?: new (data: Record<string, unknown>) => Authenticatable
  );
  
  retrieveById(id: string | number): Promise<Authenticatable | null>;
  retrieveByToken(id: string | number, token: string): Promise<Authenticatable | null>;
  retrieveByCredentials(credentials: Credentials): Promise<Authenticatable | null>;
  validateCredentials(user: Authenticatable, password: string): Promise<boolean>;
  updateRememberToken(user: Authenticatable, token: string): Promise<void>;
}
```

**Example:**
```typescript
const provider = new DatabaseUserProvider(connection, hasher, 'users');

// Retrieve user
const user = await provider.retrieveById(1);

// Validate credentials
const valid = await provider.validateCredentials(user, 'password');
```

#### GenericUser

Default user model implementation.

```typescript
class GenericUser implements Authenticatable {
  constructor(attributes: Record<string, unknown>);
  
  getId(): string | number;
  getName(): string | null;
  getEmail(): string | null;
  getPassword(): string | null;
  getRememberToken(): string | null;
}
```

---

### Hashers

Password hashing implementations.

#### BcryptHasher

```typescript
class BcryptHasher implements Hasher {
  constructor(rounds?: number); // Default: 10
  
  hash(password: string): Promise<string>;
  verify(password: string, hash: string): Promise<boolean>;
  needsRehash(hash: string): Promise<boolean>;
}
```

**Example:**
```typescript
const hasher = new BcryptHasher(12); // Custom rounds

const hash = await hasher.hash('secret');
const valid = await hasher.verify('secret', hash);
const rehash = await hasher.needsRehash(hash);
```

#### ArgonHasher

```typescript
class ArgonHasher implements Hasher {
  constructor(config?: {
    memoryCost?: number;    // Default: 65536
    timeCost?: number;      // Default: 3
    parallelism?: number;   // Default: 4
  });
  
  hash(password: string): Promise<string>;
  verify(password: string, hash: string): Promise<boolean>;
  needsRehash(hash: string): Promise<boolean>;
}
```

**Example:**
```typescript
const hasher = new ArgonHasher({
  memoryCost: 32768,
  timeCost: 2,
  parallelism: 4,
});

const hash = await hasher.hash('secret');
```

---

### Middleware

Function-based HTTP middleware.

#### authenticate

Protects routes requiring authentication.

```typescript
function authenticate(auth: AuthManager): MiddlewareFunction;
```

**Response:**
- **Authenticated:** Passes request to next handler
- **Unauthenticated (JSON):** 401 with `{ error: 'Unauthorized' }`
- **Unauthenticated (HTML):** 401 with text `Unauthorized`

**Example:**
```typescript
import { authenticate } from '@ninots/auth';

const auth = new AuthManager();

// Protect route
app.use('/api/*', authenticate(auth));

// Or as route guard
app.get('/protected', authenticate(auth), (req, res) => {
  return res.json({ user: await auth.user() });
});
```

#### guest

Redirects authenticated users (for login pages).

```typescript
function guest(auth: AuthManager): MiddlewareFunction;
```

**Response:**
- **Guest:** Passes request to next handler
- **Authenticated:** 302 redirect to `/home` or `?redirect` param

**Example:**
```typescript
import { guest } from '@ninots/auth';

const auth = new AuthManager();

// Login page (redirect if already logged in)
app.get('/login', guest(auth), (req, res) => {
  return res.html('<form>...</form>');
});
```

---

### Contracts (TypeScript Interfaces)

#### Guard

```typescript
interface Guard {
  check(): Promise<boolean>;
  guest(): boolean;
  user(): Promise<Authenticatable | null>;
  id(): Promise<string | number | null>;
}
```

#### StatefulGuard

```typescript
interface StatefulGuard extends Guard {
  login(user: Authenticatable, remember?: boolean): Promise<void>;
  logout(): Promise<void>;
  attempt(credentials: Credentials, remember?: boolean): Promise<boolean>;
  validate(credentials: Credentials): Promise<boolean>;
}
```

#### UserProvider

```typescript
interface UserProvider {
  retrieveById(id: string | number): Promise<Authenticatable | null>;
  retrieveByToken(id: string | number, token: string): Promise<Authenticatable | null>;
  retrieveByCredentials(credentials: Credentials): Promise<Authenticatable | null>;
  validateCredentials(user: Authenticatable, password: string): Promise<boolean>;
  updateRememberToken(user: Authenticatable, token: string): Promise<void>;
}
```

#### Hasher

```typescript
interface Hasher {
  hash(password: string): Promise<string>;
  verify(password: string, hash: string): Promise<boolean>;
  needsRehash(hash: string): Promise<boolean>;
}
```

#### Authenticatable

```typescript
interface Authenticatable {
  getId(): string | number;
  getName(): string | null;
  getEmail(): string | null;
  getPassword(): string | null;
  getRememberToken(): string | null;
}
```

---

## Advanced Usage

### Custom User Provider

```typescript
import type { UserProvider, Authenticatable } from '@ninots/auth';

class CustomUserProvider implements UserProvider {
  async retrieveById(id: string): Promise<Authenticatable | null> {
    // Your implementation
  }
  
  async retrieveByToken(id: string, token: string): Promise<Authenticatable | null> {
    // Your implementation
  }
  
  async retrieveByCredentials(credentials: any): Promise<Authenticatable | null> {
    // Your implementation
  }
  
  async validateCredentials(user: Authenticatable, password: string): Promise<boolean> {
    // Your implementation
  }
  
  async updateRememberToken(user: Authenticatable, token: string): Promise<void> {
    // Your implementation
  }
}
```

### Custom Guard

```typescript
import type { Guard, Authenticatable } from '@ninots/auth';

class CustomGuard implements Guard {
  async check(): Promise<boolean> {
    // Your implementation
  }
  
  async guest(): Promise<boolean> {
    return !(await this.check());
  }
  
  async user(): Promise<Authenticatable | null> {
    // Your implementation
  }
  
  async id(): Promise<string | number | null> {
    const user = await this.user();
    return user?.getId() ?? null;
  }
}

// Register with AuthManager
auth.extend('custom', (name) => new CustomGuard());
```

### Custom Hasher

```typescript
import type { Hasher } from '@ninots/auth';

class CustomHasher implements Hasher {
  async hash(password: string): Promise<string> {
    // Your implementation
  }
  
  async verify(password: string, hash: string): Promise<boolean> {
    // Your implementation
  }
  
  async needsRehash(hash: string): Promise<boolean> {
    // Your implementation
  }
}
```

---

## Testing

### Mocking Auth

```typescript
import { mock } from 'bun:test';
import { createMockProvider, createMockSession, createMockUser } from '@/mocks';

// Create mocks
const provider = createMockProvider();
const session = createMockSession();
const user = createMockUser({ id: 1, email: 'test@example.com' });

// Setup mock behavior
provider.retrieveByCredentials = mock().mockResolvedValue(user);
provider.validateCredentials = mock().mockResolvedValue(true);

// Test
const guard = new SessionGuard('web', provider, session);
const authenticated = await guard.attempt({
  email: 'test@example.com',
  password: 'secret',
});

expect(authenticated).toBe(true);
```

---

## Migration Guide

### From v0.0.x to v1.0.0

**Before:**
```typescript
import { SessionManager } from '@ninots/session';
import { JwtDecoder } from '@ninots/jwt';
import { RequestGuard } from '@ninots/auth';

export class Authenticate {
  constructor(private auth: AuthManager) {}
}
```

**After:**
```typescript
import { SessionManager } from '@ninots/session'; // Separate package
import { JwtDecoder } from '@ninots/jwt';         // Separate package
import { authenticate } from '@ninots/auth';      // Function, not class

export const authMiddleware = authenticate(auth);
```

**Breaking Changes:**
- `RequestGuard` removed (no clear use case)
- Middleware classes → functions
- Internal types no longer exported
- Error messages updated

---

## Support

- **GitHub:** [github.com/pandowlabs/ninots](https://github.com/pandowlabs/ninots)
- **Documentation:** See README.md for complete guide
- **Tests:** 289 passing tests (100% coverage)

---

## License

MIT License - See LICENSE file for details.
