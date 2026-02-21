/**
 * Unit tests for StdoutJsonDriver.
 *
 * @packageDocumentation
 */

import { describe, expect, test, spyOn, afterEach } from 'bun:test';
import { StdoutJsonDriver } from '../../src/StdoutJsonDriver.ts';

describe('StdoutJsonDriver', () => {
  afterEach(() => {
    // Restore mocks after each test
    // process.stdout.write is restored automatically if we use standard mock restoration
  });

  test('should format standard string message as JSON and write to stdout', () => {
    const writeSpy = spyOn(process.stdout, 'write').mockImplementation(() => true);
    const driver = new StdoutJsonDriver();

    driver.write('info', 'System started', { reqId: 'abc' });

    expect(writeSpy).toHaveBeenCalled();
    const callArgs = writeSpy.mock.calls[0] as unknown[];
    const output = callArgs[0] as string;
    const parsed = JSON.parse(output);

    expect(parsed.level).toBe('info');
    expect(parsed.message).toBe('System started');
    expect(parsed.context).toEqual({ reqId: 'abc' });
    expect(parsed.timestamp).toBeDefined();

    writeSpy.mockRestore();
  });

  test('should gracefully format Error objects', () => {
    const writeSpy = spyOn(process.stdout, 'write').mockImplementation(() => true);
    const driver = new StdoutJsonDriver();

    const err = new Error('Database connection failed');
    driver.write('error', err);

    expect(writeSpy).toHaveBeenCalled();
    const callArgs = writeSpy.mock.calls[0] as unknown[];
    const output = callArgs[0] as string;
    const parsed = JSON.parse(output);

    expect(parsed.level).toBe('error');
    expect(parsed.message).toBe('Database connection failed');
    expect(parsed.err).toBeDefined();
    expect(parsed.err.name).toBe('Error');
    expect(parsed.err.message).toBe('Database connection failed');
    expect(parsed.err.stack).toBeDefined();

    writeSpy.mockRestore();
  });
});
