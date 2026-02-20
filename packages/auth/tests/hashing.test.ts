import { describe, expect, test } from 'bun:test';
import { ArgonHasher } from '../src/hashing/argon-hasher.ts';
import { BcryptHasher } from '../src/hashing/bcrypt-hasher.ts';

describe('Hashing', () => {
  describe('BcryptHasher', () => {
    test('should instantiate', () => {
      const hasher = new BcryptHasher();
      expect(hasher).toBeInstanceOf(BcryptHasher);
    });

    test('bcrypt hashes and verifies', async () => {
      const hasher = new BcryptHasher();
      const hash = await hasher.make('password');
      expect(await hasher.check('password', hash)).toBe(true);
      expect(await hasher.check('wrong', hash)).toBe(false);
    });

    test('bcrypt checks if password needs rehash', () => {
      const hasher = new BcryptHasher();
      expect(hasher.needsRehash('some_hash')).toBe(false);
      expect(hasher.needsRehash('some_hash', { rounds: 12 })).toBe(false);
    });

    test('bcrypt hashes with custom rounds', async () => {
      const hasher = new BcryptHasher();
      const hash = await hasher.make('password', { rounds: 12 });
      expect(await hasher.check('password', hash)).toBe(true);
      expect(await hasher.check('wrong', hash)).toBe(false);
    });

    test('bcrypt hashes with no options uses default rounds', async () => {
      const hasher = new BcryptHasher();
      const hash = await hasher.make('password');
      expect(await hasher.check('password', hash)).toBe(true);
    });

    test('bcrypt check() accepts options parameter', async () => {
      const hasher = new BcryptHasher();
      const hash = await hasher.make('password');
      expect(await hasher.check('password', hash, {})).toBe(true);
      expect(await hasher.check('wrong', hash, { rounds: 10 })).toBe(false);
    });
  });

  describe('ArgonHasher', () => {
    test('should instantiate', () => {
      const hasher = new ArgonHasher();
      expect(hasher).toBeInstanceOf(ArgonHasher);
    });

    test('argon2 hashes and verifies', async () => {
      const hasher = new ArgonHasher();
      const hash = await hasher.make('password');
      expect(await hasher.check('password', hash)).toBe(true);
      expect(await hasher.check('wrong', hash)).toBe(false);
    });

    test('argon2 checks if password needs rehash', () => {
      const hasher = new ArgonHasher();
      expect(hasher.needsRehash('some_hash')).toBe(false);
      expect(hasher.needsRehash('some_hash', { memoryCost: 19456 })).toBe(false);
    });

    test('argon2 hashes with custom memory and time costs', async () => {
      const hasher = new ArgonHasher();
      const hash = await hasher.make('password', { memoryCost: 19456, timeCost: 4 });
      expect(await hasher.check('password', hash)).toBe(true);
      expect(await hasher.check('wrong', hash)).toBe(false);
    });

    test('argon2 hashes with only memoryCost option', async () => {
      const hasher = new ArgonHasher();
      const hash = await hasher.make('password', { memoryCost: 8192 });
      expect(await hasher.check('password', hash)).toBe(true);
    });

    test('argon2 hashes with only timeCost option', async () => {
      const hasher = new ArgonHasher();
      const hash = await hasher.make('password', { timeCost: 2 });
      expect(await hasher.check('password', hash)).toBe(true);
    });

    test('argon2 check() accepts options parameter', async () => {
      const hasher = new ArgonHasher();
      const hash = await hasher.make('password');
      expect(await hasher.check('password', hash, {})).toBe(true);
      expect(await hasher.check('wrong', hash, { memoryCost: 8192 })).toBe(false);
    });
  });
});
