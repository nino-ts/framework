# Ninots Framework

A high-performance, Laravel-inspired backend framework built exclusively for **Bun**.

## Philosophy

Ninots aims to provide the **Developer Experience (DX) of Laravel** without the bloat:

- **Bun Native First**: Optimized specifically for the Bun Runtime
- **Zero Dependencies**: If Bun can do it, we use Bun
- **Laravel-like DX**: Familiar ergonomics for Laravel developers
- **Performance**: High throughput and low memory footprint

## Packages

| Package | Description |
|---------|-------------|
| [@ninots/orm](./packages/orm) | Eloquent-inspired ORM with zero dependencies |
| @ninots/container | IoC Service Container (coming soon) |
| @ninots/routing | Express-like Router (coming soon) |
| @ninots/http | Request/Response helpers (coming soon) |

## Quick Start

### Installation

```bash
bun install
```

### Using the ORM

```typescript
import { Model, DatabaseManager, HasTimestamps, SoftDeletes } from '@ninots/orm';

// Configure database
const db = new DatabaseManager();
db.addConnection('default', { driver: 'sqlite', url: './database.db' });
Model.setConnectionResolver(db);

// Define a model
class User extends HasTimestamps(SoftDeletes(Model)) {
    protected static table = 'users';
    protected static fillable = ['name', 'email'];

    posts() {
        return this.hasMany(Post, 'user_id');
    }
}

// CRUD Operations
const user = new User({ name: 'John', email: 'john@example.com' });
await user.save();

const users = await User.query()
    .where('status', '=', 'active')
    .with('posts')
    .orderBy('created_at', 'desc')
    .paginate(10, 1);
```

## Development

### Run Tests

```bash
# Run all tests
bun test

# Run tests with Docker (PostgreSQL + MySQL)
bun run test:db
```

### Project Structure

```
framework/
├── packages/
│   └── orm/           # @ninots/orm - Eloquent-inspired ORM
├── scripts/
│   └── test-with-db.ts # Docker test runner
├── docker-compose.yml  # PostgreSQL + MySQL for testing
└── index.ts           # Main entry point
```

## Technology Stack

- **Runtime**: Bun (v1.3.9+)
- **Language**: TypeScript (native execution)
- **Testing**: Bun's native test runner
- **Databases**: SQLite, PostgreSQL, MySQL (via Bun SQL)
- **Package Management**: Bun with Catalogs + Hoisted installs

## Package Management

Ninots uses **Bun Catalogs** to centralize dependency versions across the monorepo:

### Catalogs System

```json
{
  "workspaces": {
    "packages": ["packages/*"],
    "catalog": {
      "@types/bun": "latest",
      "typescript": "^5.0.0"
    },
    "catalogs": {
      "build": {
        "@biomejs/biome": "^2.3.13",
        "typedoc": "^0.28.16"
      }
    }
  }
}
```

Packages reference catalog versions using the `catalog:` protocol:

```json
{
  "devDependencies": {
    "@types/bun": "catalog:",           // Uses default catalog
    "@biomejs/biome": "catalog:build"   // Uses named catalog
  }
}
```

### Hoisted Install Strategy

Ninots uses **hoisted installs** (`linker = "hoisted"` in `bunfig.toml`) because:
- **Zero runtime dependencies**: Only `@types/bun` and build tools
- **Simpler structure**: Single `framework/node_modules/` directory
- **No phantom dependencies risks**: All deps are cataloged and shared safely

This eliminates the complexity of isolated installs while maintaining dependency consistency across all packages.

## ORM Features

The `@ninots/orm` package provides a full-featured ORM:

- **Model**: Active Record pattern with Proxy-based attribute access
- **Relations**: HasOne, HasMany, BelongsTo, BelongsToMany
- **Query Builder**: Fluent API for building SQL queries
- **Concerns**: HasTimestamps, SoftDeletes, HasEvents, HasScopes
- **Eager Loading**: `with()` and `load()` for N+1 prevention
- **Accessors/Mutators**: Transform attributes on get/set
- **Pagination**: `paginate()` and `chunk()` for large datasets
- **Transactions**: Native Bun SQL transactions with `begin()`
- **Decorators**: Optional `@Table` and `@Column` decorators
- **Multi-Database**: SQLite, PostgreSQL, MySQL support

See [ORM Documentation](./packages/orm/README.md) for full details.

## Test Coverage

```
80 tests passing
0 failures
126 expect() calls
```

## License

MIT

## Contributing

Contributions are welcome! Please follow the project's coding standards defined in `GEMINI.md`.
