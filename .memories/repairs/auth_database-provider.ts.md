# Repair note: framework/packages/auth/src/providers/database-provider.ts

File: packages/auth/src/providers/database-provider.ts
Occurrences found: 2

Snippet (conflict shows an introduced allow-list for credential columns vs older code):

```ts
<<<<<<< HEAD
private readonly allowedCredentialColumns: Record<string, string> = {
    email: "email",
    id: "id",
    name: "name",
    username: "username",
};
=======
	private readonly table: string;
	private readonly userModel: new (
		data: Record<string, unknown>,
	) => Authenticatable;
>>>>>>> 5dd5d88
```

Suggested action:
- Prefer the HEAD changes that add `allowedCredentialColumns` and strict checks in `retrieveByCredentials` to prevent SQL identifier injection. Keep the allow-list mapping and the explicit throw on unsupported credential fields. Update unit tests accordingly.

Actionability: high — these are security-related fixes and should be prioritized.
