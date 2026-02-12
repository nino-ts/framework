# @ninots/auth

Authentication for Bun with Laravel-like guards and providers.

## Overview
`@ninots/auth` provides Laravel-like authentication for Bun using guards, providers, and hashers.
It is contracts-first and zero-dependency, designed to plug into any data source
and receive session storage via injection (no direct dependency on `@ninots/session`).

Built-in pieces:
- Guards: `SessionGuard`, `TokenGuard`, `RequestGuard`
- Providers: `DatabaseUserProvider`
- Hashers: `BcryptHasher`, `ArgonHasher`

Detailed guides live in [docs](./docs/README.md).

## Installation
This package is part of the framework workspace. From the framework root:

```bash
bun install
```

If you consume packages in a separate app, ensure `@ninots/auth` and
`@ninots/session` are available in your workspace.

## Core Concepts
- Guards
- Providers
- Hashers

## Quick Start
Minimal setup using a session guard with remember cookies:

```ts
import { SessionManager } from '@ninots/session';
import { SessionGuard, DatabaseUserProvider, BcryptHasher } from '@ninots/auth';

// Session setup (in app code)
const sessionManager = new SessionManager({ driver: 'memory', lifetime: 120 });
const session = sessionManager.build(sessionManager.driver());
await session.start();

// Provide a ConnectionInterface adapter for your DB layer
const db = {
	async query(_sql: string, _params: unknown[] = []) {
		return [];
	},
};
const connection = {
	async query(sql: string, params: unknown[] = []) {
		// Use Bun SQL or any adapter that returns rows
		return db.query(sql, params);
	},
};

const provider = new DatabaseUserProvider(connection, new BcryptHasher(), 'users');
const guard = new SessionGuard('web', provider, session);

// Attempt login (remember=true)
const ok = await guard.attempt({ email: 'user@example.com', password: 'secret' }, true);
const response = new Response('OK');

if (ok) {
	const rememberCookie = guard.getRememberCookie();
	if (rememberCookie) response.headers.append('Set-Cookie', rememberCookie);
}

// Later request: parse cookie value and auto-login
const cookieHeader = request.headers.get('Cookie') ?? '';
const rememberValue = cookieHeader.match(/remember_web_web=([^;]+)/)?.[1];
await guard.user(rememberValue);
```

## Remember Me Cookies
`SessionGuard` generates a remember cookie when `remember=true` and exposes helpers
to set and clear the header. The cookie format is:

```
remember_web_web={userId}|{token}; HttpOnly; SameSite=Lax; Max-Age=1209600; Path=/
```

Reference and details: [docs/remember-me.md](./docs/remember-me.md).

## API Overview
Core classes:
- `SessionGuard` — session/cookie authentication
- `TokenGuard` — bearer token authentication
- `RequestGuard` — custom callback-based auth
- `DatabaseUserProvider` — SQL-based user provider
- `AuthManager` — guard factory by config
- `BcryptHasher`, `ArgonHasher` — password hashing

Core contracts:
- `Authenticatable`, `UserProvider`
- `Guard`, `StatefulGuard`
- `Hasher`

See [docs](./docs/README.md) for detailed usage.

## Testing
```bash
bun test packages/auth/
```

Targeted suites:

```bash
bun test packages/auth/tests/feature/remember-me.test.ts
```

## Notes
- `SessionGuard` requires a `SessionInterface` injected by the application.
- Remember-me cookies are set and cleared by your app using
	`getRememberCookie()` and `getClearRememberCookie()`.
- `SessionGuard.user(rememberCookie?)` can auto-login when a valid cookie is provided.
