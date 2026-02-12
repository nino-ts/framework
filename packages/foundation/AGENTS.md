# @ninots/foundation

Application Foundation for Bun.

## Package Overview

| Aspect | Details |
|--------|---------|
| **Purpose** | Bootstrap and run the application |
| **Laravel Ref** | [lifecycle.md](file:///d:/pandowlabs/ninots/laravel-docs/lifecycle.md) |
| **Dependencies** | None (Bun native only) |

## API

```typescript
import { Application, createApp } from '@ninots/foundation';

// Quick start
const app = createApp({ port: 3000 });
app.start();

// Full control
const app = new Application({
  port: 3000,
  hostname: 'localhost',
});

// Register service providers
app.register(new AppServiceProvider(app.container));

// Boot providers and start server
await app.boot();
await app.start();

// Graceful shutdown
await app.stop();
```

## Lifecycle

1. **Create** - `new Application(config)` or `createApp(config)`
2. **Register** - `app.register(provider)` - register all service providers
3. **Boot** - `app.boot()` - boot all registered providers
4. **Start** - `app.start()` - start the HTTP server with Bun.serve
5. **Handle** - Process incoming requests through router/middleware
6. **Stop** - `app.stop()` - graceful shutdown

## Code Style

- **TSDoc**: Document ALL functions
- **Path Aliases**: Use `@/*` for `./src/*`
- **Types**: Type-safe configuration

## Testing

```bash
bun test           # Run all tests
bun test unit/     # Run unit tests only
```
