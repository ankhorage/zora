---
name: ankhorage-project-structure
description: >
  Define, review, or implement the standard source structure of Ankhorage repositories. Use for feature ownership, CLI layout, hexagonal boundaries, source-module naming, Contracts ownership, type ownership, utilities, or package entrypoints.
---

# Ankhorage Project Structure

## Applicability

This skill applies to every Ankhorage repository.

### Contracts repository profile

If the current repository is `ankhorage/contracts`, apply only this profile:

- The repository may contain only portable, serializable contracts expressed as interfaces and
  types. Every field must be serializable and reconstructable without executable behavior or
  repository-local runtime objects. Do not add call signatures, function-valued properties,
  functions, classes, constants, enums, mutable state, adapters, framework objects, or
  implementation helpers.
- A contract belongs in this repository only when it is required across multiple repositories. A
  current or coordinated change MUST identify at least two consuming repositories. Keep
  single-repository types with their owning repository; anticipated reuse alone is not sufficient.
- Consumers import contracts through published public subpaths and declared dependencies, never
  sibling source files or duplicated local declarations.

After enforcing this profile, stop before the remaining source-layout, implementation, utility,
and migration rules; they do not apply to `ankhorage/contracts`.

## Required skills

Before structural work outside `ankhorage/contracts`, read the repository `AGENTS.md`, inspect its
source tree and public exports, then load the required Hexagonal Architecture skill from the
repository root. Do not resolve it relative to this skill's own installation location:

1. `<repo-root>/.agents/skills/hexagonal-architecture/SKILL.md`

## Architecture profiles and source layout

Do not impose one folder tree on every repository. Select the smallest profile that matches the
repository's real responsibility, then enforce that profile's vocabulary and dependency direction.
Read `references/architecture-profiles.md` and `references/hexagonal-invariants.md` before
creating or moving architectural directories.

Valid profiles include:

- simple/value/contracts library;
- reusable UI or design-system library;
- application, engine, or hybrid package;
- provider or platform adapter package;
- tooling package;
- generated standalone application;
- an explicitly documented repository-specific profile such as Studio.

Implementation-owning Ankhorage packages are feature-first. Product, domain, and package
capabilities belong below `src/features/<feature>/`; do not place feature implementation modules
directly below `src/`. Keep only deliberate public facades and genuinely package-wide ownership
such as `src/types/`, `src/constants/`, and `src/utils/` at the source root. Contracts-only,
reusable UI/design-system, generated-application, and explicitly documented repository-specific
profiles may use their dedicated taxonomy instead of inventing fake features.

Inside each feature, introduce `domain/`, `application/`, `ports/`, `adapters/`, or
`composition/` only when those names communicate a real architectural role. Do not create empty
hexagonal layers for symmetry. Once a vocabulary is introduced, its combinations must be coherent:

- `domain/` may stand alone and must remain independent from outer mechanisms;
- `application/` coordinates use cases and may depend inward on domain policy and required ports;
- `ports/` define capabilities required by inner policy; they do not implement provider technology;
- `adapters/` translate or implement a port at an external edge and therefore require an inward
  capability boundary to adapt to;
- `composition/` is outer wiring and exists only when concrete implementations need selection;
- `features/` is feature-first organization, not a generic bucket. Each feature owns a coherent
  slice and may introduce only the role directories it actually needs;
- `core/` is allowed only when the repository defines it narrowly as stable inner policy. It must
  never become a miscellaneous dumping ground.

Dependency direction is the invariant. Inner policy must not import outer mechanisms. A domain or
core module must not depend on application orchestration, adapters, composition, CLI, host,
platform, framework, database, or provider implementation details. Application/use-case code must
not import concrete adapters or composition roots. Adapters may depend inward on ports/application/
domain contracts. Composition may depend on all pieces it wires.

Do not create empty layers for symmetry. A small package with no domain orchestration does not need
hexagonal ceremony. UI libraries use component/foundation dependency direction rather than fake
application ports. Contracts libraries remain portable and side-effect free.

Repository-root `examples/` contains complete user-facing examples. Each example lives in a named
subdirectory. Test-only fixtures remain test-owned.

Package-level delivery edges such as `src/cli/`, `src/host/`, `src/app/`, or `src/platform/`
remain thin adapters/composition boundaries outside feature ownership. Every public Ankh command
implementation must live below `src/cli/commands/`, and that filesystem mirrors the public command
path after the package prefix. For example, `ankh rules config validate` maps to
`src/cli/commands/config/validate.ts`. CLI provider/index modules register and compose commands;
they must not contain the command's application or domain behavior. Command modules parse input,
invoke the owning feature boundary, and render output.

Keep only deliberate public facades directly under `src/`. Public package subpaths must map to
explicit package exports; generic barrels are not an excuse to bypass ownership.

## General Taxonomy

Siblings always represent the same kind of entity. A folder cannot be an unrelated catch-all beside
peer entities. For example, this is invalid because `other/` is not a color:

```text
colors/
  red/
  green/
  blue/
  other/
```

Resolve the ownership of `other` and move it to the appropriate taxonomy. Use domain names for
features, not framework, transport, database, or generic technical names.

## Implementation modules

