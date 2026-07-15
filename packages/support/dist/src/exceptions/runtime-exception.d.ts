/**
 * RuntimeException
 *
 * Exception thrown when a runtime error occurs
 *
 * @example
 * ```typescript
 * throw new RuntimeException('Something went wrong');
 * ```
 */
export declare class RuntimeException extends Error {
    /**
     * Create a new RuntimeException
     *
     * @param message - Error message
     */
    constructor(message?: string);
}
