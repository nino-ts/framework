/**
 * Unit tests for createApp factory.
 *
 * TDD: These tests define the expected behavior BEFORE implementation.
 *
 * @packageDocumentation
 */

import { describe, test, expect } from 'bun:test';
import { createApp } from '@/create-app';
import { Application } from '@/application';

describe('createApp', () => {
    test('should create an Application instance', () => {
        const app = createApp({ port: 3000 });

        expect(app).toBeInstanceOf(Application);
    });

    test('should apply configuration', () => {
        const app = createApp({ port: 8080, hostname: '0.0.0.0' });

        expect(app.getConfig().port).toBe(8080);
        expect(app.getConfig().hostname).toBe('0.0.0.0');
    });

    test('should use default configuration when not provided', () => {
        const app = createApp();

        expect(app.getConfig().port).toBe(3000);
        expect(app.getConfig().hostname).toBe('localhost');
    });
});
