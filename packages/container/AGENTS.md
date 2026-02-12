# @ninots/container

IoC Container with dependency injection for Bun.

## Package Overview

| Aspect | Details |
|--------|---------|
| **Purpose** | Inversion of Control container for dependency injection |
| **Laravel Ref** | [container.md](file:///d:/pandowlabs/ninots/laravel-docs/container.md) |
| **Dependencies** | None (Bun native only) |

## API

```typescript
import { Container, ServiceProvider } from '@ninots/container';

// Basic binding
container.bind<Logger>('logger', () => new ConsoleLogger());

// Singleton (resolved once)
container.singleton<Database>('db', () => new PostgresDB());

// Resolve
const logger = container.make<Logger>('logger');

// Check if bound
container.bound('logger'); // true

// Conditional binding
container.bindIf('logger', () => new FileLogger());
```

## Code Style

- **TSDoc**: Document ALL functions and classes
- **Path Aliases**: Use `@/*` for `./src/*`
- **Types**: Explicit types, avoid implicit any

## Testing

```bash
bun test           # Run all tests
bun test unit/     # Run unit tests only
bun test feature/  # Run feature tests only
```

### Test Structure

```
tests/
├── setup.ts           # Helpers and custom expectations
├── unit/              # Pure unit tests (no I/O)
│   └── Container.test.ts
└── feature/           # Integration tests
    └── ServiceProvider.test.ts
```
