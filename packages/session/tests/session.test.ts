import { beforeEach, describe, expect, it } from 'bun:test';
import type { Session } from '../src/session';
import { SessionManager } from '../src/session-manager';

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
});
