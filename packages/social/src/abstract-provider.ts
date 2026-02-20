import type { SocialProvider } from './contracts/provider.ts';
import type { SocialUser } from './social-user.ts';

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

export abstract class AbstractProvider implements SocialProvider {
  protected scopes: string[];
  protected config: ProviderConfig;
  protected lastState: string | null = null;
  protected lastCodeVerifier: string | null = null;

  constructor(config: ProviderConfig) {
    this.config = config;
    this.scopes = config.scopes || [];
  }

  abstract getAuthUrl(state: string): string;
  abstract getTokenUrl(): string;
  abstract getUserByToken(token: string): Promise<Record<string, unknown>>;
  abstract mapUserToObject(user: Record<string, unknown>): SocialUser;

  with(scopes: string[]): this {
    this.scopes = scopes;
    return this;
  }

  async redirect(): Promise<Response> {
    const state = this.getState();
    this.lastState = state;

    let url = this.getAuthUrl(state);

    if (this.config.usePkce) {
      this.lastCodeVerifier = this.generateCodeVerifier();
      const challenge = await this.generateCodeChallenge(this.lastCodeVerifier);
      const separator = url.includes('?') ? '&' : '?';
      url += `${separator}code_challenge=${encodeURIComponent(challenge)}&code_challenge_method=S256`;
    }

    return new Response(null, {
      headers: {
        Location: url,
      },
      status: 302,
    });
  }

  async user(request: Request): Promise<SocialUser> {
    const url = new URL(request.url);
    const code = url.searchParams.get('code');

    if (!code) {
      throw new Error('No authorization code found in request.');
    }

    const returnedState = url.searchParams.get('state');
    if (this.lastState && returnedState !== this.lastState) {
      throw new Error('Invalid state parameter. Possible CSRF attack.');
    }

    const response = await this.getAccessTokenResponse(code);
    const rawUser = await this.getUserByToken(response.access_token);

    const socialUser = this.mapUserToObject(rawUser);

    socialUser.token = response.access_token;
    socialUser.refreshToken = response.refresh_token || null;
    socialUser.expiresIn = response.expires_in || null;

    this.lastState = null;
    this.lastCodeVerifier = null;

    return socialUser;
  }

  protected async getAccessTokenResponse(code: string): Promise<AccessTokenResponse> {
    const body: Record<string, string> = {
      client_id: this.config.clientId,
      client_secret: this.config.clientSecret,
      code: code,
      redirect_uri: this.config.redirectUri,
    };

    if (this.config.usePkce && this.lastCodeVerifier) {
      body.code_verifier = this.lastCodeVerifier;
    }

    const response = await fetch(this.getTokenUrl(), {
      body: JSON.stringify(body),
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      method: 'POST',
    });

    return (await response.json()) as AccessTokenResponse;
  }

  protected getState(): string {
    return crypto.randomUUID();
  }

  protected generateCodeVerifier(): string {
    const array = new Uint8Array(32);
    crypto.getRandomValues(array);
    return this.base64UrlEncode(array);
  }

  protected async generateCodeChallenge(verifier: string): Promise<string> {
    const encoder = new TextEncoder();
    const data = encoder.encode(verifier);
    const hash = await crypto.subtle.digest('SHA-256', data);
    return this.base64UrlEncode(new Uint8Array(hash));
  }

  protected base64UrlEncode(buffer: Uint8Array): string {
    let binary = '';
    for (const byte of buffer) {
      binary += String.fromCharCode(byte);
    }
    return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
  }

  protected formatScopes(scopes: string[], separator: string): string {
    return scopes.join(separator);
  }
}
