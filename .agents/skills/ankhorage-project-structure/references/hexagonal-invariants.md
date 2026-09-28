# Hexagonal Architecture Invariants

The canonical rule is isolation of inner policy from external mechanisms, not the visual shape or a
fixed number of directories.

## Research basis

- Alistair Cockburn's original Ports & Adapters article defines an application on the inside
  communicating through purposeful ports with replaceable technology-specific adapters. It
  explicitly notes that the number of ports is not fixed:
  https://alistair.cockburn.us/hexagonal-architecture
- Robert C. Martin's Clean Architecture states the Dependency Rule: source dependencies point
  inward, while outer mechanisms must not leak names or formats into inner policy:
  https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html
- Martin Fowler describes layering as a logical separation that can exist at different granularities
  and notes that larger systems often modularize primarily by domain, layering inside those modules:
  https://martinfowler.com/bliki/PresentationDomainDataLayering.html
- DDD-oriented layered architecture keeps domain rules independent from infrastructure while the
  application layer coordinates use cases and infrastructure implements technical details:
  https://learn.microsoft.com/dotnet/architecture/microservices/microservice-ddd-cqrs-patterns/ddd-oriented-microservice

## Invariants

```text
outer adapter/composition -> application/use case -> domain/core policy
                                  |
                                  v
                           required port contract

concrete adapter ----------------> required port contract
```

The exact filesystem can vary, but source dependencies must preserve this direction.

### Inner policy

Domain/core policy owns deterministic rules, values, invariants, and transformations. It must not
import:

- CLI, HTTP, UI, worker, or framework entrypoints;
- filesystem/process/network/database/provider SDK implementations;
- adapters or composition roots;
- application orchestration that sits outside that policy.

### Application/use cases

Application code coordinates domain policy and required capabilities. It may define or consume port
contracts, but it must not import concrete adapter implementations or composition roots.

### Ports

A port names a capability or conversation at a boundary. Create one when an external side effect,
provider, process, platform, storage mechanism, or multiple delivery mechanisms justify substitution
or deterministic testing. A port is not required for an ordinary pure function call.

### Adapters

Adapters translate at the edge. Inbound adapters map CLI/HTTP/UI/worker input into an application
operation. Outbound adapters implement required capabilities using concrete technology.

An `adapters/` directory without any identifiable inward policy/capability boundary is structurally
suspicious: technology has become the architecture instead of adapting it.

### Composition

Composition selects implementations and wires dependencies. It is intentionally outermost and may
know concrete adapters. Inner policy must never import it.

## Verification strategy

Doctor should validate what can be proven statically:

- local dependency protocols and sibling-source coupling;
- folder-role combinations after a vocabulary is introduced;
- relative import direction between recognized roles;
- generic catch-all architecture directories;
- public-package standalone scripts and packed artifact boundaries.

Semantic independence that cannot be inferred statically belongs in the package-owned
`test:standalone` suite. Release must execute both Doctor and that owner test.
