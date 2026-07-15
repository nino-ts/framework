import type { OAuthProvider } from "./contracts/OAuthProvider";
import type { OAuthUser } from "./OAuthUser";
export interface ProviderConfig {
    clientId: string;
    clientSecret: string;
    redirectUri: string;
    scopes?: string[];
    usePkce?: boolean;
}
export interface AccessTokenResponse {
    access_token: string;
    token_type?: string;
    refresh_token?: string;
    expires_in?: number;
    scope?: string;
}
export declare abstract class AbstractOAuthProvider implements OAuthProvider {
    protected scopes: string[];
    protected config: ProviderConfig;
    protected lastState: string | null;
    protected lastCodeVerifier: string | null;
    constructor(config: ProviderConfig);
    abstract getAuthUrl(state: string): string;
    abstract getTokenUrl(): string;
    abstract getUserByToken(token: string): Promise<Record<string, unknown>>;
    abstract mapUserToObject(user: Record<string, unknown>): OAuthUser;
    with(scopes: string[]): this;
    redirect(): Promise<Response>;
    user(request: Request): Promise<OAuthUser>;
    protected getAccessTokenResponse(code: string): Promise<AccessTokenResponse>;
    protected getState(): string;
    protected generateCodeVerifier(): string;
    protected generateCodeChallenge(verifier: string): Promise<string>;
    protected base64UrlEncode(buffer: Uint8Array): string;
    protected formatScopes(scopes: string[], separator: string): string;
}
