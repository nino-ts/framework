# ninoTS Framework Roadmap

> ninoTS is a zero-runtime-dependency web framework for Bun + TypeScript 6.x.
> **Current release:** [0.8.0](CHANGELOG.md) (2026-07-16)

## v0.4 — Core Packages & Support (Shipped)

Shipped in **0.4.0** — see [CHANGELOG.md](CHANGELOG.md) for full notes.

- [x] 16 `@ninots/*` packages (auth, cache, config, console, container, filesystem, foundation, http, logger, middleware, orm, routing, session, support, validation, websocket)
- [x] Meta-package `@ninots/framework` re-exports curated surface
- [x] `@ninots/support` — Arr, Collection, Str, Exception
- [x] HTTP Request/Response helpers (`@ninots/http`)
- [x] Foundation — Application lifecycle, graceful shutdown, metrics hooks
- [x] Routing — fluent Router + `loadRoutes` via `Bun.FileSystemRouter`
- [x] Middleware — Pipeline + named MiddlewareStack
- [x] Validation fluent API + i18n
- [x] ORM core (`Bun.sql`), Auth, Session, Cache, Filesystem, Logger, WebSocket (partial)
- [x] Wire router + pipeline in foundation entry (`wireCoreServices`, `createHttpHandler`)
- [x] Typed `createServeOptions` for `Bun.serve`
- [x] `nino` CLI — `help`, `version`, `dev`, `start`, `build`
- [x] Starter `ninots/` serves real routes via wired router
- [x] Boot / CI gate for package tests

## v0.5 — Ecosystem & DX (Shipped)

Shipped through **0.5.0** (Sprints 2–5) — see [CHANGELOG.md](CHANGELOG.md).

- [x] `@ninots/events` — sync job / event bus
- [x] `@ninots/view` — HTML/TSX render, layouts, `csrfField()` helper
- [x] CSRF middleware via native `Bun.CSRF` (`verifyCsrf`)
- [x] ORM Factory API, Seeder runner, `nino migrate` (run-only)
- [x] TS hygiene — no `.ts` import extensions, ban `any`, zero lint suppressions
- [x] Publish `@ninots/framework` **0.5.0** (npm + JSR)

## v0.6 — CLI Generators (Shipped)

Shipped in **0.6.0** / patch **0.6.1** (Sprint 6) — see [CHANGELOG.md](CHANGELOG.md).

- [x] Root `nino` bin included in npm publish `files`
- [x] `nino make:controller` (CSRF-aware `--resource` routes + companion view)
- [x] `nino make:model` (optional companion migration)
- [x] `nino make:migration`
- [x] `nino make:view`
- [x] Exported `Make*Command` classes for starter `bootstrap/cli.ts` registration
- [x] Patch **0.6.1** — insert `--resource` imports at top-level (Fixes #42)

## v0.7 — Migrate Lifecycle (Shipped)

Shipped in **0.7.0** (Sprint 7) — see [CHANGELOG.md](CHANGELOG.md).

- [x] Migrator `rollback` / `reset` / `refresh` (last batch / `--step`)
- [x] `nino migrate:rollback`
- [x] `nino migrate:refresh` (optional `--seed`)
- [x] Publish `@ninots/framework` **0.7.0** (npm + JSR)

## v0.8 — make:module (Current — Shipped)

Shipped in **0.8.0** (Sprint 8) — see [CHANGELOG.md](CHANGELOG.md).

- [x] `nino make:module` — Provider + `routes.ts` + providers append
- [x] Flags `--controller` / `--model` / `--migration` / `--all` / `--force`
- [x] Module PathResolver + stubs under `app/Modules/`
- [x] Publish `@ninots/framework` **0.8.0** (npm + JSR)

## v0.9+ — Next

Pending work (Consilium / sprint backlog — not yet scheduled as a single release):

- [ ] Wide Events logging in `@ninots/logger`
- [ ] Build-time typed route registry
- [ ] Docker starter kit (compose)
- [ ] Structured WebSockets with fallback / polish

## v1.0 — Production Ready

- [x] `@ninots/events` + sync queue slice
- [x] View surface (HTML/TSX — no Blade-lite)
- [x] Migrate lifecycle (`rollback` / `refresh`)
- [ ] Distributed cache/session (incl. `Bun.redis` facade)
- [ ] `@ninots/mail` / notifications
- [ ] `@ninots/testing` HTTP helpers
- [ ] E2E via `Bun.WebView`
- [ ] NPM + JSR publish pipeline stable
- [ ] Security audit + benchmarks

## Known gaps (parity)

See workspace `docs/parity/` (e.g. `illuminate-to-ninots.md`) for Illuminate → `@ninots/*` coverage.
Encryption restoration / WebEncrypter follow-up: [framework#5](https://github.com/nino-ts/framework/issues/5).
Queue async, Mail, Redis facade, and testing helpers remain open toward v1.0.
