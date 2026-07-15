import type { OAuthUser as OAuthUserContract } from "./contracts/OAuthUser";
export declare class OAuthUser implements OAuthUserContract {
    id: string;
    name: string;
    email: string;
    avatar: string;
    token: string;
    refreshToken: string | null;
    expiresIn: number | null;
    raw: Record<string, unknown>;
    constructor(id: string, name: string, email: string, avatar: string, token: string, refreshToken?: string | null, expiresIn?: number | null, raw?: Record<string, unknown>);
    getId(): string;
    getName(): string;
    getEmail(): string;
    getAvatar(): string;
    getToken(): string;
    getRefreshToken(): string | null;
    getExpiresIn(): number | null;
    getRaw(): Record<string, unknown>;
}
