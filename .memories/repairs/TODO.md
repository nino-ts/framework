Triaging tasks for merge-marker remediation

- [ ] Review framework/bin/nino.ts per .memories/repairs/framework_bin_nino.ts.md (prefer HEAD/local+dist bootstrap)
- [ ] Review packages/auth/src/encryption/encrypter.ts per .memories/repairs/auth_encrypter.ts.md (prefer WebCrypto/MAC checks)
- [ ] Review packages/auth/src/providers/database-provider.ts per .memories/repairs/auth_database-provider.ts.md (keep allow-list security fix)
- [ ] Run unit tests and fix failing tests after manual merges
- [ ] Re-run `bun run framework/scripts/fix-git-markers.ts -- --dry-run` and confirm zero markers
- [ ] When ready, push resolved commits to fix/git-marker-cleanup and update PR #8

Notes: Issues in upstream repo have been disabled so triage is tracked here under .memories/repairs.
