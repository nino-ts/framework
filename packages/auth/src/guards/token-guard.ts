import type { Authenticatable } from '../contracts/authenticatable.ts';
import type { Guard } from '../contracts/guard.ts';
import type { UserProvider } from '../contracts/user-provider.ts';

export class TokenGuard implements Guard {
  protected provider: UserProvider;
  protected request: Request;
  protected inputKey: string;
  protected storageKey: string;
  protected userInstance: Authenticatable | null = null;

  constructor(
    provider: UserProvider,
    request: Request,
    inputKey: string = 'api_token',
    storageKey: string = 'api_token',
  ) {
    this.provider = provider;
    this.request = request;
    this.inputKey = inputKey;
    this.storageKey = storageKey;
  }

  async check(): Promise<boolean> {
    return (await this.user()) !== null;
  }

  async guest(): Promise<boolean> {
    return !(await this.check());
  }

  async user(): Promise<Authenticatable | null> {
    if (this.userInstance) {
      return this.userInstance;
    }

    const token = this.getTokenForRequest();

    if (token) {
      this.userInstance = await this.provider.retrieveByCredentials({
        [this.storageKey]: token,
      });
    }

    return this.userInstance;
  }

  async id(): Promise<string | number | null> {
    const user = await this.user();
    return user ? user.getAuthIdentifier() : null;
  }

  async validate(credentials: Record<string, unknown>): Promise<boolean> {
    if (!credentials[this.inputKey]) {
      return false;
    }

    const user = await this.provider.retrieveByCredentials({
      [this.storageKey]: credentials[this.inputKey],
    });

    return !!user;
  }

  protected getTokenForRequest(): string | null {
    // Check query param
    const url = new URL(this.request.url);
    const queryToken = url.searchParams.get(this.inputKey);
    if (queryToken) {
      return queryToken;
    }

    // Check header (Bearer)
    const header = this.request.headers.get('Authorization');
    if (header?.startsWith('Bearer ')) {
      return header.substring(7);
    }

    // Check input (if body is parsed - tricky with Request object directly)
    // For simplicity, we assume TokenGuard mainly checks headers/query.
    // If we need body, we'd need a request wrapper or parsed body.

    return null;
  }
}
