import { CookieDriver } from '../../src/drivers/cookie-driver';
import { describe, expect, test } from 'bun:test';

describe('CookieDriver', () => {
    test('should return null for read (placeholder)', async () => {
        const driver = new CookieDriver();
        const result = await driver.read('any-id');
        expect(result).toBeNull();
    });

    test('should validate cookie size', async () => {
        const driver = new CookieDriver();
        const smallData = { user: 'test' };
        const result = await driver.write('any-id', smallData);
        expect(result).toBe(true);
    });

    test('should reject oversized data', async () => {
        const driver = new CookieDriver();
        const largeData = { data: 'x'.repeat(5000) };
        const result = await driver.write('any-id', largeData);
        expect(result).toBe(false);
    });

    test('should always return true for destroy', async () => {
        const driver = new CookieDriver();
        const result = await driver.destroy('any-id');
        expect(result).toBe(true);
    });

    test('should always return true for exists', async () => {
        const driver = new CookieDriver();
        const result = await driver.exists('any-id');
        expect(result).toBe(true);
    });

    test('should serialize to cookie string', () => {
        const driver = new CookieDriver();
        const result = driver.toCookieString(
            { user: 'test' },
            {
                name: 'session',
                maxAge: 7200,
                path: '/',
                secure: true,
                httpOnly: true,
                sameSite: 'lax',
            }
        );

        expect(result).toContain('session=');
        expect(result).toContain('Max-Age=7200');
        expect(result).toContain('Path=/');
        expect(result).toContain('Secure');
        expect(result).toContain('HttpOnly');
        expect(result).toContain('SameSite=lax');
    });
});
