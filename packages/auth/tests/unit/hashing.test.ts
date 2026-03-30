import { describe, expect, test } from 'bun:test';
import { BcryptHasher } from '@/hashing/bcrypt-hasher.ts';
import { ArgonHasher } from '@/hashing/argon-hasher.ts';

/**
 * Unit tests for password hashing implementations.
 */
describe('Hashing', () => {
  describe('BcryptHasher', () => {
    test('should instantiate', () => {
      const hasher = new BcryptHasher();
      expect(hasher).toBeDefined();
    });

    test('should hash password', async () => {
      const hasher = new BcryptHasher();
      const hash = await hasher.hash('secret123');

      expect(hash).toBeDefined();
      expect(hash).toHaveLength(60);
      expect(hash).toMatch(/^\$2/);
    });

    test('should verify correct password', async () => {
      const hasher = new BcryptHasher();
      const hash = await hasher.hash('secret123');

      const valid = await hasher.verify('secret123', hash);
      expect(valid).toBe(true);
    });

    test('should reject wrong password', async () => {
      const hasher = new BcryptHasher();
      const hash = await hasher.hash('secret123');

      const valid = await hasher.verify('wrong', hash);
      expect(valid).toBe(false);
    });

    test('should check if rehash is needed', async () => {
      const hasher = new BcryptHasher(12);
      const hash = await hasher.hash('secret123');

      const needsRehash = await hasher.needsRehash(hash);
      expect(needsRehash).toBe(false);
    });

    test('should hash with custom rounds', async () => {
      const hasher = new BcryptHasher(12);
      const hash = await hasher.hash('secret123');

      expect(hash).toBeDefined();
    });

    test('should use default rounds when not specified', async () => {
      const hasher = new BcryptHasher();
      const hash = await hasher.hash('secret123');

      expect(hash).toBeDefined();
    });
  });

  describe('ArgonHasher', () => {
    test('should instantiate', () => {
      const hasher = new ArgonHasher();
      expect(hasher).toBeDefined();
    });

    test('should hash password', async () => {
      const hasher = new ArgonHasher();
      const hash = await hasher.hash('secret123');

      expect(hash).toBeDefined();
      expect(hash).toContain('$argon2');
    });

    test('should verify correct password', async () => {
      const hasher = new ArgonHasher();
      const hash = await hasher.hash('secret123');

      const valid = await hasher.verify('secret123', hash);
      expect(valid).toBe(true);
    });

    test('should reject wrong password', async () => {
      const hasher = new ArgonHasher();
      const hash = await hasher.hash('secret123');

      const valid = await hasher.verify('wrong', hash);
      expect(valid).toBe(false);
    });

    test('should check if rehash is needed', async () => {
      const hasher = new ArgonHasher(65536, 3, 1);
      const hash = await hasher.hash('secret123');

      const needsRehash = await hasher.needsRehash(hash);
      expect(needsRehash).toBe(false);
    });

    test('should hash with custom memory and time costs', async () => {
      const hasher = new ArgonHasher(32768, 2, 1);
      const hash = await hasher.hash('secret123');

      expect(hash).toBeDefined();
    });

    test('should hash with only memoryCost option', async () => {
      const hasher = new ArgonHasher(32768);
      const hash = await hasher.hash('secret123');

      expect(hash).toBeDefined();
    });

    test('should hash with only timeCost option', async () => {
      const hasher = new ArgonHasher(65536, 2);
      const hash = await hasher.hash('secret123');

      expect(hash).toBeDefined();
    });
  });
});
