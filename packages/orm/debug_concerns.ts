import { Model } from './src/Model.ts';
import { DatabaseManager } from './src/DatabaseManager.ts';
import { SoftDeletes } from './src/Concerns/SoftDeletes.ts';
import { HasTimestamps } from './src/Concerns/HasTimestamps.ts';
import { Database } from 'bun:sqlite';

class Post extends HasTimestamps(SoftDeletes(Model)) {
    protected static table = 'posts';
    protected static fillable = ['title'];
}

async function run() {
    const db = new DatabaseManager();
    db.addConnection('default', { driver: 'sqlite', url: ':memory:' });
    db.setDefaultConnection('default');
    Model.setConnectionResolver(db);

    const conn = db.connection();
    await conn.run('CREATE TABLE posts (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT, created_at TEXT, updated_at TEXT, deleted_at TEXT)');

    console.log('Creates...');
    const post = new Post({ title: 'Trash' });
    await post.save();
    console.log('Post ID:', post.id);

    console.log('Deletes...');
    await post.delete();

    console.log('Query withTrashed...');
    // @ts-ignore
    const all = await Post.withTrashed().get(); // Static method exists on mixin result
    console.log('Count:', all.count());

    if (all.count() === 1) {
        console.log('SUCCESS: Included deleted');
    } else {
        console.log('FAILURE: Count is ' + all.count());
        console.log('SQL:', Post.withTrashed().toSql());
        console.log('Default SQL:', Post.query().toSql());
    }
}

run();
