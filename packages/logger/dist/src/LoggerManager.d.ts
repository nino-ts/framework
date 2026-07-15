/**
 * Implements the main logging manager that delegates to drivers.
 *
 * @packageDocumentation
 */
import type { LogDriverInterface } from "./contracts/LogDriverInterface";
import type { LoggerInterface } from "./contracts/LoggerInterface";
import type { LogLevel } from "./contracts/LogLevel";
/**
 * Manages logging by delegating to an underlying driver.
 */
declare class LoggerManager implements LoggerInterface {
    #private;
    /**
     * Initializes the manager with a specific log driver.
     *
     * @param driver - The destination driver for log entries
     */
    constructor(driver: LogDriverInterface);
    log(level: LogLevel, message: string | Error, context?: Record<string, unknown>): void;
    trace(message: string | Error, context?: Record<string, unknown>): void;
    debug(message: string | Error, context?: Record<string, unknown>): void;
    info(message: string | Error, context?: Record<string, unknown>): void;
    warn(message: string | Error, context?: Record<string, unknown>): void;
    error(message: string | Error, context?: Record<string, unknown>): void;
    fatal(message: string | Error, context?: Record<string, unknown>): void;
}
export { LoggerManager };
