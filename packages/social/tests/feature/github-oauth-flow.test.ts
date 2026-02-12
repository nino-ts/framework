/**
 * GitHub OAuth Flow — Integration Tests
 *
 * End-to-end testing of the OAuth2 authorization code flow with PKCE.
 * Tests the complete cycle: redirect → callback → token exchange → user profile fetch.
 *
 * Test pattern: Mock fetch() to intercept GitHub API calls, use same provider instance
 * for redirect() and user() to validate state persistence.
 */

import { afterEach, beforeEach, describe, expect, it } from 'bun:test';
import type { ProviderConfig } from '@/abstract-provider';
import { GitHubProvider } from '@/providers/github-provider';

/**
 * Create a GitHub OAuth fixture with test configuration.
 */
function createGitHubOAuthFixture() {
    const config: ProviderConfig = {
        clientId: 'test_github_client_id',
        clientSecret: 'test_github_client_secret',
        redirectUri: 'http://localhost:3000/auth/github/callback',
        scopes: ['user:email', 'read:user'],
        usePkce: true,
    };

    const provider = new GitHubProvider(config);

    /**
     * Simulate OAuth callback request from GitHub.
     *
     * @param code - Authorization code from GitHub
     * @param state - State parameter (CSRF token)
     */
    function createCallbackRequest(code: string, state: string): Request {
        const url = `${config.redirectUri}?code=${code}&state=${state}`;
        return new Request(url);
    }

    /**
     * Extract state parameter from redirect URL.
     *
     * @param redirectUrl - The OAuth authorization URL
     */
    function extractStateFromUrl(redirectUrl: string): string {
        const url = new URL(redirectUrl);
        const state = url.searchParams.get('state');
        if (!state) {
            throw new Error('No state found in redirect URL');
        }
        return state;
    }

    /**
     * Extract code_challenge from redirect URL.
     *
     * @param redirectUrl - The OAuth authorization URL
     */
    function extractCodeChallengeFromUrl(redirectUrl: string): string | null {
        const url = new URL(redirectUrl);
        return url.searchParams.get('code_challenge');
    }

    return {
        config,
        createCallbackRequest,
        extractCodeChallengeFromUrl,
        extractStateFromUrl,
        provider,
    };
}

/**
 * Mock fetch implementation for GitHub OAuth endpoints.
 *
 * Intercepts:
 * - POST https://github.com/login/oauth/access_token (token exchange)
 * - GET https://api.github.com/user (user profile)
 */
function createMockFetch() {
    return async (urlOrRequest: RequestInfo | URL, init?: RequestInit): Promise<Response> => {
        const url = typeof urlOrRequest === 'string' ? urlOrRequest : urlOrRequest.toString();

        // Token exchange endpoint
        if (url.includes('github.com/login/oauth/access_token')) {
            const body = JSON.parse((init?.body as string) || '{}');

            // Validate PKCE code_verifier if present
            if (body.code_verifier) {
                // In real scenario, GitHub validates code_verifier against code_challenge
                // For tests, we just check it's present
                if (!body.code_verifier.startsWith('mock_')) {
                    // Accept any verifier for now (AbstractProvider generates real base64url)
                }
            }

            return new Response(
                JSON.stringify({
                    access_token: 'gho_mock_access_token_abcd1234',
                    expires_in: 28800,
                    refresh_token: 'ghr_mock_refresh_token_xyz789',
                    scope: 'user:email,read:user',
                    token_type: 'bearer',
                }),
                {
                    headers: { 'Content-Type': 'application/json' },
                    status: 200,
                }
            );
        }

        // User profile endpoint
        if (url.includes('api.github.com/user')) {
            // Check Authorization header
            const authHeader = init?.headers ? (init.headers as Record<string, string>).Authorization : undefined;
            if (!authHeader || !authHeader.startsWith('Bearer ')) {
                return new Response(JSON.stringify({ message: 'Requires authentication' }), {
                    headers: { 'Content-Type': 'application/json' },
                    status: 401,
                });
            }

            return new Response(
                JSON.stringify({
                    avatar_url: 'https://avatars.githubusercontent.com/u/12345678',
                    bio: 'GitHub mascot',
                    email: 'octocat@github.com',
                    id: 12345678,
                    location: 'San Francisco',
                    login: 'octocat',
                    name: 'The Octocat',
                }),
                {
                    headers: { 'Content-Type': 'application/json' },
                    status: 200,
                }
            );
        }

        // Unexpected endpoint
        throw new Error(`Unexpected fetch to: ${url}`);
    };
}

