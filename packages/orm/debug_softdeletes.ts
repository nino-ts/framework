import { Model } from './src/Model.ts';
import { DatabaseManager } from './src/DatabaseManager.ts';
import { SoftDeletes } from './src/Concerns/SoftDeletes.ts';
import { HasTimestamps } from './src/Concerns/HasTimestamps.ts';

class Post extends HasTimestamps(SoftDeletes(Model)) {
    protected static override table = 'posts';
}

async function run() {
    const db = new DatabaseManager();
    db.addConnection('default', { driver: 'sqlite', url: ':memory:' });
    db.setDefaultConnection('default');
    Model.setConnectionResolver(db);

    const conn = db.connection();
    await conn.run('CREATE TABLE posts (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT, created_at TEXT, updated_at TEXT, deleted_at TEXT)');

    console.log('--- SoftDeletes Debug ---');

    // Create and save post
    const post = new Post();
    post.title = 'Test Post';
    await post.save();
    console.log('Post saved, id:', post.id);
    console.log('created_at:', post.created_at);

    // Delete (soft)
    console.log('\nDeleting post...');
    await post.delete();
    console.log('deleted_at:', post.deleted_at);

    // Check in DB
    const stored = await conn.query('SELECT * FROM posts WHERE id = ?', [post.id]);
    console.log('DB row:', stored[0]);
    console.log('deleted_at in DB:', stored[0]?.deleted_at);

    // Normal query should exclude
    console.log('\nPost.query().get()...');
    const all = await Post.query().get();
    console.log('Count (should be 0):', all.count());

    // withTrashed should include
    console.log('\nPost.withTrashed().get()...');
    try {
        const allWithTrashed = await Post.withTrashed().get();
        console.log('Count with trashed (should be 1):', allWithTrashed.count());
    } catch (e) {
        console.error('withTrashed error:', e);
    }

    await db.closeALl();
}

run().catch(console.error);
