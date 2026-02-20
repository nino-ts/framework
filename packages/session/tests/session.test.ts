import { beforeEach, describe, expect, it } from 'bun:test';
import type { Session } from '../src/session.ts';
import { SessionManager } from '../src/session-manager.ts';

describe('Session', () => {
  let manager: SessionManager;
  let session: Session;

  beforeEach(() => {
    manager = new SessionManager({
      driver: 'memory',
      lifetime: 60,
    });
    session = manager.build(manager.driver());
  });

  it('can store and retrieve data', () => {
    session.put('key', 'value');
    expect(session.get<string>('key')).toBe('value');
  });

  it('can forget data', () => {
    session.put('key', 'value');
    session.forget('key');
    expect(session.has('key')).toBe(false);
  });

  it('can flush data', () => {
    session.put('key', 'value');
    session.flush();
    expect(session.all()).toEqual({});
  });

  it('persists to driver on save', async () => {
    session.put('foo', 'bar');
    await session.save();

    // New session with same ID should load data
    const session2 = manager.build(manager.driver(), session.getId());
    await session2.start();
    expect(session2.get<string>('foo')).toBe('bar');
  });

  it('has a token', () => {
    const token = session.getToken();
    expect(token).toBeTruthy();
    expect(typeof token).toBe('string');
    expect(token.length).toBeGreaterThan(0);
  });

  it('can set and get token', () => {
    const newToken = 'custom-token-123';
    session.setToken(newToken);
    expect(session.getToken()).toBe(newToken);
  });

  it('regenerateToken returns a new token', async () => {
    const oldToken = session.getToken();
    const newToken = await session.regenerateToken();

    expect(newToken).toBeTruthy();
    expect(typeof newToken).toBe('string');
    expect(newToken).not.toBe(oldToken);
    expect(session.getToken()).toBe(newToken);
  });

  it('regenerateToken returns different tokens on multiple calls', async () => {
    const token1 = await session.regenerateToken();
    const token2 = await session.regenerateToken();
    const token3 = await session.regenerateToken();

    expect(token1).not.toBe(token2);
    expect(token2).not.toBe(token3);
    expect(token1).not.toBe(token3);
  });

  it('regenerateToken persists new token to driver', async () => {
    session.put('user_id', 123);
    const newToken = await session.regenerateToken();

    // Verify token was persisted
    expect(session.getToken()).toBe(newToken);
    expect(session.get<number>('user_id')).toBe(123);
  });

  it('getId() returns session ID', () => {
    const id = session.getId();
    expect(typeof id).toBe('string');
    expect(id.length).toBeGreaterThan(0);
  });

  it('setId() changes the session ID', () => {
    const newId = 'custom-id-123';
    session.setId(newId);
    expect(session.getId()).toBe(newId);
  });

  it('getName() returns session name', () => {
    expect(session.getName()).toBe('ninots_session');
  });

  it('invalidate() destroys and regenerates ID', async () => {
    const oldId = session.getId();
    session.put('data', 'value');

    const result = await session.invalidate();
    expect(result).toBe(true);
    expect(session.getId()).not.toBe(oldId);
  });

  it('regenerate() generates new ID without destroying', async () => {
    const oldId = session.getId();
    const result = await session.regenerate();
    expect(result).toBe(true);
    expect(session.getId()).not.toBe(oldId);
  });

  it('regenerate() with destroy=true destroys old session', async () => {
    session.put('data', 'value');
    await session.save();
    const oldId = session.getId();

    const result = await session.regenerate(true);
    expect(result).toBe(true);
    expect(session.getId()).not.toBe(oldId);
  });

  it('flash() stores data and marks as new flash', () => {
    session.flash('message', 'Hello!');
    expect(session.get('message')).toBe('Hello!');
    expect(session.get<string[]>('_flash.new', [])).toContain('message');
  });

  it('reflash() moves old flash to new', () => {
    session.put('_flash.old', ['key1', 'key2']);
    session.reflash();
    expect(session.get<string[]>('_flash.new', [])).toEqual(['key1', 'key2']);
    expect(session.get<string[]>('_flash.old', [])).toEqual([]);
  });

  it('keep() keeps specific flash keys', () => {
    session.put('_flash.old', ['msg1', 'msg2', 'msg3']);
    session.keep(['msg1', 'msg3']);
    const newFlash = session.get<string[]>('_flash.new', []);
    expect(newFlash).toContain('msg1');
    expect(newFlash).toContain('msg3');
  });

  it('ageFlashData() removes old flash and ages new to old', () => {
    session.put('old_msg', 'old value');
    session.put('_flash.old', ['old_msg']);
    session.put('_flash.new', ['new_msg']);

    session.ageFlashData();

    expect(session.has('old_msg')).toBe(false);
    expect(session.get<string[]>('_flash.old', [])).toEqual(['new_msg']);
    expect(session.get<string[]>('_flash.new', [])).toEqual([]);
  });
});

describe('SessionManager', () => {
  it('creates memory driver', () => {
    const manager = new SessionManager({ driver: 'memory', lifetime: 60 });
    const driver = manager.driver();
    expect(driver).toBeDefined();
  });

  it('caches driver instances', () => {
    const manager = new SessionManager({ driver: 'memory', lifetime: 60 });
    const d1 = manager.driver();
    const d2 = manager.driver();
    expect(d1).toBe(d2);
  });

  it('creates file driver', () => {
    const manager = new SessionManager({
      driver: 'file',
      files: './tmp-test-sessions',
      lifetime: 60,
    });
    const driver = manager.driver('file');
    expect(driver).toBeDefined();
  });

  it('throws for unsupported driver', () => {
    const manager = new SessionManager({ driver: 'redis' as 'memory', lifetime: 60 });
    expect(() => manager.driver()).toThrow('Session driver [redis] is not supported.');
  });

  it('throws for database driver without connection', () => {
    const manager = new SessionManager({ driver: 'database', lifetime: 60 });
    expect(() => manager.driver()).toThrow('Database session driver requires a connection');
  });

  it('build() creates Session instance', () => {
    const manager = new SessionManager({ driver: 'memory', lifetime: 60 });
    const session = manager.build(manager.driver());
    expect(session).toBeDefined();
    expect(session.getName()).toBe('ninots_session');
  });

  it('build() accepts custom id and token', () => {
    const manager = new SessionManager({ driver: 'memory', lifetime: 60 });
    const session = manager.build(manager.driver(), 'custom-id', 'custom-token');
    expect(session.getId()).toBe('custom-id');
    expect(session.getToken()).toBe('custom-token');
  });
});
