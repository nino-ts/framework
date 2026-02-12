import type { SocialUser as SocialUserContract } from './contracts/social-user';

export class SocialUser implements SocialUserContract {
    constructor(
        public id: string,
        public name: string,
        public email: string,
        public avatar: string,
        public token: string,
        public refreshToken: string | null = null,
        public expiresIn: number | null = null,
        public raw: Record<string, unknown> = {}
    ) {}

    getId(): string {
        return this.id;
    }

    getName(): string {
        return this.name;
    }

    getEmail(): string {
        return this.email;
    }

    getAvatar(): string {
        return this.avatar;
    }

    getToken(): string {
        return this.token;
    }

    getRefreshToken(): string | null {
        return this.refreshToken;
    }

    getExpiresIn(): number | null {
        return this.expiresIn;
    }

    getRaw(): Record<string, unknown> {
        return this.raw;
    }
}
