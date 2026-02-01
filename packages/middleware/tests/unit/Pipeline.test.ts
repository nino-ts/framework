/**
 * Unit tests for Pipeline.
 *
 * @packageDocumentation
 */

import { describe, test, expect } from 'bun:test';
import { Pipeline } from '@/pipeline';
import {
    createMockRequest,
    createPassthroughMiddleware,
    createHeaderMiddleware,
    createLoggingMiddleware,
} from '@/tests/setup';

describe('Pipeline', () => {
    describe('handle()', () => {
        test('should execute final handler', async () => {
            const pipeline = new Pipeline();
            const request = createMockRequest();

            const response = await pipeline
                .then(() => new Response('OK'))
                .handle(request);

            expect(response.status).toBe(200);
            expect(await response.text()).toBe('OK');
        });

        test('should throw error without final handler', async () => {
            const pipeline = new Pipeline();
            const request = createMockRequest();

            expect(pipeline.handle(request)).rejects.toThrow(
                'Pipeline requires a final handler'
            );
        });
    });

    describe('pipe()', () => {
        test('should execute single middleware', async () => {
            const pipeline = new Pipeline();
            const request = createMockRequest();

            const response = await pipeline
                .pipe(createPassthroughMiddleware())
                .then(() => new Response('OK'))
                .handle(request);

            expect(await response.text()).toBe('OK');
        });

        test('should execute middleware in order', async () => {
            const log: string[] = [];
            const pipeline = new Pipeline();
            const request = createMockRequest();

            await pipeline
                .pipe(createLoggingMiddleware(log, 'first'))
                .pipe(createLoggingMiddleware(log, 'second'))
                .pipe(createLoggingMiddleware(log, 'third'))
                .then(() => new Response('OK'))
                .handle(request);

            expect(log).toEqual([
                'first:before',
                'second:before',
                'third:before',
                'third:after',
                'second:after',
                'first:after',
            ]);
        });

        test('should allow middleware to modify response', async () => {
            const pipeline = new Pipeline();
            const request = createMockRequest();

            const response = await pipeline
                .pipe(createHeaderMiddleware('X-First', 'one'))
                .pipe(createHeaderMiddleware('X-Second', 'two'))
                .then(() => new Response('OK'))
                .handle(request);

            expect(response.headers.get('X-First')).toBe('one');
            expect(response.headers.get('X-Second')).toBe('two');
        });

        test('should allow middleware to short-circuit', async () => {
            const log: string[] = [];
            const pipeline = new Pipeline();
            const request = createMockRequest();

            const response = await pipeline
                .pipe(createLoggingMiddleware(log, 'first'))
                .pipe(async () => {
                    log.push('short-circuit');
                    return new Response('Blocked', { status: 401 });
                })
                .pipe(createLoggingMiddleware(log, 'never'))
                .then(() => new Response('OK'))
                .handle(request);

            expect(response.status).toBe(401);
            expect(await response.text()).toBe('Blocked');
            expect(log).toEqual(['first:before', 'short-circuit', 'first:after']);
        });
    });

    describe('through()', () => {
        test('should add multiple middleware', async () => {
            const log: string[] = [];
            const pipeline = new Pipeline();
            const request = createMockRequest();

            await pipeline
                .through([
                    createLoggingMiddleware(log, 'first'),
                    createLoggingMiddleware(log, 'second'),
                ])
                .then(() => new Response('OK'))
                .handle(request);

            expect(log).toEqual([
                'first:before',
                'second:before',
                'second:after',
                'first:after',
            ]);
        });
    });

    describe('static create()', () => {
        test('should create new pipeline instance', () => {
            const pipeline = Pipeline.create();

            expect(pipeline).toBeInstanceOf(Pipeline);
        });
    });

    describe('request modification', () => {
        test('should allow middleware to modify request for next', async () => {
            const pipeline = new Pipeline();
            const request = createMockRequest('/test', {
                headers: { 'X-Original': 'true' },
            });

            let receivedUrl = '';

            await pipeline
                .pipe(async (req, next) => {
                    // Create modified request
                    const newRequest = new Request('http://localhost/modified', req);
                    return next(newRequest);
                })
                .then((req) => {
                    receivedUrl = new URL(req.url).pathname;
                    return new Response('OK');
                })
                .handle(request);

            expect(receivedUrl).toBe('/modified');
        });
    });
});
