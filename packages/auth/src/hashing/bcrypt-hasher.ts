import type { Hasher } from '../contracts/hasher';

export class BcryptHasher implements Hasher {
    async make(value: string, options: { rounds?: number } = {}): Promise<string> {
        return Bun.password.hash(value, {
            algorithm: 'bcrypt',
            cost: options.rounds || 10,
        });
    }

    async check(value: string, hashedValue: string): Promise<boolean> {
        return Bun.password.verify(value, hashedValue);
    }

    needsRehash(_hashedValue: string, _options: { rounds?: number } = {}): boolean {
        // TODO: Parse bcrypt string to check cost
        return false;
    }
}
