/**
 * Contract specifying how a custom validation rule functions globally.
 * Built-in and Custom rules should match this footprint.
 */
interface ValidationRule {
  /**
   * Determines if the validation rule passes based on the value provided.
   *
   * @param attribute - Field identifier mapped in data (e.g user.name)
   * @param value - Extracted data value to evaluate
   * @param parameters - Any rule parameters given (e.g 'min:3' sets parameters to ['3'])
   * @returns Boolean determining if data passes inspection
   */
  passes(attribute: string, value: unknown, parameters?: string[]): boolean;

  /**
   * Replaces and returns the specific error message failing condition.
   *
   * @param attribute - Field identifier to inject into message placeholder
   * @param parameters - Rule specific bounds for messaging injections
   * @returns The resolved English validation failure message
   */
  message(attribute: string, parameters?: string[]): string;
}

export type { ValidationRule };
