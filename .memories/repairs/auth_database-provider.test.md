# Repair note: framework/packages/auth/tests/unit/database-provider.test.ts

File: packages/auth/tests/unit/database-provider.test.ts
Occurrences found: 1

Snippet:

```ts
<<<<<<< HEAD
test("should reject unsupported credential fields", async () => {
    await expect(
        provider.retrieveByCredentials({
            email: "test@example.com",
            role: "admin",
        }),
    ).rejects.toThrow("Unsupported credential field: role");
});
=======
	connection.query.mockResolvedValue([]);
```
```

Suggested action:
- Keep/restore the HEAD test additions that assert unsupported credential fields are rejected. These tests verify the security behavior introduced in the provider and should accompany the provider change.

Confidence: high — tests should pass once provider changes are settled.
