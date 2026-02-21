import type { Authenticatable } from '@/contracts/authenticatable.ts';
import type { StatefulGuard } from '@/contracts/guard.ts';
import type { SessionInterface } from '@/contracts/session-interface.ts';
import type { UserProvider } from '@/contracts/user-provider.ts';

export class SessionGuard implements StatefulGuard {
  protected name: string;
  protected provider: UserProvider;
  protected session: SessionInterface;
  protected userInstance: Authenticatable | null = null;
  protected loggedOut = false;
  private lastRememberCookie: string | null = null;

  constructor(name: string, provider: UserProvider, session: SessionInterface) {
    this.name = name;
    this.provider = provider;
    this.session = session;
  }

  async check(): Promise<boolean> {
    return (await this.user()) !== null;
  }

  async guest(): Promise<boolean> {
    return !(await this.check());
  }

  async user(rememberCookie?: string): Promise<Authenticatable | null> {
    // Fast path: return cached user instance
    if (this.userInstance && !this.loggedOut) {
      return this.userInstance;
    }

    // If logged out but cookie provided, try auto-login first
    if (this.loggedOut && rememberCookie) {
      const parsed = this.parseRememberCookie(rememberCookie);
      if (parsed) {
        const user = await this.provider.retrieveByToken(parsed.userId, parsed.token);
        if (user) {
          // Valid cookie: regenerate session (auto-login)
          await this.login(user, false); // Don't set new cookie
          return user;
        }
      }
    }

    // If logged out and no valid cookie, return null
    if (this.loggedOut) {
      return null;
    }

    // Try session-based authentication
    const id = this.session.get(this.getName());

    if (id) {
      this.userInstance = await this.provider.retrieveById(id);
    }

    // If no session but cookie provided, validate and auto-login
    if (!this.userInstance && rememberCookie) {
      const parsed = this.parseRememberCookie(rememberCookie);
      if (parsed) {
        const user = await this.provider.retrieveByToken(parsed.userId, parsed.token);
        if (user) {
          // Valid cookie: regenerate session (auto-login)
          await this.login(user, false); // Don't set new cookie
          return user;
        }
      }
    }

    return this.userInstance;
  }

  async id(): Promise<string | number | null> {
    if (this.loggedOut) {
      return null;
    }

    const id = this.session.get(this.getName());
    return id || (this.userInstance ? this.userInstance.getAuthIdentifier() : null);
  }

  async validate(credentials: Record<string, unknown>): Promise<boolean> {
    const user = await this.provider.retrieveByCredentials(credentials);

    if (!user) {
      return false;
    }

    return this.provider.validateCredentials(user, credentials);
  }

  async attempt(credentials: Record<string, unknown>, remember: boolean = false): Promise<boolean> {
    const user = await this.provider.retrieveByCredentials(credentials);

    if (!user) {
      return false;
    }

    if (await this.provider.validateCredentials(user, credentials)) {
      await this.login(user, remember);
      return true;
    }

    return false;
  }

  async login(user: Authenticatable, remember: boolean = false): Promise<void> {
    this.loggedOut = false;
    this.updateSession(user.getAuthIdentifier());
    this.lastRememberCookie = null; // Reset cookie state

    if (remember) {
      const token = crypto.randomUUID();
      await this.provider.updateRememberToken(user, token);
      this.lastRememberCookie = this.buildRememberCookie(user.getAuthIdentifier(), token);
    }

    this.userInstance = user;
  }

  async loginUsingId(id: string | number, remember: boolean = false): Promise<Authenticatable | false> {
    const user = await this.provider.retrieveById(id);

    if (!user) {
      return false;
    }

    await this.login(user, remember);
    return user;
  }

  async logout(): Promise<void> {
    this.session.forget(this.getName());
    this.userInstance = null;
    this.loggedOut = true;
    this.lastRememberCookie = null; // Clear cookie state
  }

  protected updateSession(id: string | number): void {
    this.session.put(this.getName(), id);
    this.session.regenerate();
  }

  protected getName(): string {
    return `login_${this.name}_${Buffer.from(this.constructor.name).toString('hex')}`;
  }

  /**
   * Get the Set-Cookie header value for remember cookie.
   * Returns null if remember=false was used in login().
   *
   * @returns Set-Cookie header value or null
   */
  getRememberCookie(): string | null {
    return this.lastRememberCookie;
  }

  /**
   * Get the Set-Cookie header value to clear remember cookie.
   * Used during logout to expire the cookie.
   *
   * @returns Set-Cookie header value with Max-Age=0
   */
  getClearRememberCookie(): string {
    return 'remember_web_web=; HttpOnly; SameSite=Lax; Max-Age=0; Path=/';
  }

  /**
   * Build Set-Cookie header value for remember cookie.
   *
   * Format: remember_web_web={userId}|{token}; HttpOnly; SameSite=Lax; Max-Age=1209600; Path=/
   *
   * @param userId - User identifier
   * @param token - Remember token (UUID)
   * @returns Set-Cookie header value
   */
  private buildRememberCookie(userId: string | number, token: string): string {
    const value = `${userId}|${token}`;
    const maxAge = 1209600; // 2 weeks in seconds
    return `remember_web_web=${value}; HttpOnly; SameSite=Lax; Max-Age=${maxAge}; Path=/`;
  }

  /**
   * Parse remember cookie value and validate format.
   *
   * Expected format: {userId}|{token}
   * Validates:
   * - Cookie value is string with exactly one pipe separator
   * - Token is valid UUID format
   * - userId is not empty
   *
   * @param value - Cookie value from request
   * @returns Parsed userId and token, or null if invalid
   */
  private parseRememberCookie(value: string): { userId: string; token: string } | null {
    if (!value || typeof value !== 'string') {
      return null;
    }

    const parts = value.split('|');
    if (parts.length !== 2) {
      return null;
    }

    const [userId, token] = parts;

    // Validate userId is not empty
    if (!userId || userId.trim() === '') {
      return null;
    }

    // Validate token is UUID format
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!token || !uuidRegex.test(token)) {
      return null;
    }

    return { token, userId };
  }
}
