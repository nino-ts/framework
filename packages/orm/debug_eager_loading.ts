import { Model } from './src/Model.ts';
import { DatabaseManager } from './src/DatabaseManager.ts';
import { Collection } from './src/Collection.ts';

class User extends Model {
    protected static override table = 'users';
    posts() {
        return this.hasMany(Post, 'user_id', 'id');
    }
}

class Post extends Model {
    protected static override table = 'posts';
    user() {
        return this.belongsTo(User, 'user_id', 'id');
    }
}

async function run() {
    const db = new DatabaseManager();
    db.addConnection('default', { driver: 'sqlite', url: ':memory:' });
    db.setDefaultConnection('default');
    Model.setConnectionResolver(db);

    const conn = db.connection();
    await conn.run('CREATE TABLE users (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT)');
    await conn.run('CREATE TABLE posts (id INTEGER PRIMARY KEY AUTOINCREMENT, user_id INTEGER, title TEXT)');
    await conn.run('INSERT INTO users (name) VALUES (?)', ['Alice']);
    await conn.run('INSERT INTO users (name) VALUES (?)', ['Bob']);
    await conn.run('INSERT INTO posts (user_id, title) VALUES (?, ?)', [1, 'Alice Post 1']);
    await conn.run('INSERT INTO posts (user_id, title) VALUES (?, ?)', [1, 'Alice Post 2']);
    await conn.run('INSERT INTO posts (user_id, title) VALUES (?, ?)', [2, 'Bob Post 1']);

    console.log('--- Eager Loading Debug ---');

    try {
        console.log('Step 1: User.with("posts")...');
        const queryBuilder = User.with('posts');
        console.log('QueryBuilder created, eagerRelations:', queryBuilder.eagerRelations);

        console.log('Step 2: Calling get()...');
        const users = await queryBuilder.get();
        console.log('Users fetched, count:', users.count());

        const alice = users.first();
        console.log('Alice:', alice?.name);
        console.log('Alice relations:', (alice as any)?.relations);
        console.log('Alice.posts:', alice?.posts);

        if (alice?.posts && alice.posts.count) {
            console.log('Alice posts count:', alice.posts.count());
            console.log('SUCCESS!');
        } else {
            console.log('FAILED: posts not loaded correctly');
        }
    } catch (e) {
        console.error('ERROR:', e);
    }

    await db.closeALl();
}

run().catch(console.error);
