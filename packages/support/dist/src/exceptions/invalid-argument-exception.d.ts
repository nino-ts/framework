import { RuntimeException } from "./runtime-exception";
/**
 * InvalidArgumentException
 *
 * Exception thrown when an invalid argument is passed
 *
 * @example
 * ```typescript
 * throw new InvalidArgumentException('Expected a string, got number');
 * ```
 */
export declare class InvalidArgumentException extends RuntimeException {
    /**
     * Create a new InvalidArgumentException
     *
     * @param message - Error message
     */
    constructor(message?: string);
}
