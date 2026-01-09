import { beforeAll, afterAll, beforeEach, mock } from 'bun:test';
import { Database } from 'bun:sqlite';

// Conexão SQLite in-memory para testes usando bun:sqlite nativo
// Nota: Bun.SQL não expõe 'SQL' diretamente instanciável para :memory: da mesma forma que o driver nativo sqlite
// Vamos usar o bun:sqlite para testes unitários isolados onde precisamos de um DB em memória rápido
let testDb: Database;

beforeAll(() => {
  testDb = new Database(':memory:');
  testDb.run('CREATE TABLE users (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, email TEXT, created_at TEXT, updated_at TEXT, deleted_at TEXT)');
  testDb.run('CREATE TABLE posts (id INTEGER PRIMARY KEY AUTOINCREMENT, user_id INTEGER, title TEXT, content TEXT, created_at TEXT, updated_at TEXT)');
});

afterAll(() => {
  testDb.close();
});

beforeEach(() => {
  mock.restore();
  // Limpar tabelas
  testDb.run('DELETE FROM users');
  testDb.run('DELETE FROM posts');
  // Resetar autoincrement
  testDb.run('DELETE FROM sqlite_sequence WHERE name="users" OR name="posts"');
});

export { testDb };
