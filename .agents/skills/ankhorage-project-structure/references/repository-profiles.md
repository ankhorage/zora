# Repository Profiles

Select one primary profile from the repository's actual ownership and consumers. A package may
also expose secondary edges such as CLI or Expo without changing its primary profile.

## Application, engine, or hybrid

Use for packages that coordinate use cases, state transitions, external systems, or several
delivery mechanisms.

Typical structure:

```text
src/
  index.ts
  <domain>/
    contracts/
    domain/
    application/
    ports/
  app/                 # optional React/RN edge and composition
  cli/                 # optional package-level Ankh edge
  host/                # optional Bun/Node/HTTP/filesystem edge
  platform/            # optional native/web/provider edge
  utils/               # internal cross-domain utilities only
```

Create role subdirectories only when a domain has enough distinct responsibilities to need them.
Do not pre-create empty `contracts`, `domain`, `application`, or `ports` directories.

## Contracts or value library

Contracts own portable shape and structural validation, not provider execution.

```text
src/
  index.ts
  <domain>/
    contracts/
    parsers/
    constants/
    tests colocated with their owner
```

- Keep modules deterministic and side-effect free.
- Type definitions and structural parsers change together.
- Provider readiness, network state, filesystem state, and UI behavior stay in their owner.
- Avoid `Record<string, unknown>` escape hatches when a canonical concept can be modeled.

## Platform or provider adapter

These packages deliberately implement an external technology boundary.

```text
src/
  index.ts
  contracts/           # provider-facing public configuration when owned here
  planning/            # pure capability/configuration planning
  adapters/            # concrete provider/platform implementations
  composition/         # factories or provider registration
  cli/                 # only when this package exposes Ankh commands
```

- Depend on portable contracts or ports from lower-level owning packages.
- Do not redefine the application/domain model locally.
- Keep provider SDK values from leaking through portable public contracts.
- Separate build-time planning from runtime execution when both exist.

## Tooling package

Tooling packages may be command-centric but still keep parsing, policy, and side effects distinct.

```text
src/
  cli/
  policy/              # deterministic rules and diagnostics
  application/         # command-independent operations
  adapters/            # filesystem, process, GitHub, registry, etc.
  composition/
  index.ts
```

The package remains the boundary. Do not create internal pseudo-packages beneath `features/`.

## Generated or standalone application

A generated application is an independently installable and buildable project. It is not a
workspace child of Studio and must not depend on Studio-local source or installation state.

Use the Expo application profile when applicable. Application-specific domains live under `src/`;
route entrypoints remain thin.
