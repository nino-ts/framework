# @ninots/orm

Eloquent-like ORM for Bun built with native features. This is a **standalone** package that can be used independently of the Ninots framework.

## Features

- 🚀 **Bun Native** - Built with Bun's SQL native features, zero external dependencies
- 📦 **Standalone** - Can be used independently without the full Ninots framework
- 🔧 **Type-Safe** - Full TypeScript support with strict typing
- 🎯 **Eloquent-like DX** - Familiar Laravel/Eloquent API
- 🔌 **Extensible** - Custom casts, relations, and query builders
- 🧪 **TDD Tested** - Comprehensive test coverage

## Installation

```bash
bun add @ninots/orm
```

## Quick Start

### Basic Setup

```typescript
import { Model, DatabaseManager, Collection } from '@ninots/orm';

// Configure database connection
const dbManager = new DatabaseManager({
  default: 'sqlite',
  connections: {
    sqlite: {
      driver: 'sqlite',
      filename: './database.sqlite',
    },
  },
});

// Set connection resolver
Model.setConnectionResolver(dbManager);

// Define your model
interface UserAttributes {
  id: number;
  name: string;
  email: string;
  active: boolean;
  created_at: Date;
}

class User extends Model<UserAttributes> {
  protected static table = 'users';

  casts() {
    return {
      active: 'boolean',
      created_at: 'date',
    };
  }
}

// Use the model
const user = await User.create({
  name: 'John Doe',
  email: 'john@example.com',
  active: true,
});

const found = await User.find(user.id);
console.log(found?.name);
```

## Model Definition

### Basic Model

```typescript
interface PostAttributes {
  id: number;
  title: string;
  content: string;
  published: boolean;
  views: number;
  created_at: Date;
  updated_at: Date;
}

class Post extends Model<PostAttributes> {
  protected static table = 'posts';
  protected static fillable = ['title', 'content', 'published'];
  
  casts() {
    return {
      published: 'boolean',
      views: 'integer',
      created_at: 'date',
      updated_at: 'date',
    };
  }
}
```

### Attribute Casting

The ORM supports various cast types out of the box:

```typescript
class Product extends Model {
  casts() {
    return {
      active: 'boolean',
      price: 'float',
      quantity: 'integer',
      metadata: 'json',
      tags: 'array',
      status: 'enum',
      published_at: 'date',
      updated_timestamp: 'timestamp',
    };
  }
}
```

### Custom Casts

```typescript
import { AttributeCaster, globalCastRegistry } from '@ninots/orm/casts';

class UppercaseCast implements AttributeCaster {
  getType() {
    return 'uppercase' as any;
  }

  get(value: unknown): unknown {
    return String(value).toUpperCase();
  }

  set(value: unknown): unknown {
    return String(value).toUpperCase();
  }
}

// Register custom caster
globalCastRegistry.register('uppercase', new UppercaseCast());
```

### Serialization

Control what gets serialized with `hidden`, `visible`, and `appends`:

```typescript
class User extends Model {
  protected static hidden = ['password', 'remember_token'];
  protected static visible = ['id', 'name', 'email'];
  protected static appends = ['full_name'];

  getFullNameAttribute(): string {
    return `${this.first_name} ${this.last_name}`;
  }
}

// Convert to object
const user = await User.find(1);
const data = user.toArray(); // Respects hidden/visible
const json = user.toJson(); // JSON string

// Modify visibility
User.makeHidden('email');
User.makeVisible('password');
```

## Query Builder

### Basic Queries

```typescript
// Get all users
const users = await User.all();

// Find by ID
const user = await User.find(1);
const userOrFail = await User.findOrFail(1);

// Query with conditions
const adults = await User.query()
  .where('age', '>', 18)
  .where('active', true)
  .orderBy('name', 'asc')
  .limit(10)
  .get();

// First result
const first = await User.query()
  .where('active', true)
  .first();
```

### Advanced Where Clauses

```typescript
// WHERE IN
const users = await User.query()
  .whereIn('status', ['active', 'pending'])
  .get();

// WHERE NOT IN
const inactive = await User.query()
  .whereNotIn('status', ['active'])
  .get();

// WHERE BETWEEN
const range = await User.query()
  .whereBetween('age', 18, 65)
  .get();

// WHERE NOT BETWEEN
const outside = await User.query()
  .whereNotBetween('age', 18, 65)
  .get();

// WHERE NULL / NOT NULL
const noEmail = await User.query()
  .whereNull('email_verified_at')
  .get();

const verified = await User.query()
  .whereNotNull('email_verified_at')
  .get();

// WHERE DATE
const today = await Post.query()
  .whereDate('created_at', '=', '2024-01-15')
  .get();

// WHERE COLUMN
const sameDate = await User.query()
  .whereColumn('created_at', '=', 'updated_at')
  .get();

// WHERE EXISTS
const withPosts = await User.query()
  .whereExists((query) => {
    query.select('id').from('posts').whereColumn('users.id', '=', 'posts.user_id');
  })
  .get();
```

