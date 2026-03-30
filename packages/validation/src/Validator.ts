import type { ValidationRule } from './contracts/ValidationRule';
import type { ValidatorInterface } from './contracts/ValidatorInterface';
import { ValidationException } from './exceptions/ValidationException';

import { ArrayRule } from './rules/ArrayRule';
import { BooleanRule } from './rules/BooleanRule';
import { EmailRule } from './rules/EmailRule';
import { InRule } from './rules/InRule';
import { MaxRule } from './rules/MaxRule';
import { MinRule } from './rules/MinRule';
import { NumberRule } from './rules/NumberRule';
import { RequiredRule } from './rules/RequiredRule';
import { StringRule } from './rules/StringRule';
import { UuidRule } from './rules/UuidRule';

type ValidationData = Record<string, unknown>;
type ValidationRules = Record<string, string | string[]>;

/**
 * Registry pointing standard rule name implementations to their class contractors.
 */
const DEFAULT_RULES: Record<string, new () => ValidationRule> = {
  array: ArrayRule,
  boolean: BooleanRule,
  email: EmailRule,
  in: InRule,
  max: MaxRule,
  min: MinRule,
  number: NumberRule,
  required: RequiredRule,
  string: StringRule,
  uuid: UuidRule,
};

/**
 * Validates request data natively against framework validation boundaries.
 */
class Validator implements ValidatorInterface {
  protected readonly messages: Record<string, string[]> = {};

  protected constructor(
    protected readonly data: ValidationData,
    protected readonly rules: ValidationRules,
  ) {
    this.evaluate();
  }

  /**
   * Statically maps data onto the engine and resolves violations immediately.
   *
   * @param data - Raw input values (usually extracted dynamically from the request cycle).
   * @param rules - String based constraints formatted via Pipes (`required|min:3`).
   * @returns A fluent built Validator instance.
   */
  public static make(data: ValidationData, rules: ValidationRules): Validator {
    return new Validator(data, rules);
  }

  /**
   * @inheritDoc
   */
  public fails(): boolean {
    return Object.keys(this.messages).length > 0;
  }

  /**
   * @inheritDoc
   */
  public passes(): boolean {
    return !this.fails();
  }

  /**
   * @inheritDoc
   */
  public errors(): Record<string, string[]> {
    return this.messages;
  }

  /**
   * @inheritDoc
   */
  public validate(): Record<string, unknown> {
    if (this.fails()) {
      throw new ValidationException(this);
    }

    // Simplistic approach returning the raw data.
    return this.data;
  }

  /**
   * Orchestrator parsing provided string pipes allocating the designated validations natively.
   */
  protected evaluate(): void {
    for (const [attribute, constraints] of Object.entries(this.rules)) {
      const ruleItems = typeof constraints === 'string' ? constraints.split('|') : constraints;

      for (const item of ruleItems) {
        const [ruleName, paramsString] = item.split(':');
        const parameters = paramsString ? paramsString.split(',') : [];

        // Narrow typing locally avoiding implicit string undefines
        if (ruleName) {
          this.validateRule(attribute, ruleName, parameters);
        }
      }
    }
  }

  /**
   * Instantiates rules checking boundaries and pushing error messages natively without nested trees.
   */
  protected validateRule(attribute: string, ruleName: string, parameters: string[]): void {
    const RuleConstructor = DEFAULT_RULES[ruleName];

    if (!RuleConstructor) {
      // Unregistered rule handling placeholder
      this.addError(attribute, `Rule [${ruleName}] not supported.`);
      return;
    }

    const ruleInstance = new RuleConstructor();
    const value = this.getAttributeValue(attribute);

    if (!ruleInstance.passes(attribute, value, parameters)) {
      this.addError(attribute, ruleInstance.message(attribute, parameters));
    }
  }

  /**
   * Traverses the actual target payload retrieving its value safely avoiding implicit anys.
   * Currently only supports shallow bounds.
   */
  protected getAttributeValue(attribute: string): unknown {
    return this.data[attribute];
  }

  /**
   * Inserts evaluated failure message onto the global scope properties arrays.
   */
  protected addError(attribute: string, message: string): void {
    if (!this.messages[attribute]) {
      this.messages[attribute] = [];
    }

    const messages = this.messages[attribute];
    if (messages) {
      messages.push(message);
    }
  }
}

export { Validator };
