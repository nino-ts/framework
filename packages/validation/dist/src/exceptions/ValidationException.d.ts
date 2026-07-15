import type { ValidatorInterface } from "../contracts/ValidatorInterface";
/**
 * Ninots custom validation exception throwing errors caught by the framework globally.
 * Allows easy JSON serialization through the HTTP Exception Handler pipelines natively.
 */
declare class ValidationException extends Error {
    /**
     * The unified validation engine instance detailing violations.
     */
    readonly validator: ValidatorInterface;
    /**
     * The resulting HTTP context code applied on automatic Controller unhandled exceptions.
     */
    readonly status = 422;
    /**
     * Named exception footprint bypassing native Error override clashes on modern TS environments.
     */
    name: string;
    /**
     * Create a new validation exception wrapping the underlying failed validator.
     *
     * @param validator - The runtime logic holding `errors()` properties.
     */
    constructor(validator: ValidatorInterface);
    /**
     * Get the individual grouped errors from the native validation runner.
     *
     * @returns Resulting mapped messages matrix.
     */
    errors(): Record<string, string[]>;
}
export { ValidationException };
