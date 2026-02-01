# @ninots/middleware

Middleware Pipeline for Bun.

## Package Overview

| Aspect | Details |
|--------|---------|
| **Purpose** | Process requests through a chain of middleware |
| **Laravel Ref** | [middleware.md](file:///d:/pandowlabs/ninots/laravel-docs/middleware.md) |
| **Dependencies** | None (Bun native only) |

## API

```typescript
import { Pipeline, Middleware, MiddlewareStack } from '@ninots/middleware';

// Define middleware
const authMiddleware: Middleware = async (request, next) => {
  const token = request.headers.get('Authorization');
  if (!token) {
    return new Response('Unauthorized', { status: 401 });
  }
  return next(request);
};

const logMiddleware: Middleware = async (request, next) => {
  console.log(`${request.method} ${request.url}`);
  return next(request);
};

// Create pipeline
const pipeline = new Pipeline();
const response = await pipeline
  .pipe(logMiddleware)
  .pipe(authMiddleware)
  .then((request) => new Response('OK'))
  .handle(request);

// Middleware Stack
const stack = new MiddlewareStack();
stack.add('auth', authMiddleware);
stack.add('log', logMiddleware);

const middleware = stack.resolve(['log', 'auth']);
```

## Code Style

- **TSDoc**: Document ALL functions
- **Path Aliases**: Use `@/*` for `./src/*`
- **Types**: Type-safe middleware chain

## Testing

```bash
bun test           # Run all tests
bun test unit/     # Run unit tests only
```
