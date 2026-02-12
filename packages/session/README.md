# @ninots/session

Session management for Bun with multiple storage drivers.

## Overview

`@ninots/session` provides a flexible session management system with three pluggable drivers:

- **MemorySessionDriver**: In-memory storage for testing
- **FileSessionDriver**: File-based storage for development (default)
- **DatabaseSessionDriver**: Database persistence for production

Each driver implements the `SessionDriver` contract, allowing you to swap implementations without changing application code. Sessions are identified by unique IDs and support features like data flashing, token regeneration, and expiration management.

## Installation

```bash
bun install @ninots/session
```

## Drivers

| Driver | Use Case | Storage | Lifetime Tracking | Shared State |
|--------|----------|---------|------|:-----------:|
| **Memory** | Tests, single-server dev | In-memory Map | Milliseconds | ✗ Local only |
| **File** | Local development | JSON files via Bun | Milliseconds + JSON | ✗ Single server |
| **Database** | Production | SQL table | Database timestamp | ✓ Multi-server |

See [docs/memory-vs-file-vs-db.md](./docs/memory-vs-file-vs-db.md) for detailed comparison and selection guide.

## Quick Start

```typescript
import { SessionManager } from '@ninots/session';

// Create session manager with file driver (default)
const manager = new SessionManager({
  driver: 'file',
  lifetime: 120, // minutes
  files: './storage/sessions', // file path
});

// Get driver and build session
const driver = manager.driver();
const session = manager.build(driver);

// Start: reads existing data from storage
await session.start();

// Store user ID
session.put('user_id', 123);
session.put('role', 'admin');

// Persist to driver
await session.save(120); // lifetime in minutes

// Later request: retrieve data
const userId = session.get<number>('user_id'); // 123
const role = session.get<string>('role'); // 'admin'

// Check and remove
if (session.has('user_id')) {
  session.forget('user_id');
}

// Logout: destroy session
await session.invalidate();
```

## Session API

### Reading & Writing
- **`get<T>(key, defaultValue?): T`** — Retrieve value by key, return default if missing
- **`put(key, value): void`** — Store value by key
- **`all(): Record<string, unknown>`** — Get all session attributes
- **`has(key): boolean`** — Check if key exists

### Management
- **`start(): Promise<boolean>`** — Load session data from driver (call once per request)
- **`save(lifetime?: number): Promise<void>`** — Persist session to driver (lifetime in minutes)
- **`invalidate(): Promise<boolean>`** — Destroy old session, generate new ID
- **`regenerate(destroy?: boolean): Promise<boolean>`** — Create new session ID (optionally destroy old)
- **`regenerateToken(): Promise<string>`** — Generate new session token securely

### Utility
- **`forget(key): void`** — Remove single key
- **`flush(): void`** — Clear all attributes
- **`getId(): string`** — Get current session ID
- **`setId(id): void`** — Set session ID
- **`getToken(): string`** — Get session token (64-char hex via crypto.getRandomValues)
- **`setToken(token): void`** — Set session token
- **`getName(): string`** — Get cookie name

### Flash Data (Next Request Only)
- **`flash(key, value): void`** — Store value visible only next request
- **`keep(keys?): void`** — Keep flash keys for another request
- **`reflash(): void`** — Reactivate all current flash data
- **`ageFlashData(): void`** — Mark old flash as removed (call after sending response)

## Testing

```bash
bun test packages/session/
```

Example test using MemorySessionDriver:

```typescript
import { SessionManager } from '@ninots/session';

describe('Session with Memory Driver', () => {
  it('stores and retrieves data', async () => {
    const manager = new SessionManager({ driver: 'memory', lifetime: 30 });
    const driver = manager.driver();
    const session = manager.build(driver);
    
    await session.start();
    session.put('user', { id: 1, name: 'John' });
    await session.save();
    
    expect(session.get('user')).toEqual({ id: 1, name: 'John' });
  });
});
```

## Notes

- **Lifetime in minutes**: Session constructor and `save()` accept lifetime as minutes, internally converted to milliseconds
- **Token generation**: `regenerateToken()` uses Bun native `crypto.getRandomValues()` for cryptographically secure tokens
- **Cookie name**: Default cookie name is `'ninots_session'`, customizable via config
- **Flash data**: Managed via `_flash.old` (current) and `_flash.new` (next) keys; see [docs/session-lifecycle.md](./docs/session-lifecycle.md) for details
- **Database driver setup**: Requires `SessionConnectionInterface` (SQL connection) passed to SessionManager constructor; see [docs/drivers.md](./docs/drivers.md)
- **v1.1 migration**: FileSessionDriver `destroy()` and `gc()` marked for migration from node:fs/promises to bun:sqlite

For detailed examples, see [docs/](./docs/) guides:
- [docs/drivers.md](./docs/drivers.md) — Driver selection and comparison
- [docs/session-lifecycle.md](./docs/session-lifecycle.md) — Request flow and session lifecycle
- [docs/memory-vs-file-vs-db.md](./docs/memory-vs-file-vs-db.md) — When to use each driver
