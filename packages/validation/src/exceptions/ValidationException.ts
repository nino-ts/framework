import type { ValidatorInterface } from '../contracts/ValidatorInterface';

/**
 * Ninots custom validation exception throwing errors caught by the framework globally.
 * Allows easy JSON serialization through the HTTP Exception Handler pipelines natively.
 */
class ValidationException extends Error {
  /**
   * The unified validation engine instance detailing violations.
   */
  public readonly validator: ValidatorInterface;

  /**
   * The resulting HTTP context code applied on automatic Controller unhandled exceptions.
   */
  public readonly status = 422;

  /**
   * Named exception footprint bypassing native Error override clashes on modern TS environments.
   */
  public override name = 'ValidationException';

  /**
   * Create a new validation exception wrapping the underlying failed validator.
   *
   * @param validator - The runtime logic holding `errors()` properties.
   */
  constructor(validator: ValidatorInterface) {
    super('The given data was invalid.');
    this.name = 'ValidationException';
    this.validator = validator;

    // Ensure proper prototype chain matching typical error subclassing in TS
    Object.setPrototypeOf(this, ValidationException.prototype);
  }

  /**
   * Get the individual grouped errors from the native validation runner.
   *
   * @returns Resulting mapped messages matrix.
   */
  public errors(): Record<string, string[]> {
    return this.validator.errors();
  }
}

export { ValidationException };
