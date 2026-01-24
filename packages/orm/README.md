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
users.avg('age');        // Average of column
users.min('age');        // Minimum value
users.max('age');        // Maximum value
users.map(u => u.name);  // Transform items
users.filter(u => u.active); // Filter items
users.unique('status');  // Remove duplicates
users.isEmpty();         // Check if empty
users.isNotEmpty();      // Check if not empty
```

## Model Events

```typescript
import { Model, HasEvents } from '@ninots/orm';

class User extends HasEvents(Model) {
    protected static table = 'users';
}

// Listen to events
User.addEventListener('creating', (model) => {
    console.log('Creating user:', model.name);
});

User.addEventListener('created', (model) => {
    console.log('User created with id:', model.id);
});

User.addEventListener('updating', (model) => {
    console.log('Updating user:', model.id);
});

User.addEventListener('updated', (model) => {
    console.log('User updated:', model.id);
});

// Cancel save by returning false
User.addEventListener('creating', (model) => {
    if (!model.email) {
        return false; // Cancels the save
    }
});
```

## Local Scopes

```typescript
import { Model, HasScopes } from '@ninots/orm';
import { QueryBuilder } from '@ninots/orm';

class User extends HasScopes(Model) {
    protected static table = 'users';
    
    // Define scopes with scope{Name} convention
    static scopeActive(query: QueryBuilder) {
        return query.where('active', '=', true);
    }
    
    static scopeOlderThan(query: QueryBuilder, age: number) {
        return query.where('age', '>', age);
    }
}

// Use scopes
const activeUsers = await User.scope('active').get();
const adults = await User.scope('olderThan', 18).get();

// Chain with other query methods
const activeAdults = await User.scope('active').where('age', '>', 21).get();
```

## Pagination

```typescript
// Paginate results (perPage, page)
const result = await User.query().paginate(10, 1);

console.log(result.data);        // Collection of users
console.log(result.currentPage); // 1
console.log(result.perPage);     // 10
console.log(result.total);       // Total count
console.log(result.lastPage);    // Last page number

// Process in chunks
await User.query().chunk(100, async (users) => {
    for (const user of users.all()) {
        await processUser(user);
    }
});

// Get count
const count = await User.query().where('active', '=', true).count();
```

## Native Transactions (Bun SQL)

For PostgreSQL and MySQL, use the native `begin()` method:

```typescript
const conn = db.connection();

// Using native Bun SQL transactions
await conn.begin(async (tx) => {
    await tx`INSERT INTO users (name) VALUES (${'Alice'})`;
    await tx`UPDATE accounts SET balance = balance - 100 WHERE user_id = 1`;
    // Auto-commits on success, auto-rollbacks on error
});

// With error handling
try {
    await conn.begin(async (tx) => {
        await tx`UPDATE accounts SET balance = balance - 100 WHERE user_id = 1`;
        await tx`UPDATE accounts SET balance = balance + 100 WHERE user_id = 2`;
        
        if (someCondition) {
            throw new Error('Rollback!');
        }
    });
} catch (error) {
    console.log('Transaction rolled back');
}
```

## Database Drivers

### SQLite (Default)

```typescript
db.addConnection('default', {
    driver: 'sqlite',
    url: './database.db'  // or ':memory:' for in-memory
});
```

### PostgreSQL

```typescript
db.addConnection('postgres', {
    driver: 'postgres',
    url: 'postgres://user:pass@localhost:5432/mydb'
});
```

### MySQL/MariaDB

```typescript
db.addConnection('mysql', {
    driver: 'mysql',
    url: 'mysql://user:pass@localhost:3306/mydb'
});
```

## Complete Example

```typescript
import { 
    Model, 
    DatabaseManager, 
    HasTimestamps, 
    SoftDeletes, 
    HasEvents,
    HasScopes 
} from '@ninots/orm';

// Setup
const db = new DatabaseManager();
db.addConnection('default', { driver: 'sqlite', url: ':memory:' });
Model.setConnectionResolver(db);

// Full-featured Model
class User extends HasEvents(HasScopes(HasTimestamps(SoftDeletes(Model)))) {
    protected static table = 'users';
    protected static fillable = ['name', 'email', 'age'];

    // Relations
    posts() { return this.hasMany(Post, 'user_id'); }
    profile() { return this.hasOne(Profile, 'user_id'); }
    
    // Accessors
    getFullNameAttribute() {
        return `${this.first_name} ${this.last_name}`;
    }
    
    // Scopes
    static scopeActive(query) { return query.where('active', '=', true); }
    static scopeAdults(query) { return query.where('age', '>=', 18); }
}

// Events
User.addEventListener('creating', () => console.log('Creating user...'));
User.addEventListener('created', (user) => console.log(`Created user: ${user.id}`));

// Usage
const user = new User({ name: 'John', email: 'john@example.com', age: 25 });
await user.save();

// Query with scope and eager loading
const activeAdults = await User.scope('active')
    .where('age', '>=', 21)
    .with('posts', 'profile')
    .orderBy('created_at', 'desc')
    .paginate(10, 1);

// Soft delete
await user.delete();

// Restore
await user.restore();
```

## API Reference

### Model Static Methods

| Method | Description |
|--------|-------------|
| `query()` | Get a new QueryBuilder instance |
| `all()` | Get all records |
| `with(...relations)` | Eager load relations |
| `scope(name, ...args)` | Apply a local scope |

### Model Instance Methods

| Method | Description |
|--------|-------------|
| `save()` | Insert or update the model |
| `delete()` | Delete (or soft delete) the model |
| `restore()` | Restore a soft-deleted model |
| `fill(attributes)` | Fill model with attributes |

### QueryBuilder Methods

| Method | Description |
|--------|-------------|
| `select(...columns)` | Select specific columns |
| `where(col, op, val)` | Add WHERE clause |
| `orWhere(col, op, val)` | Add OR WHERE clause |
| `whereNull(col)` | WHERE column IS NULL |
| `whereIn(col, values)` | WHERE column IN values |
| `orderBy(col, dir)` | Order results |
| `limit(n)` | Limit results |
| `offset(n)` | Offset results |
| `join(...)` | Add JOIN clause |
| `get()` | Execute and get Collection |
| `first()` | Get first result |
| `count()` | Get count of results |
| `paginate(perPage, page)` | Paginate results |
| `chunk(size, callback)` | Process in chunks |
| `insert(data)` | Insert data |
| `update(data)` | Update data |
| `delete()` | Delete records |

## License

MIT
