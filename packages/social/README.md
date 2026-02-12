# @ninots/social

OAuth providers for Bun (Socialite-like).

## Overview
`@ninots/social` provides OAuth2 providers for Bun in a Socialite-like style.

- Built-in GitHub provider
- Core OAuth2 flow implemented in `AbstractProvider`
- Optional PKCE support for public clients
- State validation to mitigate CSRF
- `SocialManager` for driver resolution and custom extensions

## Installation
```bash
bun install @ninots/social
```

## Providers
- GitHubProvider

You can add custom providers via `SocialManager.extend()`.

## Quick Start
```typescript
import { SocialManager } from '@ninots/social';

const social = new SocialManager({
	github: {
		clientId: process.env.GITHUB_CLIENT_ID!,
		clientSecret: process.env.GITHUB_CLIENT_SECRET!,
		redirectUri: 'https://app.example.com/auth/github/callback',
		scopes: ['read:user', 'user:email'],
		usePkce: true,
	},
});

// Step 1: Redirect user to GitHub
export async function loginWithGitHub(): Promise<Response> {
	return social.driver('github').redirect();
}

// Step 2: Handle callback
export async function handleGitHubCallback(request: Request) {
	const socialUser = await social.driver('github').user(request);

	// Application glue: map to your user model
	const user = await User.firstOrCreate({ email: socialUser.getEmail() });
	await Auth.login(user);

	return new Response('Logged in');
}
```

## OAuth Flow
The provider follows a standard OAuth2 flow:

1. `redirect()` builds the authorize URL and returns a 302 Response
2. User authorizes the app and is redirected back with `code` and `state`
3. `user(request)` exchanges `code` for an access token
4. Provider fetches user info and maps it to `SocialUser`

For full details, see [docs/oauth2-flow.md](./docs/oauth2-flow.md).

## PKCE and State
PKCE is optional and controlled by `usePkce` in `ProviderConfig`.

- When enabled, `redirect()` appends `code_challenge` and `code_challenge_method=S256`
- `user()` sends the `code_verifier` during token exchange

State handling:

- `redirect()` generates a `state` value and stores it in memory on the provider instance
- `user()` checks the `state` parameter only if a stored state exists

If you want strict state validation across distributed servers, store and validate state in your app code before calling `user()`.

See [docs/security.md](./docs/security.md) for guidance.

## Testing
```bash
bun test packages/social/
```

## Notes
- GitHub email: If `user.email` is missing, the provider fetches `/user/emails` and uses the primary verified address
- Use the `user:email` scope if you need access to private email addresses
- `SocialUser` exposes raw provider data via `getRaw()`
- Tokens are assigned to `SocialUser` (`token`, `refreshToken`, `expiresIn`) during `user()`
- This package is standalone and does not import `@ninots/auth`
