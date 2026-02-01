/**
 * Unit tests for Container.
 *
 * @packageDocumentation
 */

import { describe, test, expect } from 'bun:test';
import { Container, BindingNotFoundException } from '@/container';
import { createTestContainer } from '@/tests/setup';

describe('Container', () => {
    describe('bind()', () => {
        test('should register a binding', () => {
            const container = createTestContainer();

            container.bind('service', () => ({ name: 'test' }));

            expect(container.bound('service')).toBe(true);
        });

        test('should create new instance on each resolve', () => {
            const container = createTestContainer();

            container.bind('service', () => ({ id: Math.random() }));

            const first = container.make<{ id: number }>('service');
            const second = container.make<{ id: number }>('service');

            expect(first.id).not.toBe(second.id);
        });
    });

    describe('singleton()', () => {
        test('should register a singleton binding', () => {
            const container = createTestContainer();

            container.singleton('service', () => ({ id: Math.random() }));

            expect(container.bound('service')).toBe(true);
        });

        test('should return same instance on each resolve', () => {
            const container = createTestContainer();

            container.singleton('service', () => ({ id: Math.random() }));

            const first = container.make<{ id: number }>('service');
            const second = container.make<{ id: number }>('service');

            expect(first.id).toBe(second.id);
            expect(first).toBe(second);
        });

        test('should only call factory once', () => {
            const container = createTestContainer();
            let callCount = 0;

            container.singleton('service', () => {
                callCount++;
                return { count: callCount };
            });

            container.make('service');
            container.make('service');
            container.make('service');

            expect(callCount).toBe(1);
        });
    });

    describe('make()', () => {
        test('should resolve a binding', () => {
            const container = createTestContainer();
            const expected = { name: 'test-service' };

            container.bind('service', () => expected);

            const result = container.make<typeof expected>('service');

            expect(result).toEqual(expected);
        });

        test('should throw BindingNotFoundException for unknown binding', () => {
            const container = createTestContainer();

            expect(() => container.make('unknown')).toThrow(BindingNotFoundException);
        });

        test('should pass container to factory', () => {
            const container = createTestContainer();

            container.bind('config', () => ({ debug: true }));
            container.bind('logger', (c) => ({
                config: c.make<{ debug: boolean }>('config'),
            }));

            const logger = container.make<{ config: { debug: boolean } }>('logger');

            expect(logger.config.debug).toBe(true);
        });
    });

    describe('bindIf()', () => {
        test('should bind if not already bound', () => {
            const container = createTestContainer();

            container.bindIf('service', () => ({ version: 1 }));

            expect(container.make<{ version: number }>('service').version).toBe(1);
        });

        test('should not override existing binding', () => {
            const container = createTestContainer();

            container.bind('service', () => ({ version: 1 }));
            container.bindIf('service', () => ({ version: 2 }));

            expect(container.make<{ version: number }>('service').version).toBe(1);
        });
    });

    describe('singletonIf()', () => {
        test('should bind singleton if not already bound', () => {
            const container = createTestContainer();

            container.singletonIf('service', () => ({ id: Math.random() }));

            const first = container.make<{ id: number }>('service');
            const second = container.make<{ id: number }>('service');

            expect(first).toBe(second);
        });

        test('should not override existing binding', () => {
            const container = createTestContainer();

            container.singleton('service', () => ({ version: 1 }));
            container.singletonIf('service', () => ({ version: 2 }));

            expect(container.make<{ version: number }>('service').version).toBe(1);
        });
    });

    describe('instance()', () => {
        test('should register an existing instance', () => {
            const container = createTestContainer();
            const instance = { name: 'pre-existing' };

            container.instance('service', instance);

            expect(container.make('service')).toBe(instance);
        });

        test('should always return the same instance', () => {
            const container = createTestContainer();
            const instance = { counter: 0 };

            container.instance('service', instance);

            const first = container.make<typeof instance>('service');
            first.counter++;

            const second = container.make<typeof instance>('service');

            expect(second.counter).toBe(1);
        });
    });

    describe('bound()', () => {
        test('should return true for existing binding', () => {
            const container = createTestContainer();

            container.bind('service', () => ({}));

            expect(container.bound('service')).toBe(true);
        });

        test('should return false for non-existing binding', () => {
            const container = createTestContainer();

            expect(container.bound('unknown')).toBe(false);
        });
    });

    describe('forget()', () => {
        test('should remove a binding', () => {
            const container = createTestContainer();

            container.bind('service', () => ({}));
            expect(container.bound('service')).toBe(true);

            container.forget('service');
            expect(container.bound('service')).toBe(false);
        });
    });

    describe('flush()', () => {
        test('should remove all bindings', () => {
            const container = createTestContainer();

            container.bind('service1', () => ({}));
            container.bind('service2', () => ({}));
            container.bind('service3', () => ({}));

            container.flush();

            expect(container.bound('service1')).toBe(false);
            expect(container.bound('service2')).toBe(false);
            expect(container.bound('service3')).toBe(false);
        });
    });
});
