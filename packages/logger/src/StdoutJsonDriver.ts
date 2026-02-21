/**
 * Implements a driver that outputs structured JSON logs to standard output.
 *
 * @packageDocumentation
 */

import type { LogDriverInterface } from './contracts/LogDriverInterface.ts';
import type { LogLevel } from './contracts/LogLevel.ts';

/**
 * Driver that writes highly performant JSON payloads directly to standard out.
 */
class StdoutJsonDriver implements LogDriverInterface {
  write(level: LogLevel, message: string | Error, context?: Record<string, unknown>): void {
    const payload: Record<string, unknown> = {
      timestamp: new Date().toISOString(),
      level,
    };

    if (message instanceof Error) {
      payload.message = message.message;
      payload.err = {
        name: message.name,
        message: message.message,
        stack: message.stack,
      };
    } else {
      payload.message = message;
    }

    if (context) {
      payload.context = context;
    }

    // High performance synchronous write without the overhead of console.log
    process.stdout.write(JSON.stringify(payload) + '\n');
  }
}

export { StdoutJsonDriver };
