/**
 * Feature tests validating end-to-end contextual logging injection.
 *
 * @packageDocumentation
 */

import { describe, expect, test, spyOn, afterEach } from 'bun:test';
import { LoggerManager } from '../../src/LoggerManager.ts';
import { StdoutJsonDriver } from '../../src/StdoutJsonDriver.ts';
import { runWithContext, addContext } from '../../src/LogContext.ts';

describe('Contextual Logging Integration', () => {
  afterEach(() => {
    // Spy auto-restores in some bun versions, but we'll leave this block for cleanliness
  });

  test('should inject AsyncLocalStorage metadata into standard output', async () => {
    const writeSpy = spyOn(process.stdout, 'write').mockImplementation(() => true);
    
    const driver = new StdoutJsonDriver();
    const logger = new LoggerManager(driver);

    await new Promise<void>((resolve) => {
      runWithContext({ requestId: 'r-1234' }, () => {
        logger.info('Handling request');
        addContext({ userId: 'u-5678' });
        logger.warn('User missing permissions', { action: 'delete' });
        resolve();
      });
    });

    expect(writeSpy).toHaveBeenCalledTimes(2);

    const firstCallArgs = writeSpy.mock.calls[0] as unknown[];
    const firstCallJson = JSON.parse(firstCallArgs[0] as string);
    const secondCallArgs = writeSpy.mock.calls[1] as unknown[];
    const secondCallJson = JSON.parse(secondCallArgs[0] as string);

    // Initial logging
    expect(firstCallJson.message).toBe('Handling request');
    expect(firstCallJson.context).toEqual({ requestId: 'r-1234' });

    // Merged logging after addContext and local context override
    expect(secondCallJson.message).toBe('User missing permissions');
    expect(secondCallJson.context).toEqual({ 
      requestId: 'r-1234', 
      userId: 'u-5678', 
      action: 'delete' 
    });

    writeSpy.mockRestore();
  });
});
