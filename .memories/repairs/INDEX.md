# Repairs index: Git merge marker triage

Generated: 2026-05-12T01:02:57Z

Total files with markers: 4

Files:
- framework/bin/nino.ts -> .memories/repairs/framework_bin_nino.ts.md
- packages/auth/src/encryption/encrypter.ts -> .memories/repairs/auth_encrypter.ts.md
- packages/auth/src/providers/database-provider.ts -> .memories/repairs/auth_database-provider.ts.md
- packages/auth/tests/unit/database-provider.test.ts -> .memories/repairs/auth_database-provider.test.md

Next steps:
- Manually review each file and resolve conflicts according to suggested actions.
- After resolving, run `bun run framework/scripts/check-conflict-markers.ts` and `bun run framework/scripts/fix-git-markers.ts -- --dry-run` to verify no remaining markers.
- Consider targeted automatic apply rules for trivial cases (e.g., whitespace-only ranges) in future iteration.
