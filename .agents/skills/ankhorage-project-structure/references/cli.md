# Ankhorage Package CLI

An Ankhorage package may expose one package-level Ankh command provider under `src/cli/`. The
package is the CLI ownership boundary.

Do not create `cli/` directories inside internal domains. An independently bound package owns its
own package-level `src/cli/` and release lifecycle.

## Command tree

The filesystem below `src/cli/commands/` mirrors the public command path after the package prefix.

```text
ankh <package> <segment> ... <command>
  -> src/cli/commands/<segment>/.../<command>.ts
```

Examples:

```text
ankh studio dev
  -> src/cli/commands/dev.ts

ankh studio projects list
  -> src/cli/commands/projects/list.ts

ankh studio projects create --name Shop
  -> src/cli/commands/projects/create.ts

ankh deploy release inspect
  -> src/cli/commands/release/inspect.ts
```

The package prefix is represented by the provider and is not repeated under `commands/`. Flags and
positional arguments do not affect the directory tree.

Bad:

```text
src/cli/commands/studio/projects/list.ts
src/cli/commands/listProjects.ts
src/projects/cli/list.ts
```

Good:

```text
src/cli/commands/projects/list.ts
```

## Layout

```text
src/
  cli/
    index.ts
    commands/
      <command>.ts
      <group>/
        <command>.ts
```

`src/cli/index.ts` owns provider identity, category, capabilities, command definitions, handler
registration, and package-level composition. It contains no substantial command implementation.

Each leaf command module owns one command handler and its command-specific argument/output mapping.
Tests are colocated:

```text
src/cli/commands/projects/list.ts
src/cli/commands/projects/list.test.ts
```

Do not add command-group barrels unless the group intentionally exposes an API or requires genuine
composition.

## Naming exception

Command filenames follow public CLI segments rather than exported handler names:

```text
command:  ankh studio projects list
file:     src/cli/commands/projects/list.ts
handler:  listProjects
```

This is an intentional exception to primary-symbol filenames. It applies only to CLI command leaf
modules.

## Adapter boundary

A handler may parse `request.argv`, use the provided command context, call package-owned
application operations, translate failures into command results, and create the package
composition needed for the invocation.

A handler must not:

- implement domain rules;
- duplicate application behavior;
- implement substantial filesystem, network, process, database, credential, or provider logic;
- proxy behavior owned by another package to place it under the local prefix;
- preserve removed commands through aliases or hidden handlers.

## Capabilities and public metadata

Keep provider metadata, command definitions, handler paths, public exports, documentation, and
tests synchronized. Remove unused capabilities when a command disappears. Published command or
metadata changes require the repository's normal changeset treatment.

## Standalone generated applications

Generated applications own their installation, validation, build, and runtime commands. Execute
the generated application's canonical command with that application as `cwd`.

Studio must not own a parallel workspace-install command or assume generated applications are
Studio workspace members. Do not preserve obsolete workspace commands, capabilities, handlers,
tests, or documentation after the standalone architecture replaces them.
