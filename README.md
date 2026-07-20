# Ninots Framework

A high-performance, Laravel-inspired backend framework built exclusively for **Bun**.

## Support matrix (official)

| Supported | Unsupported (no official support) |
|-----------|-----------------------------------|
| **Bun** (runtime + package manager) | **Node.js**, **npm** (client), **yarn**, **pnpm** |
| TypeScript sources executed by Bun | Treating Node as a supported runtime |

Distribution still uses the **npmjs.org** registry (and JSR) as the *package host*. That does **not** imply support for the npm CLI or Node.js — install, develop, test, and CI with `bun install` / `bun test` / `bun run …`.

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

- **Runtime**: Bun only (`engines.bun` ≥ 1.3.9; see Support matrix)
- **Language**: TypeScript (native execution via Bun — no Node runtime support)
- **Testing**: Bun's native test runner
- **Databases**: SQLite, PostgreSQL, MySQL (via Bun SQL)
- **Package Management**: Bun only (Catalogs + hoisted installs). Not supported: npm client, yarn, pnpm
- **Publish**: `bun publish` to the npmjs.org registry host (+ JSR)

## Package Management

Ninots uses **Bun Catalogs** to centralize dependency versions across the monorepo:

### Catalogs System

```json
{
  "workspaces": {
    "packages": ["packages/*"],
    "catalog": {
      "@types/bun": "latest",
      "typescript": "^6.0.0"
    },
    "catalogs": {
      "build": {
        "@biomejs/biome": "2.5.4",
        "typedoc": "^0.28.19"
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

## Code Standards

All code in this framework follows **STYLEGUIDE v1.0.0** and serves as the reference implementation for ninoTS.

### Before Contributing

- 📖 Read the [STYLEGUIDE](./STYLEGUIDE.md) (sections 4-6 for syntax and type rules)
- ✅ Review the [Contributor Checklist](./CONTRIBUTOR-CHECKLIST.md) before submitting PRs
- 🔍 Run `bun run check:framework:style` to verify compliance
- 🛠️ Use `bun run check:framework:style:write` to auto-fix violations

Key rules: arrow functions only, map/filter/reduce (no forEach), explicit types, 4-space indentation, 120-char lines, double quotes, kebab-case filenames.

## Contributing

Contributions are welcome! Please follow the framework's code standards (see [Code Standards](#code-standards) section above) and use the [Contributor Checklist](./CONTRIBUTOR-CHECKLIST.md) before submitting a pull request.
