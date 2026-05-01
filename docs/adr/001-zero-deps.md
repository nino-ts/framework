# ADR 001: Zero External Dependencies Policy

## Status
Accepted

## Context
Frameworks traditionally accumulate large numbers of external dependencies, leading to bloated `node_modules`, slow install times, potential supply chain attacks, and frequent breakages due to transitive dependency updates. ninoTS aims to be ultra-fast, secure, and lean.

## Decision
ninoTS will have zero external runtime dependencies. All functionality must be implemented natively using:
1. Bun standard library APIs
2. Web standard APIs
3. Node.js compatibility layer (only when strictly necessary and if Web/Bun equivalents are missing)

## Consequences
- **Positive:** Maximum security and control over the framework code. Extremely fast installation. No risk of left-pad situations. Predictable performance.
- **Negative:** Increased maintenance burden on the framework maintainers to write things from scratch or adapt existing native APIs. Feature parity with dependency-heavy frameworks will take longer.
