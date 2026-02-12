export interface Hasher {
    /**
     * Hash the given value.
     */
    make(value: string, options?: Record<string, unknown>): Promise<string>;

    /**
     * Check the given value against a hashed value.
     */
    check(value: string, hashedValue: string, options?: Record<string, unknown>): Promise<boolean>;

    /**
     * Check if the given hash has been hashed using the given options.
     */
    needsRehash(hashedValue: string, options?: Record<string, unknown>): boolean;
}
