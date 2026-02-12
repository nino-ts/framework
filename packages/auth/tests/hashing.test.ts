import { describe, expect, it } from 'bun:test';
import { ArgonHasher } from '../src/hashing/argon-hasher';
import { BcryptHasher } from '../src/hashing/bcrypt-hasher';

describe('Hashing', () => {
    it('bcrypt hashes and verifies', async () => {
        const hasher = new BcryptHasher();
        const hash = await hasher.make('password');
        expect(await hasher.check('password', hash)).toBe(true);
        expect(await hasher.check('wrong', hash)).toBe(false);
    });

    it('argon2 hashes and verifies', async () => {
        const hasher = new ArgonHasher();
        const hash = await hasher.make('password');
        expect(await hasher.check('password', hash)).toBe(true);
        expect(await hasher.check('wrong', hash)).toBe(false);
    });
});
