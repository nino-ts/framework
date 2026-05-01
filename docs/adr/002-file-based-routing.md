# ADR 002: File-Based Routing via Bun.FileSystemRouter

## Status
Accepted

## Context
Routing is a core component of any web framework. While traditional frameworks often use code-based programmatic routing (defining routes via method chains), modern meta-frameworks have popularized file-based routing because of its ergonomics and DX.

## Decision
ninoTS will use `Bun.FileSystemRouter` as the core engine for routing, adopting a Next.js-style file structure inside each module's `routes/` directory. The framework will wrap this router to provide advanced features such as collision detection and fully typed route generation.

## Consequences
- **Positive:** Performance is native and extremely fast. Intuitive DX. Avoids needing to maintain a complex custom regex-based router.
- **Negative:** Tied to Bun's implementation details. Less flexible for developers who prefer completely programmatic custom route definition. 
