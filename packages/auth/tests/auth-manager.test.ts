import { beforeEach, describe, expect, it } from 'bun:test';
import { AuthManager, type GuardFactory } from '../src/auth-manager';
import type { Authenticatable } from '../src/contracts/authenticatable';
import type { Guard } from '../src/contracts/guard';

function createMockGuard(isAuthenticated: boolean = false): Guard {
    const mockUser: Authenticatable | null = isAuthenticated
        ? {
              getAuthIdentifier: () => 1,
              getAuthIdentifierName: () => 'id',
              getAuthPassword: () => 'hashed',
              getAuthPasswordName: () => 'password',
              getRememberToken: () => null,
              getRememberTokenName: () => 'remember_token',
              setRememberToken: () => {},
          }
        : null;

    return {
        async check(): Promise<boolean> {
            return isAuthenticated;
        },
        async guest(): Promise<boolean> {
            return !isAuthenticated;
        },
        async id(): Promise<string | number | null> {
            return mockUser ? mockUser.getAuthIdentifier() : null;
        },
        async user(): Promise<Authenticatable | null> {
            return mockUser;
        },
        async validate(): Promise<boolean> {
            return isAuthenticated;
        },
    };
}

describe('AuthManager', () => {
    let manager: AuthManager;
    let webGuardFactory: GuardFactory;

    beforeEach(() => {
        webGuardFactory = (_name: string, _config: Record<string, unknown>) => createMockGuard(true);

        manager = new AuthManager({
            defaults: { guard: 'web' },
            guards: {
                api: { driver: 'token', provider: 'users' },
                web: { driver: 'session', provider: 'users' },
            },
        });

        manager.extend('session', webGuardFactory);
        manager.extend('token', (_name, _config) => createMockGuard(false));
    });

    it('resolves the default guard', () => {
        const guard = manager.guard();
        expect(guard).toBeDefined();
    });

    it('resolves a named guard', () => {
        const guard = manager.guard('api');
        expect(guard).toBeDefined();
    });

    it('caches resolved guards', () => {
        const first = manager.guard('web');
        const second = manager.guard('web');
        expect(first).toBe(second);
    });

    it('throws for undefined guard name', () => {
        expect(() => manager.guard('unknown')).toThrow('Auth guard [unknown] is not defined.');
    });

    it('throws for unregistered driver', () => {
        const m = new AuthManager({
            defaults: { guard: 'custom' },
            guards: {
                custom: { driver: 'my-driver', provider: 'users' },
            },
        });

        expect(() => m.guard('custom')).toThrow('Auth driver [my-driver] is not defined.');
    });

    it('extend registers custom driver factory', () => {
        const customGuard = createMockGuard(true);
        manager.extend('custom-driver', () => customGuard);

        const m = new AuthManager({
            defaults: { guard: 'custom' },
            guards: {
                custom: { driver: 'custom-driver', provider: 'users' },
            },
        });
        m.extend('custom-driver', () => customGuard);

        expect(m.guard('custom')).toBe(customGuard);
    });

    it('check delegates to default guard', async () => {
        expect(await manager.check()).toBe(true);
    });

    it('user delegates to default guard', async () => {
        const user = await manager.user();
        expect(user).not.toBeNull();
        expect(user.getAuthIdentifier()).toBe(1);
    });

    it('id delegates to default guard', async () => {
        expect(await manager.id()).toBe(1);
    });

    it('api guard returns unauthenticated', async () => {
        const apiGuard = manager.guard('api');
        expect(await apiGuard.check()).toBe(false);
        expect(await apiGuard.guest()).toBe(true);
    });
});
