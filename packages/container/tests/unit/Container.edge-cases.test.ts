/**
 * Edge case tests for Container.
 *
 * Tests boundary conditions, error handling, and edge scenarios.
 *
 * @packageDocumentation
 */

import { describe, test, expect } from 'bun:test';
import { Container, BindingNotFoundException, CircularDependencyException } from '@/container';
import { createTestContainer } from '@/tests/setup';

describe('Container - Edge Cases', () => {
    describe('Empty and Invalid Keys', () => {
        test('should handle empty string keys gracefully', () => {
            const container = createTestContainer();

            container.bind('', () => ({ value: 'empty' }));

            expect(container.bound('')).toBe(true);
            expect(container.make<{ value: string }>('')).toEqual({ value: 'empty' });
        });

        test('should handle whitespace-only keys', () => {
            const container = createTestContainer();

            container.bind('   ', () => ({ value: 'spaces' }));

            expect(container.bound('   ')).toBe(true);
        });

        test('should handle special characters in keys', () => {
            const container = createTestContainer();

            const specialKeys = [
                'service.nested',
                'service:scoped',
                'App\\Services\\Logger',
                'service@version1',
                'service#tag',
            ];

            specialKeys.forEach((key: string): void => {
                container.bind(key, () => ({ key }));
                expect(container.bound(key)).toBe(true);
                expect(container.make<{ key: string }>(key).key).toBe(key);
            });
        });
    });

    describe('Factory Error Handling', () => {
        test('should propagate factory errors', () => {
            const container = createTestContainer();

            container.bind('failing-service', (): never => {
                throw new Error('Factory failed');
            });

            expect(() => container.make('failing-service')).toThrow('Factory failed');
        });

        test('should propagate singleton factory errors', () => {
            const container = createTestContainer();

            container.singleton('failing-singleton', (): never => {
                throw new Error('Singleton factory failed');
            });

            expect(() => container.make('failing-singleton')).toThrow('Singleton factory failed');
        });

        test('should not cache instance when singleton factory fails', () => {
            const container = createTestContainer();
            let attempts = 0;

            container.singleton('conditional-fail', () => {
                attempts++;
                if (attempts === 1) {
                    throw new Error('First attempt failed');
                }
                return { attempts };
            });

            expect(() => container.make('conditional-fail')).toThrow('First attempt failed');
            expect(container.make<{ attempts: number }>('conditional-fail').attempts).toBe(2);
        });
    });

    describe('Circular Dependencies', () => {
        test('should detect direct circular dependency', () => {
            const container = createTestContainer();

            container.bind('service-a', (c) => {
                return { dep: c.make('service-a') };
            });

            expect(() => container.make('service-a')).toThrow(CircularDependencyException);
        });

        test('should detect indirect circular dependency', () => {
            const container = createTestContainer();

            container.bind('service-a', (c) => {
                return { dep: c.make('service-b') };
            });

            container.bind('service-b', (c) => {
                return { dep: c.make('service-a') };
            });

            expect(() => container.make('service-a')).toThrow(CircularDependencyException);
        });

        test('should provide dependency chain in circular dependency error', () => {
            const container = createTestContainer();

            container.bind('service-a', (c) => {
                return { dep: c.make('service-b') };
            });

            container.bind('service-b', (c) => {
                return { dep: c.make('service-c') };
            });

            container.bind('service-c', (c) => {
                return { dep: c.make('service-a') };
            });

            try {
                container.make('service-a');
                expect(true).toBe(false); // Should not reach here
            } catch (error) {
                expect(error).toBeInstanceOf(CircularDependencyException);
                if (error instanceof CircularDependencyException) {
                    expect(error.chain).toContain('service-a');
                    expect(error.chain).toContain('service-b');
                    expect(error.chain).toContain('service-c');
                }
            }
        });
    });

    describe('Memory and Performance', () => {
        test('should not leak memory when forgetting bindings', () => {
            const container = createTestContainer();

            for (let i = 0; i < 1000; i++) {
                container.bind(`service-${i}`, () => ({ data: new Array(100).fill(i) }));
                container.forget(`service-${i}`);
            }

            for (let i = 0; i < 1000; i++) {
                expect(container.bound(`service-${i}`)).toBe(false);
            }
        });

        test('should handle large number of bindings', () => {
            const container = createTestContainer();
            const count = 10000;

            for (let i = 0; i < count; i++) {
                container.bind(`service-${i}`, () => ({ id: i }));
            }

            expect(container.bound('service-0')).toBe(true);
            expect(container.bound(`service-${count - 1}`)).toBe(true);

            container.flush();

            expect(container.bound('service-0')).toBe(false);
        });

        test('should resolve singletons efficiently', () => {
            const container = createTestContainer();
            let factoryCallCount = 0;

            container.singleton('expensive-service', () => {
                factoryCallCount++;
                return { data: new Array(10000).fill(Math.random()) };
            });

            for (let i = 0; i < 1000; i++) {
                container.make('expensive-service');
            }

            expect(factoryCallCount).toBe(1);
        });
    });

    describe('Type Safety Edge Cases', () => {
        test('should handle undefined factory return', () => {
            const container = createTestContainer();

            container.bind('undefined-service', (): undefined => undefined);

            const result = container.make<undefined>('undefined-service');
            expect(result).toBeUndefined();
        });

        test('should handle null factory return', () => {
            const container = createTestContainer();

            container.bind('null-service', (): null => null);

            const result = container.make<null>('null-service');
            expect(result).toBeNull();
        });

        test('should handle primitive factory returns', () => {
            const container = createTestContainer();

            container.bind('string-service', (): string => 'test');
            container.bind('number-service', (): number => 42);
            container.bind('boolean-service', (): boolean => true);

            expect(container.make<string>('string-service')).toBe('test');
            expect(container.make<number>('number-service')).toBe(42);
            expect(container.make<boolean>('boolean-service')).toBe(true);
        });
    });

    describe('Overriding Bindings', () => {
        test('should allow overriding transient bindings', () => {
            const container = createTestContainer();

            container.bind('service', () => ({ version: 1 }));
            container.bind('service', () => ({ version: 2 }));

            expect(container.make<{ version: number }>('service').version).toBe(2);
        });

        test('should allow overriding singleton bindings', () => {
            const container = createTestContainer();

            container.singleton('service', () => ({ version: 1 }));
            container.make('service'); // Resolve to cache first version

            container.singleton('service', () => ({ version: 2 }));

            expect(container.make<{ version: number }>('service').version).toBe(2);
        });

        test('should allow changing transient to singleton', () => {
            const container = createTestContainer();

            container.bind('service', () => ({ id: Math.random() }));
            const first = container.make<{ id: number }>('service');
            const second = container.make<{ id: number }>('service');
            expect(first.id).not.toBe(second.id);

            container.singleton('service', () => ({ id: Math.random() }));
            const third = container.make<{ id: number }>('service');
            const fourth = container.make<{ id: number }>('service');
            expect(third.id).toBe(fourth.id);
        });
    });

    describe('Instance Registration', () => {
        test('should preserve instance mutations', () => {
            const container = createTestContainer();
            const config = { debug: true, count: 0 };

            container.instance('config', config);

            const first = container.make<typeof config>('config');
            first.count++;

            const second = container.make<typeof config>('config');

            expect(second.count).toBe(1);
            expect(first).toBe(second);
            expect(first).toBe(config);
        });

        test('should override instance with new instance', () => {
            const container = createTestContainer();

            const firstInstance = { value: 1 };
            const secondInstance = { value: 2 };

            container.instance('service', firstInstance);
            expect(container.make('service')).toBe(firstInstance);

            container.instance('service', secondInstance);
            expect(container.make('service')).toBe(secondInstance);
        });
    });

    describe('Forget and Flush Operations', () => {
        test('should allow re-binding after forget', () => {
            const container = createTestContainer();

            container.bind('service', () => ({ version: 1 }));
            container.forget('service');
            container.bind('service', () => ({ version: 2 }));

            expect(container.make<{ version: number }>('service').version).toBe(2);
        });

        test('should forget only specified binding', () => {
            const container = createTestContainer();

            container.bind('service-a', () => ({ name: 'a' }));
            container.bind('service-b', () => ({ name: 'b' }));
            container.bind('service-c', () => ({ name: 'c' }));

            container.forget('service-b');

            expect(container.bound('service-a')).toBe(true);
            expect(container.bound('service-b')).toBe(false);
            expect(container.bound('service-c')).toBe(true);
        });

        test('should allow re-binding after flush', () => {
            const container = createTestContainer();

            container.bind('service-a', () => ({ name: 'a' }));
            container.bind('service-b', () => ({ name: 'b' }));

            container.flush();

            container.bind('service-c', () => ({ name: 'c' }));

            expect(container.bound('service-a')).toBe(false);
            expect(container.bound('service-b')).toBe(false);
            expect(container.bound('service-c')).toBe(true);
        });

        test('should not throw when forgetting non-existent binding', () => {
            const container = createTestContainer();

            expect(() => container.forget('non-existent')).not.toThrow();
        });
    });
});
