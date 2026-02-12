# @ninots/http

HTTP Request and Response helpers for Bun.

## Package Overview

| Aspect | Details |
|--------|---------|
| **Purpose** | Helper functions for native Request/Response objects |
| **Laravel Ref** | [requests.md](file:///d:/pandowlabs/ninots/laravel-docs/requests.md), [responses.md](file:///d:/pandowlabs/ninots/laravel-docs/responses.md) |
| **Dependencies** | None (Bun native only) |

## API

```typescript
import { ResponseHelpers, RequestHelpers } from '@ninots/http';

// Response helpers
ResponseHelpers.json({ user: 'John' });
ResponseHelpers.json({ error: 'Not found' }, 404);
ResponseHelpers.redirect('/login');
ResponseHelpers.redirect('/dashboard', 301);
ResponseHelpers.html('<h1>Hello</h1>');
ResponseHelpers.text('Plain text');
ResponseHelpers.file(Bun.file('./doc.pdf'));
ResponseHelpers.notFound('Resource not found');

// Request helpers
const name = RequestHelpers.input(request, 'name');
const page = RequestHelpers.query(request, 'page', '1');
const token = RequestHelpers.header(request, 'Authorization');
const body = await RequestHelpers.json(request);
const isPost = RequestHelpers.isMethod(request, 'POST');
```

## Code Style

- **TSDoc**: Document ALL functions
- **Path Aliases**: Use `@/*` for `./src/*`
- **Types**: Use generics for type-safe returns

## Testing

```bash
bun test           # Run all tests
bun test unit/     # Run unit tests only
```

### Test Structure

```
tests/
├── setup.ts
├── unit/
│   ├── ResponseHelpers.test.ts
│   └── RequestHelpers.test.ts
└── feature/
```
