/**
 * Unit tests for dot-notation utility.
 *
 * @packageDocumentation
 */

import { describe, expect, test } from 'bun:test';
import { getNestedValue, setNestedValue, hasNestedKey, forgetNestedKey } from '@/utils/dot-notation';

describe('getNestedValue', () => {
    test('should get top-level value', () => {
        const obj = { name: 'ninots', version: '1.0.0' };

        expect(getNestedValue(obj, 'name')).toBe('ninots');
        expect(getNestedValue(obj, 'version')).toBe('1.0.0');
    });

    test('should get nested value with dot notation', () => {
        const obj = {
            app: {
                name: 'ninots',
                debug: true,
            },
        };

        expect(getNestedValue(obj, 'app.name')).toBe('ninots');
        expect(getNestedValue(obj, 'app.debug')).toBe(true);
    });

    test('should get deeply nested value', () => {
        const obj = {
            database: {
                connections: {
                    mysql: {
                        host: 'localhost',
                        port: 3306,
                    },
                },
            },
        };

        expect(getNestedValue(obj, 'database.connections.mysql.host')).toBe('localhost');
        expect(getNestedValue(obj, 'database.connections.mysql.port')).toBe(3306);
    });

    test('should return default value for missing key', () => {
        const obj = { name: 'ninots' };

        expect(getNestedValue(obj, 'missing', 'default')).toBe('default');
        expect(getNestedValue(obj, 'missing')).toBeUndefined();
    });

    test('should return default value for missing nested key', () => {
        const obj = { app: { name: 'ninots' } };

        expect(getNestedValue(obj, 'app.missing', 'default')).toBe('default');
        expect(getNestedValue(obj, 'app.name.missing', 'default')).toBe('default');
    });

    test('should handle null values', () => {
        const obj = { app: null };

        expect(getNestedValue(obj, 'app')).toBeNull();
        expect(getNestedValue(obj, 'app.name', 'default')).toBe('default');
    });

    test('should handle undefined values', () => {
        const obj = { app: undefined };

        expect(getNestedValue(obj, 'app')).toBeUndefined();
        expect(getNestedValue(obj, 'app.name', 'default')).toBe('default');
    });

    test('should handle array access', () => {
        const obj = {
            servers: ['server1', 'server2', 'server3'],
        };

        expect(getNestedValue(obj, 'servers.0')).toBe('server1');
        expect(getNestedValue(obj, 'servers.1')).toBe('server2');
    });

    test('should handle empty string key', () => {
        const obj = { name: 'ninots' };

        expect(getNestedValue(obj, '')).toBeUndefined();
    });
});

describe('setNestedValue', () => {
    test('should set top-level value', () => {
        const obj: Record<string, unknown> = {};

        setNestedValue(obj, 'name', 'ninots');

        expect(obj.name).toBe('ninots');
    });

    test('should set nested value', () => {
        const obj: Record<string, unknown> = {};

        setNestedValue(obj, 'app.name', 'ninots');

        expect((obj.app as Record<string, unknown>).name).toBe('ninots');
    });

    test('should set deeply nested value', () => {
        const obj: Record<string, unknown> = {};

        setNestedValue(obj, 'database.mysql.host', 'localhost');

        const db = obj.database as Record<string, unknown>;
        const mysql = db.mysql as Record<string, unknown>;
        expect(mysql.host).toBe('localhost');
    });

    test('should overwrite existing value', () => {
        const obj = { name: 'old' };

        setNestedValue(obj, 'name', 'new');

        expect(obj.name).toBe('new');
    });

    test('should create intermediate objects', () => {
        const obj: Record<string, unknown> = {};

        setNestedValue(obj, 'a.b.c.d', 'value');

        const a = obj.a as Record<string, unknown>;
        const b = a.b as Record<string, unknown>;
        const c = b.c as Record<string, unknown>;
        expect(c.d).toBe('value');
    });
});

describe('hasNestedKey', () => {
    test('should return true for existing top-level key', () => {
        const obj = { name: 'ninots' };

        expect(hasNestedKey(obj, 'name')).toBe(true);
    });

    test('should return true for existing nested key', () => {
        const obj = { app: { name: 'ninots' } };

        expect(hasNestedKey(obj, 'app.name')).toBe(true);
    });

    test('should return false for missing key', () => {
        const obj = { name: 'ninots' };

        expect(hasNestedKey(obj, 'missing')).toBe(false);
    });

    test('should return false for missing nested key', () => {
        const obj = { app: { name: 'ninots' } };

        expect(hasNestedKey(obj, 'app.missing')).toBe(false);
    });

    test('should return true for key with null value', () => {
        const obj = { app: null };

        expect(hasNestedKey(obj, 'app')).toBe(true);
    });

    test('should return true for key with undefined value', () => {
        const obj = { app: undefined };

        expect(hasNestedKey(obj, 'app')).toBe(true);
    });
});

describe('forgetNestedKey', () => {
    test('should remove top-level key', () => {
        const obj = { name: 'ninots', version: '1.0.0' };

        forgetNestedKey(obj, 'name');

        expect(obj.name).toBeUndefined();
        expect(obj.version).toBe('1.0.0');
    });

    test('should remove nested key', () => {
        const obj = { app: { name: 'ninots', debug: true } };

        forgetNestedKey(obj, 'app.debug');

        const app = obj.app as Record<string, unknown>;
        expect(app.debug).toBeUndefined();
        expect(app.name).toBe('ninots');
    });

    test('should do nothing for missing key', () => {
        const obj = { name: 'ninots' };

        forgetNestedKey(obj, 'missing');

        expect(obj.name).toBe('ninots');
    });

    test('should do nothing for missing nested key', () => {
        const obj = { app: { name: 'ninots' } };

        forgetNestedKey(obj, 'app.missing');

        const app = obj.app as Record<string, unknown>;
        expect(app.name).toBe('ninots');
    });
});