Each production implementation module has exactly one exported runtime declaration. It is the first
declaration after imports and module documentation, and its name matches the filename exactly.
This rule does not split types into one-file-per-type modules. Type ownership follows the separate
rules below. Deliberate public facades may group explicit named exports; they are not internal
convenience barrels and must not expose private implementation details.

- `myFunction.ts` exports `myFunction`.
- `myFunctionAsync.ts` exports `myFunctionAsync`.
- A public operation that is asynchronous or returns a `Promise` uses the `Async` suffix in both its filename and exported name.

Keep private helpers below that exported declaration when they are used only by that module.
Decide the owner of a reused function using the utility rules below, before creating another file.

## Type ownership

Choose type ownership by its production consumers, not by the number of textual references or
whether a barrel happens to re-export it:

1. **Used by one implementation module:** keep the type directly below the function that owns it, without `export`. Its private helpers can use the same local type. A test does not justify exporting an implementation-private type; test through the function boundary.
2. **Reused within the repository:** put related types together in `src/types/<topic>.ts` and use type-only imports. Name the file for a cohesive topic, not for each individual type. Such a file may export multiple related types/interfaces and contains no runtime implementation. Do not mix type-only files among feature functions or `utils/`, and do not create one global catch-all file.
3. **Shared across repositories and serializable:** when at least two repositories require the same portable data declaration, it belongs in `@ankhorage/contracts` at the owning topic's public subpath. Consumers import that contract through a declared dependency, not another repository's source or a duplicated local declaration. Keep non-serializable API types with their implementation-owning package and consume them through that package's public API. Keep framework-specific adapters separate from the portable shared contract.

Inspect published API declarations and real consumer imports before privatizing or relocating a
type. A public boundary type is not private just because only one implementation uses it locally.
Coordinate its Contracts change and consumer migration; do not silently remove a public type,
invent an unreleased dependency version, or retain a compatibility re-export as the final design.
When the required package change or release is outside the approved scope, state the dependency
explicitly instead of claiming the migration is complete.

For example, `selectRoute.ts` can own a non-exported `SelectRouteInput` directly below `selectRoute`.
Types used by several local navigation operations belong together in `src/types/navigation.ts`.
A navigation binding exchanged by Studio and Navigator belongs in `@ankhorage/contracts/navigator`.

## Constant ownership

Constants are static declarations, not utility implementations. Do not create one exported
constant per constant-named file under `utils/`.

1. **Used by one implementation module:** keep the constant private in the module that owns it.
2. **Reused only inside a feature:** group related constants in that feature's `constants/<topic>.ts`.
3. **Shared across features in one package:** group related package metadata, static policy values, and other constants in `src/constants/<topic>.ts`.

A `constants/<topic>.ts` module may export multiple related constants. Keep it cohesive by ownership and
purpose; it is not a package-wide catch-all. Split constants when they have different owners, not
merely to create one file per export.

For example, Navigator's
[`src/utils/NAVIGATOR_PACKAGE_METADATA.ts`](https://github.com/ankhorage/navigator/blob/main/src/utils/NAVIGATOR_PACKAGE_METADATA.ts)
and
[`src/utils/NAVIGATOR_ROUTER_POLICY.ts`](https://github.com/ankhorage/navigator/blob/main/src/utils/NAVIGATOR_ROUTER_POLICY.ts)
belong together in `ankhorage/navigator/src/constants/navigator.ts`.

## Utilities

`utils/` is the only utility directory name. Do not create `shared/`, `helper/`, `helpers/`,
`common/`, or equivalent catch-all folders. It is not a destination for every pure function or type.

Apply **reuse before implementation** and **shared by default** before choosing a local owner.

Treat the **second equivalent generic implementation as the duplication threshold**. When the same
general-purpose regex, parser pattern, formatter, validator, algorithm, or static policy appears in
two places, stop copying it and resolve its canonical shared owner. For runtime-neutral reusable
behavior or patterns, inspect and extend `@ankhorage/utility` first. Do not wait for a third copy,
and do not create repo-local aliases around the shared implementation. For
every function that could reasonably be reused across repositories, you MUST first inspect the
published `@ankhorage/utility` public API and its owning topic. Reuse the existing export when its
semantics match. If the function is missing and is generic without product, manifest, or framework
policy, implement, test, and export it from the appropriate Utility topic, then consume that public
export through a declared dependency. Do not duplicate it locally or add a forwarding wrapper.
`isRecord` from `@ankhorage/utility/object` is one motivating example of this general rule, not a
special case.

- Used by one module: keep the helper private below its owning function.
- Reused only inside a feature: keep it in that feature's `utils/`.
- Shared across features but tied to this package's capability or policy: use `src/utils/`.
  Navigator topology traversal or Expo Router-specific validation does not become a general utility
  merely because several navigator features use it.
- Generally reusable across repositories: it belongs in the canonical `@ankhorage/utility` topic
  under the reuse-first rule above. Examples include generic string escaping or source-literal
  serialization. Do not change semantics merely to reuse a similarly named function.

Separate the decisions for functions and types: reusable functions belong to Utility when general;
repo-local type groups belong to `src/types/`; repo-crossing types belong to Contracts. Respect
release boundaries and obtain approval for additional package changes when they exceed the task.

This skill defines the target architecture. Schedule repository migrations separately and in this
order: Studio, Deploy, Infra, Repository, Navigator, Surface, ZORA.
