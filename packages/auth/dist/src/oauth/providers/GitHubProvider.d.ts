import { AbstractOAuthProvider } from "../AbstractOAuthProvider";
import { OAuthUser } from "../OAuthUser";
export declare class GitHubProvider extends AbstractOAuthProvider {
    getAuthUrl(state: string): string;
    getTokenUrl(): string;
    getUserByToken(token: string): Promise<Record<string, unknown>>;
    mapUserToObject(user: Record<string, unknown>): OAuthUser;
}
