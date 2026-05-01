# ADR 004: Bun-Native APIs Priority

## Status
Accepted

## Context
ninoTS is built exclusively for the Bun runtime. To achieve maximum performance, we must leverage the runtime's native capabilities rather than generic polyfills or Node.js compatibility layers.

## Decision
When implementing framework features, the technical hierarchy of API choice must strictly be:
1. **Bun Native APIs** (`Bun.serve()`, `Bun.password`, `Bun.CryptoHasher`, `Bun.file()`, etc.)
2. **Web APIs** (`Request`, `Response`, `fetch`, `crypto.subtle`)
3. **Node.js Compat APIs** (e.g. `node:path`, `node:events`) - Used only as a last resort.

If a feature is available natively in Bun, we must NOT build a wrapper around an NPM package. For example, `Bun.CryptoHasher` replaces the need for `crypto` or `bcrypt` npm packages.

## Consequences
- **Positive:** Unmatched performance. Less overhead. Reduced codebase size.
- **Negative:** Strict vendor lock-in to the Bun ecosystem. Code will not run on Node.js or Deno without major refactoring.
