import type { Hasher } from '../contracts/hasher';

export class ArgonHasher implements Hasher {
    async make(value: string, options: { memoryCost?: number; timeCost?: number } = {}): Promise<string> {
        return Bun.password.hash(value, {
            algorithm: 'argon2id',
            memoryCost: options.memoryCost,
            timeCost: options.timeCost,
        });
    }

    async check(value: string, hashedValue: string): Promise<boolean> {
        return Bun.password.verify(value, hashedValue);
    }

    needsRehash(_hashedValue: string): boolean {
        return false;
    }
}
