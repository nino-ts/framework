# @ninots/routing

HTTP Router with fluent API for Bun.

## Package Overview

| Aspect | Details |
|--------|---------|
| **Purpose** | Route HTTP requests to handlers |
| **Laravel Ref** | [routing.md](file:///d:/pandowlabs/ninots/laravel-docs/routing.md) |
| **Dependencies** | None (Bun native only) |

## API

```typescript
import { Router } from '@ninots/routing';

const router = new Router();

// HTTP methods
router.get('/users', handler);
router.post('/users', handler);
router.put('/users/:id', handler);
router.delete('/users/:id', handler);
router.patch('/users/:id', handler);

// Named routes
router.get('/login', handler).name('auth.login');

// Route groups
router.group({ prefix: '/api', middleware: ['auth'] }, () => {
  router.get('/profile', handler);
});

// Route parameters
router.get('/users/:id/posts/:postId', (req, params) => {
  // params.id, params.postId
});

// Match request
const { handler, params } = router.match('GET', '/users/123');
```

## Code Style

- **TSDoc**: Document ALL functions
- **Path Aliases**: Use `@/*` for `./src/*`
- **Types**: Generic params for type-safe routes

## Testing

```bash
bun test           # Run all tests
bun test unit/     # Run unit tests only
```
