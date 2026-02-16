import { RuntimeException } from './runtime-exception';

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
export class InvalidArgumentException extends RuntimeException {
    /**
     * Create a new InvalidArgumentException
     *
     * @param message - Error message
     */
    constructor(message: string = '') {
        super(message);
        this.name = 'InvalidArgumentException';
        Object.setPrototypeOf(this, InvalidArgumentException.prototype);
    }
}
