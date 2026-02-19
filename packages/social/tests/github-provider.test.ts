import { beforeEach, describe, expect, it } from 'bun:test';
import type { ProviderConfig } from '@/abstract-provider';
import { GitHubProvider } from '@/providers/github-provider';
import { SocialUser } from '@/social-user';

describe('GitHubProvider', () => {
    let provider: GitHubProvider;
    let config: ProviderConfig;

    beforeEach(() => {
        config = {
            clientId: 'test_client_id',
            clientSecret: 'test_client_secret',
            redirectUri: 'http://localhost:3000/callback',
            scopes: ['read:user'],
        };
        provider = new GitHubProvider(config);
    });

    describe('initialization', () => {
        it('should store config', () => {
            expect((provider as any).config).toEqual(config);
        });

        it('should initialize with provided scopes', () => {
            expect((provider as any).scopes).toEqual(['read:user']);
        });

        it('should initialize with empty scopes if not provided', () => {
            const configNoScopes: ProviderConfig = { ...config, scopes: undefined };
            const p = new GitHubProvider(configNoScopes);
            expect((p as any).scopes).toEqual([]);
        });
    });

    describe('getAuthUrl()', () => {
        it('should generate GitHub authorization URL', () => {
            const url = provider.getAuthUrl('test_state');

            expect(url).toContain('https://github.com/login/oauth/authorize');
            expect(url).toContain('client_id=test_client_id');
            expect(url).toContain('state=test_state');
            expect(url).toContain('redirect_uri=');
        });

        it('should include properly encoded redirect URI', () => {
            const url = provider.getAuthUrl('state');
            expect(url).toContain(encodeURIComponent('http://localhost:3000/callback'));
        });

        it('should include scopes separated by space', () => {
            provider.with(['user', 'repo']);
            const url = provider.getAuthUrl('state');

            expect(url).toContain('scope=');
            // Space between scopes
            expect(url).toContain(encodeURIComponent('user repo'));
        });

        it('should handle empty scopes', () => {
            provider.with([]);
            const url = provider.getAuthUrl('state');
            expect(url).toContain('scope=');
        });
    });

    describe('getTokenUrl()', () => {
        it('should return GitHub token endpoint', () => {
            expect(provider.getTokenUrl()).toBe('https://github.com/login/oauth/access_token');
        });
    });

    describe('mapUserToObject()', () => {
        it('should map GitHub user data to SocialUser', () => {
            const githubUser = {
                avatar_url: 'https://avatars.githubusercontent.com/u/1?v=4',
                email: 'octocat@github.com',
                id: 12345,
                login: 'octocat',
                name: 'The Octocat',
            };

            const socialUser = provider.mapUserToObject(githubUser);

            expect(socialUser).toBeInstanceOf(SocialUser);
            expect(socialUser.getId()).toBe('12345');
            expect(socialUser.getName()).toBe('The Octocat');
            expect(socialUser.getEmail()).toBe('octocat@github.com');
            expect(socialUser.getAvatar()).toBe('https://avatars.githubusercontent.com/u/1?v=4');
        });

        it('should fallback to login when name is not provided', () => {
            const githubUser = {
                avatar_url: 'avatar',
                id: 67890,
                login: 'github_user',
            };

            const socialUser = provider.mapUserToObject(githubUser);

            expect(socialUser.getName()).toBe('github_user');
        });

        it('should store entire GitHub object as raw data', () => {
            const githubUser = {
                avatar_url: 'avatar',
                company: 'Test Inc',
                email: 'test@example.com',
                id: 123,
                login: 'test',
                name: 'Test',
            };

            const socialUser = provider.mapUserToObject(githubUser);

            expect(socialUser.getRaw()).toEqual(githubUser);
        });

        it('should set empty token (populated by parent)', () => {
            const githubUser = { avatar_url: 'avatar', email: 'test@example.com', id: 1, login: 'test' };
            const socialUser = provider.mapUserToObject(githubUser);

            expect(socialUser.getToken()).toBe('');
        });

        it('should set null for refreshToken and expiresIn', () => {
            const githubUser = { avatar_url: 'avatar', email: 'test@example.com', id: 1, login: 'test' };
            const socialUser = provider.mapUserToObject(githubUser);

            expect(socialUser.getRefreshToken()).toBeNull();
            expect(socialUser.getExpiresIn()).toBeNull();
        });
    });

    describe('with() method (from AbstractProvider)', () => {
        it('should allow setting custom scopes', () => {
            const result = provider.with(['admin:repo_hook', 'gist']);

            expect(result).toBe(provider);
            expect((provider as any).scopes).toEqual(['admin:repo_hook', 'gist']);
        });

        it('should allow chaining', () => {
            const result = provider.with(['scope1']).with(['scope2']);

            expect(result).toBe(provider);
            expect((provider as any).scopes).toEqual(['scope2']);
        });
    });
});
