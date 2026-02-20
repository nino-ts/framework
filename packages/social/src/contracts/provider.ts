import type { SocialUser } from './social-user.ts';

export interface SocialProvider {
  /**
   * Redirect the user to the authentication page.
   */
  redirect(): Promise<Response>;

  /**
   * Get the User instance for the authenticated user.
   */
  user(request: Request): Promise<SocialUser>;

  /**
   * Set the scopes for the provider.
   */
  with(scopes: string[]): this;
}
