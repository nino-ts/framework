# ninoTS Framework Roadmap

> ninoTS is a zero-runtime-dependency web framework for Bun + TypeScript 6.x.
> **Current release:** [0.4.0](CHANGELOG.md) (2026-05-13)

## v0.4 — Core Packages & Support (Current)

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

### Sprint 1 (in progress on `feature/sprint-1`)

- [x] Wire router + pipeline in foundation entry (`wireCoreServices`, `createHttpHandler`)
- [x] Typed `createServeOptions` for `Bun.serve`
- [x] `nino` CLI — `help`, `version`, `dev`, `start`, `build`
- [ ] Starter `ninots/` serves real route via wired router (health / api)
- [ ] Boot integration tests in CI gate

## v0.5 — Ecosystem & DX

- [ ] Advanced CLI generators (`nino make:module`, `nino make:model`, `nino make:route`)
- [ ] CSRF middleware via native `Bun.CSRF`
- [ ] ORM migrations DX + tagged templates polish
- [ ] Wide Events logging in `@ninots/logger`
- [ ] Build-time typed route registry
- [ ] Structured WebSockets with fallback
- [ ] Docker starter kit (compose)

## v1.0 — Production Ready

- [ ] Distributed cache/session (incl. `Bun.redis` facade)
- [ ] `@ninots/events` + sync queue slice
- [ ] `@ninots/mail` / notifications
- [ ] View surface (HTML/TSX — no Blade-lite)
- [ ] `@ninots/testing` HTTP helpers
- [ ] E2E via `Bun.WebView`
- [ ] NPM + JSR publish pipeline stable
- [ ] Security audit + benchmarks

## Known gaps (parity)

See workspace `docs/parity/illuminate-to-ninots.md` — ~14 Illuminate components still missing (Events, Queue, Mail, Encryption package folder, …). Restoring encryption and Events/Queue are **Sprint 2** candidates.
