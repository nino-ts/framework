# @ninots/orm

A lightweight, Laravel Eloquent-inspired ORM for Bun with zero dependencies.

## Features

- **Bun Native**: Uses Bun SQL API for SQLite, PostgreSQL, and MySQL
- **Zero Dependencies**: Only relies on Bun's native capabilities
- **Laravel-like DX**: Familiar API for Eloquent/Laravel developers
- **TypeScript First**: Full type safety with TypeScript 5.x features
- **TDD Tested**: 63+ tests covering all functionality

## Installation

```bash
bun add @ninots/orm
```

## Quick Start

```typescript
import { Model, DatabaseManager } from '@ninots/orm';

// Configure database
const db = new DatabaseManager();
db.addConnection('default', { driver: 'sqlite', url: './database.db' });
db.setDefaultConnection('default');
Model.setConnectionResolver(db);

// Define a model
class User extends Model {
    protected static table = 'users';
    protected static fillable = ['name', 'email'];

    posts() {
        return this.hasMany(Post, 'user_id');
    }
}

// Use it!
const user = new User({ name: 'John', email: 'john@example.com' });
await user.save();

const users = await User.query().where('status', '=', 'active').get();
```

## Model Definition

### Basic Model

```typescript
class Post extends Model {
    protected static table = 'posts';
    protected static primaryKey = 'id';
    protected static fillable = ['title', 'content'];
}
```

### With Decorators (Optional)

```typescript
import { Model, Table, Column } from '@ninots/orm';

@Table('users')
class User extends Model {
    @Column('full_name')
    name: string;
}
```

### With Mixins

```typescript
import { Model, SoftDeletes, HasTimestamps } from '@ninots/orm';

class Post extends HasTimestamps(SoftDeletes(Model)) {
    protected static table = 'posts';
}
```

## Relations

### HasOne

```typescript
class User extends Model {
    profile() {
        return this.hasOne(Profile, 'user_id');
    }
}

const profile = await user.profile().first();
```

### HasMany

```typescript
class User extends Model {
    posts() {
        return this.hasMany(Post, 'user_id');
    }
}

const posts = await user.posts().get();
```

### BelongsTo

```typescript
class Post extends Model {
    user() {
        return this.belongsTo(User, 'user_id');
    }
}

const author = await post.user().first();
```

### BelongsToMany

```typescript
class User extends Model {
    roles() {
        return this.belongsToMany(Role, 'user_roles', 'user_id', 'role_id');
    }
}

const roles = await user.roles().get();
```

## Eager Loading

```typescript
// Load relations with the query
const users = await User.with('posts').get();

// Lazy load on existing collection
const users = await User.all();
await users.load('posts');
```

## Accessors & Mutators

```typescript
class User extends Model {
    // Accessor: user.full_name
    getFullNameAttribute(): string {
        return `${this.first_name} ${this.last_name}`;
    }

    // Mutator: user.password = 'secret'
    setPasswordAttribute(value: string): void {
        this.attributes['password'] = hash(value);
    }
}
```

## Transactions

```typescript
import { Transaction } from '@ninots/orm';

const conn = db.connection();
const tx = await Transaction.begin(conn);

try {
    await user.decrement('balance', 100);
    await recipient.increment('balance', 100);
    await tx.commit();
} catch (error) {
    await tx.rollback();
}
```

### With Disposable (TypeScript 5.2+)

```typescript
{
    using tx = await Transaction.begin(conn);
    await doSomeWork();
    await tx.commit();
    // Auto-rollback if not committed when leaving scope
}
```

## Soft Deletes

```typescript
class Post extends SoftDeletes(Model) {
    protected static table = 'posts';
}

await post.delete();           // Soft delete (sets deleted_at)
await Post.query().get();      // Excludes deleted
await Post.withTrashed().get(); // Includes deleted
```

## Query Builder

```typescript
const users = await User.query()
    .select('id', 'name', 'email')
    .where('status', '=', 'active')
    .where('age', '>', 18)
    .orderBy('created_at', 'desc')
    .limit(10)
    .get();
```

## Collection Methods

```typescript
const users = await User.all();

users.count();           // Number of items
users.first();           // First item
users.last();            // Last item
users.pluck('name');     // Extract column values
users.sum('balance');    // Sum of column
users.map(u => u.name);  // Transform items
users.filter(u => u.active); // Filter items
```

## License

MIT