### Grouping and Aggregation

```typescript
// GROUP BY
const byStatus = await User.query()
  .select('status')
  .addSelect('COUNT(*) as count')
  .groupBy('status')
  .get();

// HAVING
const popular = await Post.query()
  .select('user_id')
  .addSelect('COUNT(*) as post_count')
  .groupBy('user_id')
  .having('post_count', '>', 5)
  .get();

// DISTINCT
const unique = await User.query()
  .distinct()
  .select('status')
  .get();

// Aggregates
const count = await User.query().where('active', true).count();
const max = await User.query().max('age');
const min = await User.query().min('age');
const sum = await Order.query().sum('total');
const avg = await Order.query().avg('total');
```

### Pagination and Chunking

```typescript
// Pagination
const page1 = await User.query().paginate(15, 1);
console.log(`Page ${page1.currentPage} of ${page1.lastPage}`);
console.log(`Total: ${page1.total}`);

// Chunking
await User.query().chunk(100, async (users) => {
  await processUsers(users);
});
```

## Relationships

### One-to-One

```typescript
class User extends Model {
  profile() {
    return this.hasOne(Profile, 'user_id', 'id');
  }
}

class Profile extends Model {
  user() {
    return this.belongsTo(User, 'user_id', 'id');
  }
}

// Usage
const user = await User.find(1);
const profile = await user.profile().first();
```

### One-to-Many

```typescript
class User extends Model {
  posts() {
    return this.hasMany(Post, 'user_id', 'id');
  }
}

class Post extends Model {
  author() {
    return this.belongsTo(User, 'user_id', 'id');
  }
}

// Usage
const user = await User.find(1);
const posts = await user.posts().get();

// Eager loading
const users = await User.query()
  .with('posts')
  .get();
```

### Many-to-Many

```typescript
class User extends Model {
  roles() {
    return this.belongsToMany(Role, 'user_roles', 'user_id', 'role_id');
  }
}

class Role extends Model {
  users() {
    return this.belongsToMany(User, 'user_roles', 'role_id', 'user_id');
  }
}
```

### Polymorphic Relations

```typescript
// Image can belong to User or Post
class Image extends Model {
  imageable() {
    return this.morphTo({
      'users': User,
      'posts': Post,
    }, 'imageable_type', 'imageable_id');
  }
}

class User extends Model {
  avatar() {
    return this.morphOne(Image, 'imageable');
  }

  photos() {
    return this.morphMany(Image, 'imageable');
  }
}

class Post extends Model {
  featuredImage() {
    return this.morphOne(Image, 'imageable');
  }

  gallery() {
    return this.morphMany(Image, 'imageable');
  }
}

// Many-to-Many Polymorphic
class Post extends Model {
  tags() {
    return this.morphToMany(Tag, 'taggable');
  }
}

class Video extends Model {
  tags() {
    return this.morphToMany(Tag, 'taggable');
  }
}

class Tag extends Model {
  posts() {
    return this.morphedByMany(Post, 'taggable');
  }

  videos() {
    return this.morphedByMany(Video, 'taggable');
  }
}
```

## Collections

```typescript
const users = await User.all();

// Transform
const names = users.pluck('name');
const mapped = users.map(u => u.name.toUpperCase());

// Filter
const adults = users.filter(u => u.age >= 18);

// Sort
const sorted = users.sortBy('name');
const sortedDesc = users.sortBy('age', 'desc');

// Aggregate
const total = users.sum('balance');
const average = users.avg('age');
const max = users.max('score');
const min = users.min('score');

// Unique
const unique = users.unique('email');

// Chunk
const chunks = users.chunk(10);

// Find
const user = users.find(1);
const userOrFail = users.findOrFail(1);

// Get IDs
const ids = users.modelKeys();

// Diff and Intersect
const diff = collection1.diff(collection2, 'id');
const intersect = collection1.intersect(collection2, 'id');

// Serialize
const array = users.allSerialized();
```

## Model Methods

### CRUD Operations

```typescript
// Create
const user = await User.create({ name: 'John', email: 'john@example.com' });

// First or Create
const user = await User.firstOrCreate(
  { email: 'john@example.com' },
  { name: 'John' }
);

// Update or Create
const user = await User.updateOrCreate(
  { email: 'john@example.com' },
  { name: 'John Updated' }
);

// Save
user.name = 'Jane';
await user.save();

// Delete
await user.delete();
```

### Fresh/Refresh

```typescript
// Reload from database
await user.fresh();
await user.refresh();
```

### Dirty Checking

