/**
 * Interface mapping the Ninots Validator runtime operations.
 */
interface ValidatorInterface {
  /**
   * Gets a simple boolean indicator if any rule bounds have failed inside the current validation cycle.
   *
   * @returns True if the rules evaluation resulted in an error list.
   */
  fails(): boolean;

  /**
   * Indicates if the parsed rules evaluated successfully for the current data array.
   *
   * @returns True if there are zero errors.
   */
  passes(): boolean;

  /**
   * Reclaims the resulting error string bags.
   * Mapped via attribute specific definitions allowing structural arrays to have their own fields.
   *
   * @returns An object of arrayed strings identifying each violation.
   */
  errors(): Record<string, string[]>;

  /**
   * Triggers the internal verification throwing a unified ValidationException if validation failed.
   * Used by HTTP Controllers as a high performance escape clause preventing further propagation.
   *
   * @throws {ValidationException} - if there are resulting errors parsing rules.
   */
  validate(): Record<string, unknown>;
}

export type { ValidatorInterface };
