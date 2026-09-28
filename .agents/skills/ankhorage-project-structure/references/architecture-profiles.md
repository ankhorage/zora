# Architecture Profiles

Choose the profile from actual ownership and consumers. Profiles define allowed vocabulary and
dependency direction; they are not templates that require every listed directory.

## Simple or value library

Use for deterministic values, parsers, constants, algorithms, and small runtime libraries without
application orchestration. Runtime-owning libraries are still feature-first: each coherent package
capability belongs below `src/features/<feature>/`, but a simple feature does not need hexagonal
role directories when it has no orchestration or external edge.

Typical form:

```text
src/
  index.ts
  features/
    <feature>/
  types/
  constants/
  utils/
```

Do not invent ports, adapters, application, or composition layers when there is no external edge to
abstract. Contracts-only repositories follow the dedicated Contracts repository profile from the
main project-structure skill instead of this runtime-library profile.

## Reusable UI or design-system library

Use semantic UI ownership and stable foundation layers rather than fake use cases:

```text
src/
  foundation/
  theme/
  layout/
  primitives/
  components/
  patterns/
  registry/
```

Higher-level UI may depend on lower-level foundations; foundations must not depend upward on composed
components or registries. Provider execution belongs outside reusable presentation components.

## Application, engine, or hybrid package

Use when the package owns use cases, state transitions, external systems, or several delivery edges.
These packages are feature-first: every product/domain/package capability is owned below
`src/features/<feature>/`. Do not use top-level domain folders or flat `src/*.ts` implementation
modules as an alternative ownership model.

```text
src/
  index.ts
  features/
    <feature>/
      domain/
      application/
      ports/
      adapters/
      composition/
  cli/
    commands/
  types/
  constants/
  utils/
```

Only create the role directories that the capability actually needs. A pure domain feature can stop
at `domain/`; an in-memory use case need not invent an outbound adapter.

## Provider or platform adapter package

Use when the package deliberately implements an external technology boundary. Provider capabilities
are still feature-owned; concrete technology remains at the feature's outer adapter boundary:

```text
src/
  features/
    <capability>/
      domain/
      application/
      ports/
      adapters/
      composition/
  cli/
    commands/
```

Portable configuration and planning stay independent from SDK/runtime values. Concrete provider code
stays in adapters, and package-level delivery edges remain outside the feature.

## Tooling package

Command-centric tooling remains feature-first for owned capabilities while the CLI stays an outer
delivery edge:

```text
src/
  features/
    <capability>/
      domain/
      application/
      ports/
      adapters/
      composition/
  cli/
    commands/
```

Policy remains deterministic. Filesystem, process, registry, network, and GitHub behavior stay at
the feature edge or package delivery edge rather than leaking into inner policy.

## Generated standalone application

A generated app owns its manifest, lockfile, installation, validation, build, and deployment inputs.
A parent tool may invoke it with the app as `cwd`, but it must not depend on a hidden parent
workspace, sibling source, or installation state.

## Repository-specific profile

A repository may define a narrower profile when its domain genuinely needs one. That profile must be
documented in the managed project-structure skill or an explicit repository reference and must still
respect the shared standalone and dependency-direction invariants. Studio is the canonical example:
its `features/` taxonomy is intentional and each substantial feature may layer internally.

## Combination rules

Folder names create obligations:

- `domain/`: inner policy; no outward mechanism dependencies.
- `application/`: use-case orchestration; no concrete adapter/composition dependency.
- `ports/`: capability contracts required by inner policy.
- `adapters/`: concrete edge implementations; there must be an inward capability/policy to adapt.
- `composition/`: selects and wires concrete implementations; do not create it without pieces to wire.
- `features/`: siblings are product capabilities, not technical categories.
- `core/`: only a narrowly defined inner-policy layer; never a generic dumping ground.
- `common/`, `shared/`, and `helpers/`: not architectural ownership categories.

Doctor should validate these combinations and dependency directions rather than require every
repository to match one tree.
