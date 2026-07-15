# @ninots/view

## Overview
HTML/TSX view rendering with safe escaping for Bun.

## Isolation & Decoupling
This `AGENTS.md` is strictly specific to the `@ninots/view` package.
- **Completely Decoupled**: When working in this package, you must operate entirely within its boundaries.
- Do not assume the existence of, or cross-reference, other packages in this repository.
- Treat `@ninots/view` as an independent and isolated project.

## Development Context
- **Runtime Environment**: Bun
- **Language**: TypeScript (TSX string-only JSX runtime)
- **Testing**: Use `bun test` within this directory to run the test suite.

## Guidelines
- Zero external runtime dependencies.
- Always escape untrusted text via `escapeHtml()`.
- Ensure all tests pass (`bun test`) before considering a task complete.