describe('GitHub OAuth Flow — Integration Tests', () => {
    let originalFetch: typeof fetch;

    beforeEach(() => {
        originalFetch = global.fetch;
        global.fetch = createMockFetch() as typeof fetch;
    });

    afterEach(() => {
        global.fetch = originalFetch;
    });

    describe('Authorization redirect', () => {
        it('should generate GitHub authorize URL with state parameter', async () => {
            const { provider } = createGitHubOAuthFixture();

            const response = await provider.redirect();

            expect(response.status).toBe(302);
            const location = response.headers.get('Location');
            expect(location).toBeDefined();
            expect(location).toContain('https://github.com/login/oauth/authorize');
            expect(location).toContain('client_id=test_github_client_id');
            expect(location).toContain('redirect_uri=http%3A%2F%2Flocalhost%3A3000%2Fauth%2Fgithub%2Fcallback');
            expect(location).toContain('state=');
        });

        it('should include PKCE code_challenge when usePkce=true', async () => {
            const { provider, extractCodeChallengeFromUrl } = createGitHubOAuthFixture();

            const response = await provider.redirect();
            const location = response.headers.get('Location')!;

            const codeChallenge = extractCodeChallengeFromUrl(location);
            expect(codeChallenge).not.toBeNull();
            expect(location).toContain('code_challenge_method=S256');
        });

        it('should include requested scopes in authorize URL', async () => {
            const { provider } = createGitHubOAuthFixture();

            const response = await provider.redirect();
            const location = response.headers.get('Location')!;

            expect(location).toContain('scope=user%3Aemail%20read%3Auser');
        });

        it('should generate different state values on each redirect', async () => {
            const { provider } = createGitHubOAuthFixture();

            const response1 = await provider.redirect();
            const location1 = response1.headers.get('Location')!;
            const state1 = new URL(location1).searchParams.get('state');

            // Create new provider instance for independent redirect
            const { provider: provider2 } = createGitHubOAuthFixture();
            const response2 = await provider2.redirect();
            const location2 = response2.headers.get('Location')!;
            const state2 = new URL(location2).searchParams.get('state');

            expect(state1).not.toBe(state2);
        });
    });

    describe('Token exchange and user fetch', () => {
        it('should exchange authorization code for access token', async () => {
            const { provider, createCallbackRequest, extractStateFromUrl } = createGitHubOAuthFixture();

            // Step 1: Redirect
            const redirectResponse = await provider.redirect();
            const location = redirectResponse.headers.get('Location')!;
            const state = extractStateFromUrl(location);

            // Step 2: Callback with code
            const callbackRequest = createCallbackRequest('mock_auth_code_123', state);
            const socialUser = await provider.user(callbackRequest);

            // Verify token was exchanged and user fetched
            expect(socialUser.token).toBe('gho_mock_access_token_abcd1234');
        });

        it('should fetch user profile with access token', async () => {
            const { provider, createCallbackRequest, extractStateFromUrl } = createGitHubOAuthFixture();

            const redirectResponse = await provider.redirect();
            const location = redirectResponse.headers.get('Location')!;
            const state = extractStateFromUrl(location);

            const callbackRequest = createCallbackRequest('mock_auth_code_456', state);
            const socialUser = await provider.user(callbackRequest);

            expect(socialUser.id).toBe('12345678');
            expect(socialUser.name).toBe('The Octocat');
            expect(socialUser.email).toBe('octocat@github.com');
            expect(socialUser.avatar).toBe('https://avatars.githubusercontent.com/u/12345678');
        });

        it('should populate SocialUser with token and refresh token', async () => {
            const { provider, createCallbackRequest, extractStateFromUrl } = createGitHubOAuthFixture();

            const redirectResponse = await provider.redirect();
            const location = redirectResponse.headers.get('Location')!;
            const state = extractStateFromUrl(location);

            const callbackRequest = createCallbackRequest('mock_auth_code_789', state);
            const socialUser = await provider.user(callbackRequest);

            expect(socialUser.token).toBe('gho_mock_access_token_abcd1234');
            expect(socialUser.refreshToken).toBe('ghr_mock_refresh_token_xyz789');
            expect(socialUser.expiresIn).toBe(28800);
        });

        it('should send PKCE code_verifier in token exchange request', async () => {
            const { provider, createCallbackRequest, extractStateFromUrl } = createGitHubOAuthFixture();

            let tokenRequestBody: Record<string, unknown> | null = null;

            // Override mock to capture request body
            const mockFetchWithCapture = async (
                urlOrRequest: RequestInfo | URL,
                init?: RequestInit
            ): Promise<Response> => {
                const url = typeof urlOrRequest === 'string' ? urlOrRequest : urlOrRequest.toString();

                if (url.includes('github.com/login/oauth/access_token')) {
                    tokenRequestBody = JSON.parse((init?.body as string) || '{}');

                    return new Response(
                        JSON.stringify({
                            access_token: 'gho_test_token',
                            token_type: 'bearer',
                        }),
                        { headers: { 'Content-Type': 'application/json' }, status: 200 }
                    );
                }

                if (url.includes('api.github.com/user')) {
                    return new Response(JSON.stringify({ email: 'test@example.com', id: 999, login: 'test' }), {
                        headers: { 'Content-Type': 'application/json' },
                        status: 200,
                    });
                }

                throw new Error(`Unexpected fetch to: ${url}`);
            };

            global.fetch = mockFetchWithCapture as typeof fetch;

            const redirectResponse = await provider.redirect();
            const location = redirectResponse.headers.get('Location')!;
            const state = extractStateFromUrl(location);

            const callbackRequest = createCallbackRequest('mock_code', state);
            await provider.user(callbackRequest);

            expect(tokenRequestBody).not.toBeNull();
            expect(tokenRequestBody?.code_verifier).toBeDefined();
            expect(typeof tokenRequestBody?.code_verifier).toBe('string');
        });
    });

    describe('State validation (CSRF protection)', () => {
        it('should validate state parameter matches original', async () => {
            const { provider, extractStateFromUrl } = createGitHubOAuthFixture();

            const redirectResponse = await provider.redirect();
            const location = redirectResponse.headers.get('Location')!;
            const state = extractStateFromUrl(location);

            // Valid state
            const validRequest = new Request(`${redirectResponse.headers.get('Location')}?code=abc&state=${state}`);
            const callbackUrl = new URL(validRequest.url);
            const validCallbackRequest = new Request(
                `http://localhost:3000/auth/github/callback?code=${callbackUrl.searchParams.get('code') || 'abc'}&state=${state}`
            );

            await expect(provider.user(validCallbackRequest)).resolves.toBeDefined();
        });

        it('should throw error when state parameter is invalid', async () => {
            const { provider, createCallbackRequest, extractStateFromUrl } = createGitHubOAuthFixture();

            const redirectResponse = await provider.redirect();
            const location = redirectResponse.headers.get('Location')!;
            extractStateFromUrl(location); // Original state generated

            // Callback with DIFFERENT state
            const invalidRequest = createCallbackRequest('mock_code', 'invalid_state_xyz');

            await expect(provider.user(invalidRequest)).rejects.toThrow('Invalid state parameter');
        });

        it('should clear state after successful user() call', async () => {
            const { provider, createCallbackRequest, extractStateFromUrl } = createGitHubOAuthFixture();

            const redirectResponse = await provider.redirect();
            const location = redirectResponse.headers.get('Location')!;
            const state = extractStateFromUrl(location);

            // First call succeeds
            const callbackRequest1 = createCallbackRequest('code_first', state);
            await provider.user(callbackRequest1);

            // After state is cleared, user() should work without validation
            // (allows using user() without redirect(), e.g., when state stored in session)
            const callbackRequest2 = createCallbackRequest('code_second', 'any_state');
            await expect(provider.user(callbackRequest2)).resolves.toBeDefined();
        });
    });

    describe('Multiple OAuth flows', () => {
        it('should support multiple independent OAuth flows', async () => {
            const {
                provider: provider1,
                createCallbackRequest: createCallback1,
                extractStateFromUrl,
            } = createGitHubOAuthFixture();
            const { provider: provider2, createCallbackRequest: createCallback2 } = createGitHubOAuthFixture();

            // Flow 1
            const redirect1 = await provider1.redirect();
            const location1 = redirect1.headers.get('Location')!;
            const state1 = extractStateFromUrl(location1);

            // Flow 2 (different provider instance)
            const redirect2 = await provider2.redirect();
            const location2 = redirect2.headers.get('Location')!;
            const state2 = extractStateFromUrl(location2);

            // Complete both flows independently
            const user1 = await provider1.user(createCallback1('code1', state1));
            const user2 = await provider2.user(createCallback2('code2', state2));

            expect(user1.id).toBe('12345678');
            expect(user2.id).toBe('12345678'); // Same mock user, different flows
        });
    });
});
