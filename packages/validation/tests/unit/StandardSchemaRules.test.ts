import { describe, expect, test } from 'bun:test';
import { RequiredRule } from '../../src/rules/RequiredRule';
import { StringRule } from '../../src/rules/StringRule';
import { NumberRule } from '../../src/rules/NumberRule';
import { BooleanRule } from '../../src/rules/BooleanRule';
import { ArrayRule } from '../../src/rules/ArrayRule';
import { EmailRule } from '../../src/rules/EmailRule';
import { UuidRule } from '../../src/rules/UuidRule';
import { MinRule } from '../../src/rules/MinRule';
import { MaxRule } from '../../src/rules/MaxRule';
import { InRule } from '../../src/rules/InRule';

describe('StandardSchemaV1 Rules', () => {
  describe('RequiredRule', () => {
    const rule = new RequiredRule();

    test('should pass with non-empty string', () => {
      const result = rule['~standard'].validate('hello');
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.value).toBe('hello');
      }
    });

    test('should fail with null', () => {
      const result = rule['~standard'].validate(null);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.issues).toHaveLength(1);
        expect(result.issues[0].message).toBe('The field is required.');
      }
    });

    test('should fail with empty string', () => {
      const result = rule['~standard'].validate('');
      expect(result.success).toBe(false);
    });

    test('should fail with empty array', () => {
      const result = rule['~standard'].validate([]);
      expect(result.success).toBe(false);
    });
  });

  describe('StringRule', () => {
    const rule = new StringRule();

    test('should pass with string', () => {
      const result = rule['~standard'].validate('hello');
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.value).toBe('hello');
      }
    });

    test('should pass with null (not required)', () => {
      const result = rule['~standard'].validate(null);
      expect(result.success).toBe(true);
    });

    test('should fail with number', () => {
      const result = rule['~standard'].validate(123);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.issues[0].message).toBe('The field must be a string.');
      }
    });
  });

  describe('NumberRule', () => {
    const rule = new NumberRule();

    test('should pass with number', () => {
      const result = rule['~standard'].validate(42);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.value).toBe(42);
      }
    });

    test('should pass with numeric string and coerce to number', () => {
      const result = rule['~standard'].validate('42');
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.value).toBe(42);
      }
    });

    test('should fail with non-numeric string', () => {
      const result = rule['~standard'].validate('hello');
      expect(result.success).toBe(false);
    });
  });

  describe('BooleanRule', () => {
    const rule = new BooleanRule();

    test('should pass with native boolean', () => {
      const result = rule['~standard'].validate(true);
      expect(result.success).toBe(true);
    });

    test('should coerce "true" string to boolean', () => {
      const result = rule['~standard'].validate('true');
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.value).toBe(true);
      }
    });

    test('should coerce 1 to boolean', () => {
      const result = rule['~standard'].validate(1);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.value).toBe(true);
      }
    });

    test('should fail with invalid value', () => {
      const result = rule['~standard'].validate('yes');
      expect(result.success).toBe(false);
    });
  });

  describe('ArrayRule', () => {
    const rule = new ArrayRule();

    test('should pass with array', () => {
      const result = rule['~standard'].validate([1, 2, 3]);
      expect(result.success).toBe(true);
    });

    test('should pass with null (not required)', () => {
      const result = rule['~standard'].validate(null);
      expect(result.success).toBe(true);
    });

    test('should fail with object', () => {
      const result = rule['~standard'].validate({ key: 'value' });
      expect(result.success).toBe(false);
    });
  });

  describe('EmailRule', () => {
    const rule = new EmailRule();

    test('should pass with valid email', () => {
      const result = rule['~standard'].validate('test@example.com');
      expect(result.success).toBe(true);
    });

    test('should fail with invalid email', () => {
      const result = rule['~standard'].validate('invalid-email');
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.issues[0].message).toBe('The field must be a valid email address.');
      }
    });
  });

  describe('UuidRule', () => {
    const rule = new UuidRule();

    test('should pass with valid UUID', () => {
      const result = rule['~standard'].validate('550e8400-e29b-41d4-a716-446655440000');
      expect(result.success).toBe(true);
    });

    test('should fail with invalid UUID', () => {
      const result = rule['~standard'].validate('not-a-uuid');
      expect(result.success).toBe(false);
    });

    test('should pass with empty string (not required)', () => {
      const result = rule['~standard'].validate('');
      expect(result.success).toBe(true);
    });
  });

  describe('MinRule', () => {
    test('should pass with number >= min', () => {
      const rule = new MinRule(5);
      const result = rule['~standard'].validate(10);
      expect(result.success).toBe(true);
    });

    test('should fail with number < min', () => {
      const rule = new MinRule(5);
      const result = rule['~standard'].validate(3);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.issues[0].message).toBe('The field must be at least 5.');
      }
    });

    test('should pass with string length >= min', () => {
      const rule = new MinRule(3);
      const result = rule['~standard'].validate('hello');
      expect(result.success).toBe(true);
    });

    test('should fail with array length < min', () => {
      const rule = new MinRule(3);
      const result = rule['~standard'].validate([1, 2]);
      expect(result.success).toBe(false);
    });
  });

  describe('MaxRule', () => {
    test('should pass with number <= max', () => {
      const rule = new MaxRule(10);
      const result = rule['~standard'].validate(5);
      expect(result.success).toBe(true);
    });

    test('should fail with number > max', () => {
      const rule = new MaxRule(10);
      const result = rule['~standard'].validate(15);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.issues[0].message).toBe('The field must not be greater than 10.');
      }
    });

    test('should pass with string length <= max', () => {
      const rule = new MaxRule(5);
      const result = rule['~standard'].validate('hi');
      expect(result.success).toBe(true);
    });
  });

  describe('InRule', () => {
    test('should pass with value in allowed list', () => {
      const rule = new InRule(['admin', 'user', 'editor']);
      const result = rule['~standard'].validate('admin');
      expect(result.success).toBe(true);
    });

    test('should fail with value not in allowed list', () => {
      const rule = new InRule(['admin', 'user']);
      const result = rule['~standard'].validate('guest');
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.issues[0].message).toBe('The selected value is invalid.');
      }
    });
  });
});
