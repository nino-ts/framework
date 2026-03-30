import type { OAuthUser } from '@/oauth/contracts/OAuthUser.ts';

export interface OAuthProvider {
  /**
   * Redirect the user to the authentication page.
   */
  redirect(): Promise<Response>;

  /**
   * Get the User instance for the authenticated user.
   */
  user(request: Request): Promise<OAuthUser>;

  /**
   * Set the scopes for the provider.
   */
  with(scopes: string[]): this;
}
