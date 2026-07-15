/**
 * Lightweight fake data helpers — zero external runtime dependencies.
 */
/**
 * Create a function that returns unique values from a generator.
 */
export declare function unique<T>(generator: () => T): () => T;
export declare const fake: {
    uuid(): string;
    name(): string;
    firstName(): string;
    lastName(): string;
    email(): string;
    uniqueEmail: () => string;
    password(plain?: string): string;
    randomString(length?: number): string;
    boolean(): boolean;
    date(): Date;
};
