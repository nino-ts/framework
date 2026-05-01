# ADR 003: Modular Architecture & Contract-First Design

## Status
Accepted

## Context
Large monolithic applications often turn into spaghetti code due to hidden dependencies and tightly coupled components. Domain-Driven Design (DDD) encourages splitting the codebase into bounded contexts, but this requires framework enforcement to succeed.

## Decision
ninoTS adopts a strict modular architecture.
1. Code must be organized in standalone modules.
2. Modules must declare their boundaries via `module.jsonc`.
3. Communication between modules must be Contract-First: modules only export TypeScript interfaces/types from their `contracts/` directory.
4. An importing module can never import concrete implementations from another module, only contracts. This will be enforced via a custom Biome lint rule.

## Consequences
- **Positive:** High cohesion and loose coupling. Easy to extract modules into microservices later. Easy to test in isolation.
- **Negative:** Higher initial learning curve. Small projects might feel this is boilerplate-heavy.
