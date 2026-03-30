---
created_at: 2026-03-28T00:00:00Z
updated_at: 2026-03-28T00:00:00Z
utc_datetime_prefix: 2026-03-28T00-00-00Z
status: completed
warning: UTC canônico indisponível (worldtimeapi.org falhou) - usando timestamp fornecido
---

# Auth Packages Unification

**Date:** 2026-03-28
**Status:** ✅ Completed

## Summary
Unificados 5 pacotes de autenticação em um único `@ninots/auth`:
- `@ninots/auth` (core)
- `@ninots/jwt` → movido para auth/jwt
- `@ninots/encryption` → movido para auth/encryption
- `@ninots/social` → movido para auth/social
- `@ninots/session` → movido para auth/session

## Motivation
- **Out-of-the-box**: Tudo que precisa para auth em um único pacote
- **Batteries-included**: Session, JWT, Social, Encryption inclusos
- **Plug-and-play**: Configuração única centralizada
- **Zero breaking changes**: Backward compatible via barrel exports

## Structure
```
framework/packages/auth/
├── src/
│   ├── core/           # AuthManager
│   ├── guards/         # Session, Token, Request
│   ├── providers/      # Database
│   ├── hashing/        # Bcrypt, Argon2
│   ├── session/        # Session + Drivers
│   ├── jwt/            # JwtDecoder + JwksCache
│   ├── social/         # SocialManager + Providers
│   ├── encryption/     # WebEncrypter
│   └── middleware/     # authenticate, guest
└── tests/              # 266 testes
```

## Results
- **Tests:** 266 pass, 0 fail
- **Type Safety:** Zero `any` types
- **Documentation:** MIGRATION.md + README.md atualizado
- **Deleted Packages:** jwt, encryption, social, session

## API Unificada
```typescript
// Antes: Múltiplos imports
import { SessionManager } from '@ninots/session';
import { JwtDecoder } from '@ninots/jwt';
import { SocialManager } from '@ninots/social';

// Depois: Single import
import { SessionManager, JwtDecoder, SocialManager } from '@ninots/auth';
```

## Files Created
- `framework/packages/auth/MIGRATION.md`
- `framework/packages/auth/README.md` (atualizado)

## Validation
- `bun test packages/auth` → 266 pass
- `bun run verify:no-any` → ✓ Zero any types
