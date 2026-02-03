/**
 * Unit tests for Application.
 *
 * TDD: These tests define the expected behavior BEFORE implementation.
 *
 * @packageDocumentation
 */

import { describe, test, expect } from 'bun:test';
import { Application } from '@/application';
import { createTestConfig } from '@/tests/setup';
import type { ErrorHandler } from '@/types';

describe('Application', () => {
    describe('constructor', () => {
        test('should create application with config', () => {
            const config = createTestConfig({ port: 3000 });
            const app = new Application(config);

            expect(app).toBeInstanceOf(Application);
        });

        test('should use default config values', () => {
            const app = new Application({});

            expect(app.getConfig().port).toBe(3000);
            expect(app.getConfig().hostname).toBe('localhost');
        });

        test('should start in created state', () => {
            const app = new Application({});

            expect(app.getState()).toBe('created');
        });
    });

    describe('register()', () => {
        test('should register a service provider', () => {
            const app = new Application({});
            const provider = {
                register: () => { },
                boot: () => { },
            };

            app.register(provider);

            expect(app.getProviders()).toContain(provider);
        });

        test('should call provider register method', () => {
            const app = new Application({});
            let registerCalled = false;
            const provider = {
                register: () => { registerCalled = true; },
                boot: () => { },
            };

            app.register(provider);

            expect(registerCalled).toBe(true);
        });

        test('should transition to registered state', () => {
            const app = new Application({});
            const provider = {
                register: () => { },
                boot: () => { },
            };

            app.register(provider);

            expect(app.getState()).toBe('registered');
        });
    });

    describe('boot()', () => {
        test('should boot all registered providers', async () => {
            const app = new Application({});
            let bootCalled = false;
            const provider = {
                register: () => { },
                boot: () => { bootCalled = true; },
            };

            app.register(provider);
            await app.boot();

            expect(bootCalled).toBe(true);
        });

        test('should transition to booted state', async () => {
            const app = new Application({});

            await app.boot();

            expect(app.getState()).toBe('booted');
        });

        test('should support async boot methods', async () => {
            const app = new Application({});
            let asyncBootCalled = false;
            const provider = {
                register: () => { },
                boot: async () => {
                    await new Promise(resolve => setTimeout(resolve, 10));
                    asyncBootCalled = true;
                },
            };

            app.register(provider);
            await app.boot();

            expect(asyncBootCalled).toBe(true);
        });
    });

    describe('setHandler()', () => {
        test('should set the request handler', () => {
            const app = new Application({});
            const handler = () => new Response('OK');

            app.setHandler(handler);

            expect(app.getHandler()).toBe(handler);
        });
    });

    describe('setErrorHandler()', () => {
        test('should set the error handler', () => {
            const app = new Application({});
            const errorHandler: ErrorHandler = {
                handle: (error: Error) => new Response(error.message, { status: 500 }),
            };

            const result = app.setErrorHandler(errorHandler);

            expect(result).toBe(app); // Should return this for chaining
        });

        test('should call error handler when request throws', async () => {
            const app = new Application(createTestConfig());
            let errorHandled = false;
            let capturedError: Error | null = null;

            app.setHandler(() => {
                throw new Error('Test error');
            });

            app.setErrorHandler({
                handle: (error: Error) => {
                    errorHandled = true;
                    capturedError = error;
                    return new Response('Error handled', { status: 500 });
                },
            });

            await app.start();

            // Get the actual port from the server
            const server = app.getServer();
            const port = server?.port ?? 0;

            // Make a request to trigger error
            const response = await fetch(`http://localhost:${port}/`);
            expect(response.status).toBe(500);
            expect(await response.text()).toBe('Error handled');
            expect(errorHandled).toBe(true);
            expect(capturedError?.message).toBe('Test error');

            await app.stop();
        });

        test('should pass request to error handler', async () => {
            const app = new Application(createTestConfig());
            let capturedRequest: Request | undefined;

            app.setHandler(() => {
                throw new Error('Test error');
            });

            app.setErrorHandler({
                handle: (error: Error, request?: Request) => {
                    capturedRequest = request;
                    return new Response('Error', { status: 500 });
                },
            });

            await app.start();

            const server = app.getServer();
            const port = server?.port ?? 0;

            await fetch(`http://localhost:${port}/test-path`);

            expect(capturedRequest).toBeDefined();
            expect(capturedRequest).toBeInstanceOf(Request);

            await app.stop();
        });

        test('should support async error handlers', async () => {
            const app = new Application(createTestConfig());

            app.setHandler(() => {
                throw new Error('Async test');
            });

            app.setErrorHandler({
                handle: async (error: Error) => {
                    await new Promise(resolve => setTimeout(resolve, 10));
                    return new Response(`Async: ${error.message}`, { status: 500 });
                },
            });

            await app.start();

            const server = app.getServer();
            const port = server?.port ?? 0;

            const response = await fetch(`http://localhost:${port}/`);
            expect(response.status).toBe(500);
            expect(await response.text()).toBe('Async: Async test');

            await app.stop();
        });
    });

    describe('start()', () => {
        test('should start the server', async () => {
            const app = new Application(createTestConfig());
            app.setHandler(() => new Response('OK'));

            await app.start();

            expect(app.getState()).toBe('running');
            expect(app.getServer()).toBeDefined();

            await app.stop();
        });

        test('should boot if not already booted', async () => {
            const app = new Application(createTestConfig());
            app.setHandler(() => new Response('OK'));

            await app.start();

            expect(app.getState()).toBe('running');

            await app.stop();
        });
    });

    describe('stop()', () => {
        test('should stop the server', async () => {
            const app = new Application(createTestConfig());
            app.setHandler(() => new Response('OK'));

            await app.start();
            await app.stop();

            expect(app.getState()).toBe('stopped');
        });
    });

    describe('getConfig()', () => {
        test('should return the application config', () => {
            const config = createTestConfig({ port: 8080 });
            const app = new Application(config);

            expect(app.getConfig().port).toBe(8080);
        });
    });
});
