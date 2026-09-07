---
name: hexagonal-architecture
description: >
  Organize Ankhorage features with ports and adapters so domain policy stays independent from
  transport, frameworks, and infrastructure.
origin: ECC, adapted for Ankhorage
metadata:
  github-repo: https://github.com/affaan-m/ECC
  github-ref: refs/tags/v2.2.0
  github-path: docs/ja-JP/skills/hexagonal-architecture
---

# Hexagonal Architecture

Hexagonal architecture keeps a feature's domain policy independent from its transport, framework,
and infrastructure details. The application layer depends on ports; inbound and outbound adapters
implement the edge-specific work.

## Feature boundaries

Apply this structure inside the owning `src/features/<feature>/` directory. A feature may contain
only the layers it needs:

```text
<feature>/
  domain/
  application/
    ports/
      inbound/
      outbound/
    use-cases/
  adapters/
    inbound/
    outbound/
  composition/
  utils/
```

- `domain/` contains entities, value objects, and business policy. It imports no framework,
  transport, database, or SDK code.
- `application/` defines use cases and the ports they require. It orchestrates domain behavior and
  depends only inward.
- `adapters/inbound/` converts CLI, HTTP, worker, or UI input to use-case input.
- `adapters/outbound/` implements application ports for persistence, APIs, queues, clocks, and
  other external dependencies.
- `composition/` explicitly wires concrete adapters to use cases.

Dependency direction is always inward: adapters depend on application and domain; application
depends on domain and ports; domain has no external dependencies. Adapters do not call each other
to bypass a use case.

## Ports and use cases

Define an inbound port when a feature needs a stable use-case boundary. Define an outbound port for
each capability the application needs from persistence, an external system, or cross-cutting runtime
services. Model ports as capabilities rather than technologies.

Use cases accept plain inputs, enforce application invariants, coordinate domain behavior through
ports, and return plain outputs. Keep protocol request objects, database rows, SDK clients, and
transport error formats in adapters.

## Testing

Test domain rules without framework setup. Test use cases with fakes for outbound ports. Test
adapters at their boundary with the real protocol or infrastructure they translate. Cover critical
flows end-to-end through an inbound adapter, use case, and outbound adapter.

## Ankhorage conventions

Follow `ankhorage-project-structure` for feature naming, one-export source modules, and `utils/`
ownership. Do not introduce legacy paths, compatibility facades, dual implementations, or rollback
switches while applying this architecture; use the current architecture directly.
