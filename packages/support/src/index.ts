/**
 * @ninots/support
 *
 * Foundation utilities for Ninots framework
 * Provides string, array, and collection helper classes
 *
 * @example
 * ```typescript
 * import { Str } from '@ninots/support';
 *
 * const camelized = Str.camel('hello-world');
 * ```
 */

export { Str } from './str/str';

// Placeholder exports - to be implemented
export class Arr {
    // TODO: Implement Arr class
}

export class Collection {
    // TODO: Implement Collection class
}

export class RuntimeException extends Error {
    /**
     * Create a new RuntimeException instance
     */
    constructor(message: string) {
        super(message);
        this.name = 'RuntimeException';
    }
}

export class InvalidArgumentException extends RuntimeException {
    /**
     * Create a new InvalidArgumentException instance
     */
    constructor(message: string) {
        super(message);
        this.name = 'InvalidArgumentException';
    }
}
