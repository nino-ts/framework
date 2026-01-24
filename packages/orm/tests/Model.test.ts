import { describe, test, expect, beforeEach, afterEach, beforeAll } from 'bun:test';
import { Model } from '@/model';
import { DatabaseManager } from '@/database-manager';

class User extends Model {
    protected static table = 'users';
    protected static fillable = ['name', 'email'];
}

describe('Model', () => {
    let db: DatabaseManager;

    beforeEach(async () => {
        db = new DatabaseManager();
        db.addConnection('default', { driver: 'sqlite', url: ':memory:' });
        db.setDefaultConnection('default');

        Model.setConnectionResolver(db);

        // Criar tabela para testes
        const conn = db.connection();
        await conn.run('CREATE TABLE users (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, email TEXT, created_at TEXT, updated_at TEXT)');
    });

    afterEach(async () => {
        await db.closeALl();
    });

    test('should have default table name based on class name', () => {
        class BlogPost extends Model { }
        expect(BlogPost.getTable()).toBe('blog_posts');
    });

    test('should use custom table name', () => {
        expect(User.getTable()).toBe('users');
    });

    test('should create new instance with attributes', () => {
        const user = new User({ name: 'John' });
        expect(user.getAttribute('name')).toBe('John');
        expect(user.name).toBe('John'); // Proxy access
    });

    test('save() should insert record', async () => {
        const user = new User({ name: 'John', email: 'john@example.com' });
        await user.save();

        expect(user.id).toBeDefined();

        const stored = await db.connection().query('SELECT * FROM users WHERE id = ?', [user.id]);
        expect(stored[0].name).toBe('John');
    });
});
