import { AbstractProvider } from '@/abstract-provider.ts';
import { SocialUser } from '@/social-user.ts';

export class GitHubProvider extends AbstractProvider {
  getAuthUrl(state: string): string {
    const scopes = this.formatScopes(this.scopes, ' ');
    return `https://github.com/login/oauth/authorize?client_id=${this.config.clientId}&redirect_uri=${encodeURIComponent(this.config.redirectUri)}&scope=${encodeURIComponent(scopes)}&state=${state}`;
  }

  getTokenUrl(): string {
    return 'https://github.com/login/oauth/access_token';
  }

  async getUserByToken(token: string): Promise<Record<string, unknown>> {
    const response = await fetch('https://api.github.com/user', {
      headers: {
        Accept: 'application/vnd.github.v3+json',
        Authorization: `Bearer ${token}`,
      },
    });

    const user = (await response.json()) as Record<string, unknown>;

    if (!user.email) {
      const emailResponse = await fetch('https://api.github.com/user/emails', {
        headers: {
          Accept: 'application/vnd.github.v3+json',
          Authorization: `Bearer ${token}`,
        },
      });
      const emails = (await emailResponse.json()) as Array<{
        email: string;
        primary: boolean;
        verified: boolean;
      }>;
      const primaryEmail = emails.find((e) => e.primary && e.verified);
      if (primaryEmail) {
        user.email = primaryEmail.email;
      }
    }

    return user;
  }

  mapUserToObject(user: Record<string, unknown>): SocialUser {
    return new SocialUser(
      String(user.id),
      (user.name as string) || (user.login as string),
      user.email as string,
      user.avatar_url as string,
      '',
      null,
      null,
      user,
    );
  }
}
