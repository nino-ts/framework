/**
 * Unit tests for OutputStyle.
 *
 * TDD: These tests define the expected behavior BEFORE implementation.
 *
 * @packageDocumentation
 */

import { describe, test, expect } from 'bun:test';
import { OutputStyle } from '@/output-style';
import { createOutputCapture } from '@/tests/setup';

describe('OutputStyle', () => {
    describe('info()', () => {
        test('should output info styled message', () => {
            const capture = createOutputCapture();
            const style = new OutputStyle(capture);

            style.info('Info message');

            expect(capture.getOutput()).toContain('Info message');
        });
    });

    describe('error()', () => {
        test('should output error styled message', () => {
            const capture = createOutputCapture();
            const style = new OutputStyle(capture);

            style.error('Error message');

            expect(capture.getOutput()).toContain('Error message');
        });
    });

    describe('success()', () => {
        test('should output success styled message', () => {
            const capture = createOutputCapture();
            const style = new OutputStyle(capture);

            style.success('Success message');

            expect(capture.getOutput()).toContain('Success message');
        });
    });

    describe('warn()', () => {
        test('should output warning styled message', () => {
            const capture = createOutputCapture();
            const style = new OutputStyle(capture);

            style.warn('Warning message');

            expect(capture.getOutput()).toContain('Warning message');
        });
    });

    describe('line()', () => {
        test('should output plain message', () => {
            const capture = createOutputCapture();
            const style = new OutputStyle(capture);

            style.line('Plain line');

            expect(capture.getOutput()).toBe('Plain line');
        });
    });

    describe('newLine()', () => {
        test('should output empty line', () => {
            const capture = createOutputCapture();
            const style = new OutputStyle(capture);

            style.newLine();

            expect(capture.lines.length).toBe(1);
            expect(capture.lines[0]).toBe('');
        });
    });

    describe('table()', () => {
        test('should output formatted table', () => {
            const capture = createOutputCapture();
            const style = new OutputStyle(capture);

            style.table(['Name', 'Age'], [
                ['John', '30'],
                ['Jane', '25'],
            ]);

            const output = capture.getOutput();
            expect(output).toContain('Name');
            expect(output).toContain('Age');
            expect(output).toContain('John');
            expect(output).toContain('30');
        });
    });
});
