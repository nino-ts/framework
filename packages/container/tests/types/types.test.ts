/**
 * Type tests for Container types.
 *
 * These tests verify compile-time type safety and inference.
 *
 * @packageDocumentation
 */

import { describe, test, expect } from 'bun:test';
import type { AbstractKey, Factory, Binding, ContainerInterface } from '@/types';
import { createAbstractKey } from '@/types';

describe('Type System', () => {
    describe('AbstractKey', () => {
        test('createAbstractKey should return branded type', () => {
            const key: AbstractKey = createAbstractKey('logger');

            expect(typeof key).toBe('string');
        });

        test('createAbstractKey should throw for empty string', () => {
            expect(() => createAbstractKey('')).toThrow('Abstract key cannot be empty');
        });

        test('createAbstractKey should throw for whitespace-only string', () => {
            expect(() => createAbstractKey('   ')).toThrow('Abstract key cannot be empty');
        });

        test('createAbstractKey should accept valid strings', () => {
            expect(() => createAbstractKey('logger')).not.toThrow();
            expect(() => createAbstractKey('database.connection')).not.toThrow();
            expect(() => createAbstractKey('App\\Services\\Logger')).not.toThrow();
        });
    });

    describe('Factory<T>', () => {
        test('should accept container and return T', () => {
            interface Logger {
                log(message: string): void;
            }

            const factory: Factory<Logger> = (container: ContainerInterface): Logger => {
                return {
                    log: (message: string): void => {
                        console.log(message);
                    },
                };
            };

            expect(typeof factory).toBe('function');
        });

        test('should enforce return type', () => {
            interface Config {
                readonly debug: boolean;
            }

            const factory: Factory<Config> = (_container: ContainerInterface): Config => {
                return { debug: true };
            };

            const mockContainer = {
                bind: (): void => { },
                singleton: (): void => { },
                bindIf: (): void => { },
                singletonIf: (): void => { },
                make: <T>(): T => ({} as T),
                bound: (): boolean => false,
                instance: (): void => { },
                forget: (): void => { },
                flush: (): void => { },
            };

            const result: Config = factory(mockContainer);
            expect(result.debug).toBe(true);
        });
    });

    describe('Binding<T>', () => {
        test('should have readonly factory and shared', () => {
            interface Service {
                readonly name: string;
            }

            const mockContainer = {
                bind: (): void => { },
                singleton: (): void => { },
                bindIf: (): void => { },
                singletonIf: (): void => { },
                make: <T>(): T => ({} as T),
                bound: (): boolean => false,
                instance: (): void => { },
                forget: (): void => { },
                flush: (): void => { },
            };

            const binding: Binding<Service> = {
                factory: (_c: ContainerInterface): Service => ({ name: 'test' }),
                shared: true,
            };

            // Readonly properties should be immutable
            expect(binding.factory(mockContainer).name).toBe('test');
            expect(binding.shared).toBe(true);
        });

        test('should allow optional instance', () => {
            interface Service {
                readonly id: number;
            }

            const mockContainer = {
                bind: (): void => { },
                singleton: (): void => { },
                bindIf: (): void => { },
                singletonIf: (): void => { },
                make: <T>(): T => ({} as T),
                bound: (): boolean => false,
                instance: (): void => { },
                forget: (): void => { },
                flush: (): void => { },
            };

            const bindingWithoutInstance: Binding<Service> = {
                factory: (_c: ContainerInterface): Service => ({ id: 1 }),
                shared: false,
            };

            const bindingWithInstance: Binding<Service> = {
                factory: (_c: ContainerInterface): Service => ({ id: 1 }),
                shared: true,
                instance: { id: 42 },
            };

            expect(bindingWithoutInstance.instance).toBeUndefined();
            expect(bindingWithInstance.instance?.id).toBe(42);
        });
    });

    describe('ContainerInterface', () => {
        test('should enforce method signatures', () => {
            const mockContainer: ContainerInterface = {
                bind<T>(abstract: string, factory: Factory<T>): void {
                    expect(typeof abstract).toBe('string');
                    expect(typeof factory).toBe('function');
                },
                singleton<T>(abstract: string, factory: Factory<T>): void {
                    expect(typeof abstract).toBe('string');
                    expect(typeof factory).toBe('function');
                },
                bindIf<T>(abstract: string, factory: Factory<T>): void {
                    expect(typeof abstract).toBe('string');
                    expect(typeof factory).toBe('function');
                },
                singletonIf<T>(abstract: string, factory: Factory<T>): void {
                    expect(typeof abstract).toBe('string');
                    expect(typeof factory).toBe('function');
                },
                make<T>(_abstract: string): T {
                    return {} as T;
                },
                bound(_abstract: string): boolean {
                    return false;
                },
                instance<T>(abstract: string, instance: T): void {
                    expect(typeof abstract).toBe('string');
                    expect(instance).toBeDefined();
                },
                forget(_abstract: string): void { },
                flush(): void { },
            };

            expect(mockContainer).toBeDefined();
        });
    });
});
