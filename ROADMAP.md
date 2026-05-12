# ninoTS Framework Roadmap

> ninoTS is a zero-dependency, high-performance web framework optimized for the Bun runtime.

## v0.3 — Foundation & Routing (Current Sprint)

- [ ] Integrar todos os 18 pacotes core no entry point
- [ ] Remoção da API legacy de validação
- [ ] Implementação de file-based routing via `Bun.FileSystemRouter`
- [ ] Boot loop completo utilizando `Bun.serve()`
- [ ] Scaffold CLI via Bun Shell (`nino dev`, `nino build`, `nino start`)
- [ ] Manifesto de módulo via `module.jsonc`
- [ ] Isolamento estrito de dependências modulares (Biome)
- [ ] `ROADMAP.md` e ADRs estabelecidos

## v0.5 — Ecosystem & DX

- [ ] Generators CLI avançados (`nino make:module`, `nino make:model`, `nino make:route`)
- [ ] CSRF middleware via `Bun.CSRF` nativo
- [ ] ORM engine completa usando `Bun.sql` com tagged templates
- [ ] Senhas com `Bun.password` e Hashing via `Bun.CryptoHasher`
- [ ] Wide Events logging implementados no pacote Logger
- [ ] Registro tipado de rotas (tRPC-like) gerado via `Bun.build` em build-time
- [ ] Suporte a WebSockets estruturados com fallback
- [ ] Starter kit com Docker e docker-compose.yml

## v1.0 — Production Ready

- [ ] Cache e Sessions robustas distribuídas
- [ ] Middleware stack avançada e configurável
- [ ] E2E Testing via `Bun.WebView` nativo
- [ ] Autenticação extensível com provedores OAuth integrados
- [ ] Documentação completa (site e API reference)
- [ ] Estabilização e benchmarks
- [ ] Auditoria de Segurança
