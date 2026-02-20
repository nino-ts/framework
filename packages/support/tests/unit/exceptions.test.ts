import { describe, expect, it } from 'bun:test';
import { InvalidArgumentException, RuntimeException } from '../../src/exceptions/index.ts';

describe('Exceptions', () => {
  describe('RuntimeException', () => {
    it('creates exception with message', () => {
      const error = new RuntimeException('Something went wrong');
      expect(error.message).toBe('Something went wrong');
    });

    it('sets correct name', () => {
      const error = new RuntimeException('test');
      expect(error.name).toBe('RuntimeException');
    });

    it('extends Error', () => {
      const error = new RuntimeException('test');
      expect(error).toBeInstanceOf(Error);
    });

    it('has stack trace', () => {
      const error = new RuntimeException('test');
      expect(typeof error.stack).toBe('string');
    });

    it('can be thrown and caught', () => {
      expect(() => {
        throw new RuntimeException('error');
      }).toThrow('error');
    });
  });

  describe('InvalidArgumentException', () => {
    it('creates exception with message', () => {
      const error = new InvalidArgumentException('Invalid argument provided');
      expect(error.message).toBe('Invalid argument provided');
    });

    it('extends RuntimeException', () => {
      const error = new InvalidArgumentException('test');
      expect(error).toBeInstanceOf(RuntimeException);
    });

    it('sets correct name', () => {
      const error = new InvalidArgumentException('test');
      expect(error.name).toBe('InvalidArgumentException');
    });

    it('extends Error transitively', () => {
      const error = new InvalidArgumentException('test');
      expect(error).toBeInstanceOf(Error);
    });

    it('can be caught as RuntimeException', () => {
      const catcher = () => {
        try {
          throw new InvalidArgumentException('test');
        } catch (e) {
          if (e instanceof RuntimeException) {
            return true;
          }
        }
        return false;
      };
      expect(catcher()).toBe(true);
    });
  });
});