```typescript
user.name = 'New Name';

// Check if dirty
if (user.isDirty()) {
  console.log('Model has changes');
}

// Check specific attribute
if (user.isDirty('name')) {
  console.log('Name changed');
}

// Get dirty attributes
const changes = user.getDirty();

// Get original value
const original = user.getOriginal('name');

// Sync original
user.syncOriginal();
```

## Transactions

```typescript
import { Transaction } from '@ninots/orm';

await Transaction.create(async (trx) => {
  const user = await User.create({ name: 'John' }, trx);
  await Post.create({ user_id: user.id, title: 'Hello' }, trx);
  // Automatically commits on success
});

// Manual transaction
const trx = await Transaction.begin();
try {
  await User.create({ name: 'John' }, trx);
  await trx.commit();
} catch (e) {
  await trx.rollback();
}
```

## Events (via HasEvents concern)

```typescript
import { HasEvents } from '@ninots/orm';

class User extends Model.withEvents() {
  static boot() {
    this.onCreating((model) => {
      console.log('Creating user:', model.email);
    });

    this.onCreated((model) => {
      console.log('Created user:', model.id);
    });
  }
}
```

## Soft Deletes (via SoftDeletes concern)

```typescript
import { SoftDeletes } from '@ninots/orm';

class Post extends Model.withSoftDeletes() {
  // Automatically adds deleted_at column handling
  
  // Only get non-deleted
  const posts = await Post.all();
  
  // Include deleted
  const all = await Post.query().withTrashed().get();
  
  // Only deleted
  const onlyDeleted = await Post.query().onlyTrashed().get();
  
  // Soft delete
  await post.delete();
  
  // Restore
  await post.restore();
  
  // Force delete
  await post.forceDelete();
}
```

## Standalone Usage

This package is designed to work standalone without requiring other Ninots packages:

```typescript
// Import only what you need
import { Model } from '@ninots/orm/model';
import { Collection } from '@ninots/orm/collection';
import { QueryBuilder } from '@ninots/orm/query-builder';
import { BooleanCast, DateCast } from '@ninots/orm/casts';

// Or use the main export
import { Model, Collection, QueryBuilder } from '@ninots/orm';
```

## API Reference

### Model Static Methods

| Method | Description |
|--------|-------------|
| `query()` | Get query builder instance |
| `all()` | Get all models |
| `find(id)` | Find by primary key |
| `findOrFail(id)` | Find or throw exception |
| `create(attributes)` | Create new model |
| `firstOrCreate(attributes, values)` | Find or create |
| `updateOrCreate(attributes, values)` | Update or create |
| `with(...relations)` | Eager load relations |

### Model Instance Methods

| Method | Description |
|--------|-------------|
| `save()` | Save model to database |
| `delete()` | Delete model |
| `fresh()` | Reload from database |
| `refresh()` | Alias for fresh() |
| `isDirty(attribute?)` | Check if model changed |
| `getDirty()` | Get changed attributes |
| `getOriginal(key?)` | Get original value |
| `syncOriginal()` | Sync original attributes |
| `toArray()` | Convert to plain object |
| `toJson()` | Convert to JSON string |

### Query Builder Methods

| Method | Description |
|--------|-------------|
| `select(...columns)` | Set columns |
| `where(column, operator?, value)` | Add where clause |
| `orWhere(column, operator?, value)` | Add or where |
| `whereIn(column, values)` | Where in array |
| `whereNotIn(column, values)` | Where not in |
| `whereBetween(column, min, max)` | Where between |
| `whereNotBetween(column, min, max)` | Where not between |
| `whereNull(column)` | Where null |
| `whereNotNull(column)` | Where not null |
| `whereDate(column, operator, value)` | Where date |
| `whereColumn(first, operator, second)` | Column comparison |
| `whereExists(callback)` | Where exists subquery |
| `whereNotExists(callback)` | Where not exists |
| `groupBy(...columns)` | Group by |
| `having(column, operator?, value)` | Having clause |
| `orderBy(column, direction)` | Order by |
| `limit(value)` | Set limit |
| `offset(value)` | Set offset |
| `distinct()` | Use distinct |
| `join(table, first, operator, second)` | Join table |
| `leftJoin(...)` | Left join |
| `with(...relations)` | Eager load |
| `get()` | Execute and get results |
| `first()` | Get first result |
| `count()` | Get count |
| `sum(column)` | Get sum |
| `avg(column)` | Get average |
| `min(column)` | Get minimum |
| `max(column)` | Get maximum |
| `exists()` | Check if exists |
| `insert(values)` | Insert record |
| `update(values)` | Update records |
| `delete()` | Delete records |
| `paginate(perPage, page)` | Paginate results |
| `chunk(size, callback)` | Process in chunks |

## License

MIT License - See [LICENSE](LICENSE) for details.
