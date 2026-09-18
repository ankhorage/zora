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

## Required source layout

- `examples/`: Repository-root folder in this standalone repository;
  Use it for complete, intentional, user-facing examples that people can inspect, copy, install, and run independently of a monorepo or internal fixture layout.

Each example lives in a named subdirectory, such as `examples/basic-usage/*.ts`. Do not put example
source files directly under `examples/`.

Test-only fixtures remain owned by the applicable test structure. Do not relabel fixtures as public
examples merely to bypass repository structure rules.

- `src/cli/` must exist or have a concrete issue tracking the missing CLI commands;
  CLI modules are thin inbound adapters: they parse input, invoke a feature use case, and render
  output.

The filesystem below `src/cli/commands/` mirrors the public command path after the package prefix:

```text
ankh <package> <segment> ... <command>
  -> src/cli/commands/<segment>/.../<command>.ts
```

The package prefix is represented by the provider and is not repeated under `commands/`. Flags and
positional arguments do not affect this directory tree. Each command file follows the one-export
rule: `commands/projects/list.ts` exports `list` and owns only the command-specific input/output
mapping.

- `src/features/`: Lists the repository's actual product capabilities;
  Technical categories are not features. Each feature owns its own hexagonal structure as needed,
  following the required Hexagonal Architecture skill. Do not create empty layers.

```text
examples/
  <example>/
src/
  cli/
    createCliProvider.ts
    commands/
      <command>.ts
      <group>/
        <command>.ts
  features/
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
      constants/
        <topic>.ts
      utils/
  types/
    <topic>.ts
  constants/
    <topic>.ts
  utils/
```

Keep only deliberate package facades directly under `src/`. Public package subpaths must name their
explicit module in `package.json`; generic `index.ts` barrels are not public API exceptions.

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

Apply **reuse before implementation** and **shared by default** before choosing a local owner. For
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
