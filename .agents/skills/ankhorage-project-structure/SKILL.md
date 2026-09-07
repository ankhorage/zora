---
name: ankhorage-project-structure
description: >
  Define, review, or implement the standard source structure of Ankhorage repositories. Use for
  feature ownership, CLI layout, hexagonal boundaries, source-module naming, type ownership,
  utilities, or package entrypoints.
---

# Ankhorage Project Structure

Every Ankhorage repository follows this structure. It applies now to `ankhorage/studio`,
`ankhorage/deploy`, `ankhorage/infra`, `ankhorage/repository`, and `ankhorage/navigator`.

## Required skills

Before structural work, read the repository `AGENTS.md`, inspect its source tree and public
exports, then load both required repository skills:

1. `.agents/skills/ankhorage-coding-rules/SKILL.md`
2. [Hexagonal Architecture](../hexagonal-architecture/SKILL.md)

If `ankhorage-coding-rules` is missing or unreadable, stop immediately and report exactly:

```
Cannot continue: the required repository skill `ankhorage-coding-rules` is missing or unreadable at `.agents/skills/ankhorage-coding-rules/SKILL.md`. Synchronize the repository skills from `@ankhorage/devtools` and retry.
```

If `hexagonal-architecture` is missing or unreadable, stop immediately and report exactly:

```
Cannot continue: the required repository skill `hexagonal-architecture` is missing or unreadable at `.agents/skills/hexagonal-architecture/SKILL.md`. Synchronize the repository skills from `@ankhorage/devtools` and retry.
```

## Required source layout

Every repository provides `src/features/`. It lists the repository's actual product capabilities;
technical categories are not features. Each feature owns its own hexagonal structure as needed,
following the required Hexagonal Architecture skill. Do not create empty layers.

Every repository provides `src/cli/`, or has a concrete issue tracking the missing CLI commands.
CLI modules are thin inbound adapters: they parse input, invoke a feature use case, and render
output.

```text
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
      utils/
  types/
    <topic>.ts
  utils/
```

Keep only deliberate package facades directly under `src/`. Public package subpaths must name their
explicit module in `package.json`; generic `index.ts` barrels are not public API exceptions.

The filesystem below `src/cli/commands/` mirrors the public command path after the package prefix:

```text
ankh <package> <segment> ... <command>
  -> src/cli/commands/<segment>/.../<command>.ts
```

The package prefix is represented by the provider and is not repeated under `commands/`. Flags and
positional arguments do not affect this directory tree. Each command file follows the one-export
rule: `commands/projects/list.ts` exports `list` and owns only the command-specific input/output
mapping.

## Feature taxonomy

Siblings always represent the same kind of entity. A folder cannot be an unrelated catch-all beside
peer entities. For example, this is invalid because `otherFolder` is not a color:

```text
colors/
  red/
  green/
  blue/
  otherFolder/
```

Resolve the ownership of `otherFolder` and move it to the appropriate taxonomy. Use domain names for
features, not framework, transport, database, or generic technical names.

## Implementation modules

Each production implementation module has exactly one exported runtime declaration. It is the first
declaration after imports and module documentation, and its name matches the filename exactly.
This rule does not split types into one-file-per-type modules. Type ownership follows the separate
rules below. Deliberate public facades may group explicit named exports; they are not internal
convenience barrels and must not expose private implementation details.

- `myFunction.ts` exports `myFunction`.
- `myFunctionAsync.ts` exports `myFunctionAsync`.
- A public operation that is asynchronous or returns a `Promise` uses the `Async` suffix in both its
  filename and exported name.

Keep private helpers below that exported declaration when they are used only by that module.
Decide the owner of a reused function using the utility rules below, before creating another file.

## Type ownership

Choose type ownership by its production consumers, not by the number of textual references or
whether a barrel happens to re-export it:

1. **Used by one implementation module:** keep the type directly below the function that owns it,
   without `export`. Its private helpers can use the same local type. A test does not justify
   exporting an implementation-private type; test through the function boundary.
2. **Reused within the repository:** put related types together in `src/types/<topic>.ts` and use
   type-only imports. Name the file for a cohesive topic, not for each individual type. Such a file
   may export multiple related types/interfaces and contains no runtime implementation. Do not mix
   type-only files among feature functions or `utils/`, and do not create one global catch-all file.
3. **Shared across repositories:** the canonical declaration belongs in `@ankhorage/contracts` at
   the owning topic's public subpath. Consumers import that contract through a declared dependency,
   not another repository's source or a duplicated local declaration. Keep framework-specific
   adapters separate from the portable shared contract.

Inspect published API declarations and real consumer imports before privatizing or relocating a
type. A public boundary type is not private just because only one implementation uses it locally.
Coordinate its Contracts change and consumer migration; do not silently remove a public type,
invent an unreleased dependency version, or retain a compatibility re-export as the final design.
When the required package change or release is outside the approved scope, state the dependency
explicitly instead of claiming the migration is complete.

For example, `selectRoute.ts` can own a non-exported `SelectRouteInput` directly below `selectRoute`.
Types used by several local navigation operations belong together in `src/types/navigation.ts`.
A navigation binding exchanged by Studio and Navigator belongs in `@ankhorage/contracts/navigator`.

## Utilities

`utils/` is the only utility directory name. Do not create `shared/`, `helper/`, `helpers/`,
`common/`, or equivalent catch-all folders. It is not a destination for every pure function or type.

- Used by one module: keep the helper private below its owning function.
- Reused only inside a feature: keep it in that feature's `utils/`.
- Shared across features but tied to this package's capability or policy: use `src/utils/`.
  Navigator topology traversal or Expo Router-specific validation does not become a general utility
  merely because several navigator features use it.
- Generally reusable without the owning product, manifest, or framework policy: inspect the
  published `@ankhorage/utility` API first, reuse it where semantics match, and put missing general
  helpers in that package's owning topic. Examples include generic string escaping or source-literal
  serialization. Do not copy a utility locally, create a forwarding wrapper, or change semantics
  just to reuse a similarly named function.

Separate the decisions for functions and types: reusable functions belong to Utility when general;
repo-local type groups belong to `src/types/`; repo-crossing types belong to Contracts. Respect
release boundaries and obtain approval for additional package changes when they exceed the task.

This skill defines the target architecture. Schedule repository migrations separately and in this
order: Studio, Deploy, Infra, Repository, Navigator.
