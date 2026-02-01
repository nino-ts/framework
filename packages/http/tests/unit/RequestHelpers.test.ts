/**
 * Unit tests for RequestHelpers.
 *
 * @packageDocumentation
 */

import { describe, test, expect } from 'bun:test';
import { RequestHelpers } from '@/request-helpers';
import { createMockRequest, createJsonRequest } from '@/tests/setup';

describe('RequestHelpers', () => {
    describe('query()', () => {
        test('should get query parameter', () => {
            const request = createMockRequest('/users?page=2&limit=10');

            expect(RequestHelpers.query(request, 'page')).toBe('2');
            expect(RequestHelpers.query(request, 'limit')).toBe('10');
        });

        test('should return undefined for missing parameter', () => {
            const request = createMockRequest('/users');

            expect(RequestHelpers.query(request, 'page')).toBeUndefined();
        });

        test('should return default value for missing parameter', () => {
            const request = createMockRequest('/users');

            expect(RequestHelpers.query(request, 'page', '1')).toBe('1');
        });
    });

    describe('queryAll()', () => {
        test('should get all query parameters', () => {
            const request = createMockRequest('/users?page=2&limit=10&sort=name');

            const params = RequestHelpers.queryAll(request);

            expect(params).toEqual({
                page: '2',
                limit: '10',
                sort: 'name',
            });
        });

        test('should return empty object when no parameters', () => {
            const request = createMockRequest('/users');

            expect(RequestHelpers.queryAll(request)).toEqual({});
        });
    });

    describe('header()', () => {
        test('should get header value', () => {
            const request = createMockRequest('/api', {
                headers: { 'Authorization': 'Bearer token123' },
            });

            expect(RequestHelpers.header(request, 'Authorization')).toBe('Bearer token123');
        });

        test('should return undefined for missing header', () => {
            const request = createMockRequest('/api');

            expect(RequestHelpers.header(request, 'X-Missing')).toBeUndefined();
        });

        test('should return default value for missing header', () => {
            const request = createMockRequest('/api');

            expect(RequestHelpers.header(request, 'X-Missing', 'default')).toBe('default');
        });
    });

    describe('hasHeader()', () => {
        test('should return true when header exists', () => {
            const request = createMockRequest('/api', {
                headers: { 'Authorization': 'Bearer token123' },
            });

            expect(RequestHelpers.hasHeader(request, 'Authorization')).toBe(true);
        });

        test('should return false when header does not exist', () => {
            const request = createMockRequest('/api');

            expect(RequestHelpers.hasHeader(request, 'Authorization')).toBe(false);
        });
    });

    describe('bearerToken()', () => {
        test('should extract bearer token', () => {
            const request = createMockRequest('/api', {
                headers: { 'Authorization': 'Bearer abc123xyz' },
            });

            expect(RequestHelpers.bearerToken(request)).toBe('abc123xyz');
        });

        test('should return undefined when no Authorization header', () => {
            const request = createMockRequest('/api');

            expect(RequestHelpers.bearerToken(request)).toBeUndefined();
        });

        test('should return undefined when not Bearer auth', () => {
            const request = createMockRequest('/api', {
                headers: { 'Authorization': 'Basic dXNlcjpwYXNz' },
            });

            expect(RequestHelpers.bearerToken(request)).toBeUndefined();
        });
    });

    describe('json()', () => {
        test('should parse JSON body', async () => {
            const body = { name: 'John', email: 'john@example.com' };
            const request = createJsonRequest('/users', body);

            const result = await RequestHelpers.json(request);

            expect(result).toEqual(body);
        });

        test('should cache parsed body', async () => {
            const body = { name: 'John' };
            const request = createJsonRequest('/users', body);

            const first = await RequestHelpers.json(request);
            const second = await RequestHelpers.json(request);

            expect(first).toBe(second);
        });
    });

    describe('input()', () => {
        test('should get value from body', async () => {
            const request = createJsonRequest('/users', {
                name: 'John',
                email: 'john@example.com',
            });

            const name = await RequestHelpers.input(request, 'name');

            expect(name).toBe('John');
        });

        test('should return undefined for missing key', async () => {
            const request = createJsonRequest('/users', { name: 'John' });

            const age = await RequestHelpers.input(request, 'age');

            expect(age).toBeUndefined();
        });

        test('should return default value for missing key', async () => {
            const request = createJsonRequest('/users', { name: 'John' });

            const role = await RequestHelpers.input(request, 'role', 'user');

            expect(role).toBe('user');
        });
    });

    describe('all()', () => {
        test('should get all body data', async () => {
            const body = {
                name: 'John', age: 30

            };
            const request = createJsonRequest('/users', body);

            const result = await RequestHelpers.all(request);

            expect(result).toEqual(body);
        });
    });

    describe('isMethod()', () => {
        test('should check request method', () => {
            const getRequest = createMockRequest('/users');
            const postRequest = createMockRequest('/users', { method: 'POST' });

            expect(RequestHelpers.isMethod(getRequest, 'GET')).toBe(true);
            expect(RequestHelpers.isMethod(getRequest, 'POST')).toBe(false);
            expect(RequestHelpers.isMethod(postRequest, 'POST')).toBe(true);
        });

        test('should be case-insensitive', () => {
            const request = createMockRequest('/users', { method: 'POST' });

            expect(RequestHelpers.isMethod(request, 'post')).toBe(true);
            expect(RequestHelpers.isMethod(request, 'Post')).toBe(true);
        });
    });

    describe('method()', () => {
        test('should return request method', () => {
            const request = createMockRequest('/users', { method: 'DELETE' });

            expect(RequestHelpers.method(request)).toBe('DELETE');
        });
    });

    describe('path()', () => {
        test('should return path without query string', () => {
            const request = createMockRequest('/users/123?page=1');

            expect(RequestHelpers.path(request)).toBe('/users/123');
        });
    });

    describe('url()', () => {
        test('should return full URL', () => {
            const request = createMockRequest('http://example.com/users?page=1');

            expect(RequestHelpers.url(request)).toBe('http://example.com/users?page=1');
        });
    });

    describe('is()', () => {
        test('should match exact path', () => {
            const request = createMockRequest('/admin/users');

            expect(RequestHelpers.is(request, '/admin/users')).toBe(true);
            expect(RequestHelpers.is(request, '/admin/posts')).toBe(false);
        });

        test('should match wildcard pattern', () => {
            const request = createMockRequest('/admin/users/123');

            expect(RequestHelpers.is(request, '/admin/*')).toBe(true);
            expect(RequestHelpers.is(request, '/users/*')).toBe(false);
        });
    });

    describe('expectsJson()', () => {
        test('should return true when Accept header includes JSON', () => {
            const request = createMockRequest('/api', {
                headers: { 'Accept': 'application/json' },
            });

            expect(RequestHelpers.expectsJson(request)).toBe(true);
        });

        test('should return false when Accept header does not include JSON', () => {
            const request = createMockRequest('/api', {
                headers: { 'Accept': 'text/html' },
            });

            expect(RequestHelpers.expectsJson(request)).toBe(false);
        });
    });

    describe('isAjax()', () => {
        test('should return true for AJAX requests', () => {
            const request = createMockRequest('/api', {
                headers: { 'X-Requested-With': 'XMLHttpRequest' },
            });

            expect(RequestHelpers.isAjax(request)).toBe(true);
        });

        test('should return false for non-AJAX requests', () => {
            const request = createMockRequest('/api');

            expect(RequestHelpers.isAjax(request)).toBe(false);
        });
    });

    describe('ip()', () => {
        test('should get IP from X-Forwarded-For header', () => {
            const request = createMockRequest('/api', {
                headers: { 'X-Forwarded-For': '192.168.1.1, 10.0.0.1' },
            });

            expect(RequestHelpers.ip(request)).toBe('192.168.1.1');
        });

        test('should get IP from X-Real-IP header', () => {
            const request = createMockRequest('/api', {
                headers: { 'X-Real-IP': '192.168.1.100' },
            });

            expect(RequestHelpers.ip(request)).toBe('192.168.1.100');
        });

        test('should return undefined when no IP headers', () => {
            const request = createMockRequest('/api');

            expect(RequestHelpers.ip(request)).toBeUndefined();
        });
    });
});
