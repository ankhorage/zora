# Ankhorage Ports and Adapters

Use ports-and-adapters principles for application, engine, service, and hybrid packages. The
Ankhorage package is the hexagon; internal domains are not independent feature packages.

## Purpose

Protect stable package policy from React, Expo, HTTP, Fastify, Bun, filesystem, process, database,
provider SDK, and test-harness details. The useful rule is dependency direction, not a mandatory
folder ceremony.

```text
package edge / adapter -> application -> domain
                              |
                              v
                         required ports

concrete adapter -> required port
```

## Roles

- **Domain:** pure rules, values, invariants, and deterministic transformations owned by the
  package.
- **Application:** command-independent use cases and orchestration of domain behavior.
- **Port:** a capability contract required by application/domain code to reach an external edge.
- **Inbound adapter:** converts CLI, HTTP, UI, Runtime, worker, or test input into an application
  invocation.
- **Outbound adapter:** implements a required port using filesystem, process, provider, storage,
  network, Expo, or another package.
- **Composition:** selects implementations and wires adapters to application operations.

Ports belong beside the application/domain code that needs them. Do not create a global
`src/ports/` dumping ground.

## Package-level edges

Ankhorage preserves recognizable package edges:

```text
src/app/       React or React Native composition and package-wide UI entrypoints
src/cli/       one package-level Ankh provider
src/host/      Bun/Node/Fastify/filesystem composition and shared host infrastructure
src/platform/  native, web, Expo, or provider-specific implementations
```

Internal domain behavior must not migrate into these directories merely because an adapter calls
it. Edges translate and compose; domains own behavior.

## Domain-first organization

Substantial domains may use role directories:

```text
src/
  projects/
    contracts/
    domain/
    application/
    ports/
  deploy/
    contracts/
    domain/
    application/
    ports/
```

Small domains remain flat while their siblings have the same role. Introduce role directories
when definitions, parsers, use cases, adapters, or utilities begin mixing at one level.

Do not use:

```text
src/features/
src/common/
src/core/
src/shared/
src/ports/
```

unless a repository has an explicit, narrower meaning that cannot be represented by an owning
domain or package edge.

## When a port is justified

Create a port when at least one is true:

- more than one real adapter exists or is planned by current architecture;
- deterministic tests need to replace a side effect;
- the dependency is volatile or provider-specific;
- the same application operation is invoked through multiple inbound edges;
- the capability crosses a package, process, storage, network, platform, or credential boundary.

Do not create a port merely because a function calls another function. Pure utilities, component
composition, value transformations, and React-local presentation state usually do not need ports.

## React and React Native

React/RN UI is an inbound edge. Components may collect input, render state, and invoke application
actions. Provider execution and durable business rules remain outside components and hooks.

- Keep navigation route modules thin.
- Keep UI-specific transient state near the UI.
- Move reusable business decisions and cross-interface operations into the owning domain or
  application layer.
- Inject values, callbacks, or capability interfaces into reusable UI rather than importing
  concrete providers.

## Composition roots

Keep wiring explicit and limited to package entrypoints such as app startup, host creation, CLI
provider construction, or a focused factory. Do not use ambient service locators or hidden mutable
registries as dependency injection.

## Testing

- Test domain and application behavior with deterministic inputs and fake ports.
- Test concrete adapters against their real protocol boundary.
- Test user-facing flows through inbound edges only where the integration adds evidence.
- Do not duplicate the full acceptance matrix for every internal refactor.
