/**
 * Implements a driver that outputs structured JSON logs to standard output.
 *
 * @packageDocumentation
 */
import type { LogDriverInterface } from "./contracts/LogDriverInterface";
import type { LogLevel } from "./contracts/LogLevel";
/**
 * Driver that writes highly performant JSON payloads directly to standard out.
 */
declare class StdoutJsonDriver implements LogDriverInterface {
    write(level: LogLevel, message: string | Error, context?: Record<string, unknown>): void;
}
export { StdoutJsonDriver };
