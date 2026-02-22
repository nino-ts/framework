import { describe, expect, test } from 'bun:test';
import { Validator } from '../../src/Validator';

describe('ValidatorEngine', () => {
  describe('make()', () => {
    test('evaluates passing data resolving true in validation checks', () => {
      const data = {
        email: 'test@ninots.dev',
        username: 'ninots_developer',
      };

      const rules = {
        email: 'required|email',
        username: 'required|string',
      };

      const validator = Validator.make(data, rules);

      expect(validator.passes()).toBe(true);
      expect(validator.fails()).toBe(false);
      expect(validator.errors()).toEqual({});
    });

    test('detects required constraints resolving false validation', () => {
      const data = { username: 'john_doe' };

      const rules = {
        email: 'required|email',
        username: 'required|string',
      };

      const validator = Validator.make(data, rules);

      expect(validator.fails()).toBe(true);
      expect(validator.passes()).toBe(false);
      // Email is missing and it's marked as required.
      expect(validator.errors()).toHaveProperty('email');
      expect(validator.errors().email?.[0]).toBe('The email field is required.');
    });

    test('enforces advanced constraints correctly', () => {
      const data = {
        age: 18,
        identifier: '550e8400-e29b-41d4-a716-446655440000',
        name: 'ab',
        role: 'editor',
      };

      const rules = {
        age: 'number|min:21',
        identifier: 'string|uuid',
        name: 'string|max:1',
        role: 'string|in:admin,user',
      };

      const validator = Validator.make(data, rules);

      expect(validator.fails()).toBe(true);
      expect(validator.errors()).toHaveProperty('age');
      expect(validator.errors().age?.[0]).toBe('The age field must be at least 21.');
      expect(validator.errors()).toHaveProperty('role');
      expect(validator.errors().role?.[0]).toBe('The selected role is invalid.');
      expect(validator.errors()).toHaveProperty('name');
      expect(validator.errors().name?.[0]).toBe('The name field must not be greater than 1.');
      expect(validator.errors()).not.toHaveProperty('identifier');
    });
  });
});
