---
name: ankhorage-project-structure
description: >
  Define, review, or implement the standard source structure of Ankhorage repositories. Use for
  feature ownership, CLI layout, hexagonal boundaries, source-module naming, utilities, or package
  entrypoints.
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

## One export per production module

Each production source file has exactly one export. Its exported declaration is the first declaration
after imports and module documentation, and its name matches the filename exactly.

- `myFunction.ts` exports `myFunction`.
- `myFunctionAsync.ts` exports `myFunctionAsync`.
- A public operation that is asynchronous or returns a `Promise` uses the `Async` suffix in both its
  filename and exported name.

Keep private helpers below that exported declaration when they are used only by that module. Move a
helper used by multiple modules to `utils/` at the owning layer. Put a repository-wide utility in
`src/utils/`. Put a generally reusable cross-package utility in the correct `@ankhorage/utility`
location.

## Utilities

`utils/` is the only utility directory name. Do not create `shared/`, `helper/`, `helpers/`,
`common/`, or equivalent catch-all folders. Feature-local utilities live in that feature's `utils/`;
utilities shared by repository features live in `src/utils/`.

This skill defines the target architecture. Schedule repository migrations separately and in this
order: Studio, Deploy, Infra, Repository, Navigator.
