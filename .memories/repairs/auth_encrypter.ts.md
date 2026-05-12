# Repair note: framework/packages/auth/src/encryption/encrypter.ts

File: packages/auth/src/encryption/encrypter.ts
Occurrences found: 5 (multiple conflict regions)

Key concerns:
- Differences between Node Buffer/crypto.* APIs and WebCrypto (crypto.subtle/getRandomValues).
- MAC encoding/length-check and timing-safe compare behavior.
- Type-level changes (satisfies AesKeyAlgorithm / HmacImportParams) vs older Buffer-based code.

Suggested action:
- Manual review required. Prefer the code path that uses WebCrypto-safe APIs and includes MAC length checks before timingSafeEqual to avoid RangeError. Keep explicit hex encoding/decoding and clear Buffer.from(..., 'hex') checks. Verify tests run under Bun/Node target.

Notes:
- Running the script `bun run framework/scripts/check-conflict-markers.ts` locally will highlight remaining markers after fixes.
