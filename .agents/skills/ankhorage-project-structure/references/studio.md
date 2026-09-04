# Studio Structure Example

Read this only for `ankhorage/studio`. It is a structural target and ownership checklist, not a
license to move every file in one change.

Studio is the bounded capability. `features/` is its internal organizational boundary; its contents
are not independently bound packages.

## Target source tree

```text
src/
  index.ts
  root.ts

  cli/                         # one Studio Ankh provider
  host/                        # Bun/Fastify/filesystem edges and host composition
  apps/                        # generated applications; Studio-only directory
    <generated-app>/            # generated; never edited by hand
    studio/                     # temporary exception until Studio is generated

  features/                    # Studio-owned capabilities
    auth/
    bindings/
    canvas/
    deploy/
    diagnostics/
    external-apis/
    manifest/
    media/
    modules/
    projects/
    properties/
    routes/
    secrets/
    selection/
    templates/
    workspace/

  utils/                       # the canonical Studio-local utility directory

test/
  acceptance/
  e2e/
  fixtures/
  smoke/
```

`index.ts`, `root.ts`, `cli/`, `host/`, `apps/`, `features/`, and `utils/` are the complete Studio
root taxonomy, apart from required declaration shims. Do not create `app/`, `platform/`, `common/`,
`core/`, `helpers/`, or `shared/`.

Substantial features may contain `contracts`, `domain`, `application`, `ports`, `adapters`, and
focused colocated `tests` when those roles genuinely exist. Do not pre-create role directories.

`apps/` contains complete generator-owned applications. Nothing under it is manually maintained.
`apps/studio/` is a temporary exception while Studio is still hand-authored; it must disappear when
the Studio app is generated.

`utils/` is the one canonical local utility directory. It contains only reusable Studio-local,
framework-neutral helpers; behavior with feature semantics remains in that feature, and behavior
reused across repositories belongs in `@ankhorage/utility`.

## Studio CLI

The command tree mirrors paths after the `studio` prefix:

```text
src/cli/
  index.ts
  commands/
    dev.ts
    projects/
      create.ts
      delete.ts
      list.ts
      sync.ts
```

Mappings:

```text
ankh studio dev              -> commands/dev.ts
ankh studio projects create  -> commands/projects/create.ts
ankh studio projects delete  -> commands/projects/delete.ts
ankh studio projects list    -> commands/projects/list.ts
ankh studio projects sync    -> commands/projects/sync.ts
```

`cli/commands/` contains inbound adapters only: parse command input, invoke a feature application
operation, and render the result. It must not own feature rules or external-package integrations.

## Studio host

```text
src/host/
  createStudioHost.ts
  middleware/
  routes/
    <feature>/
```

`host/` contains inbound HTTP, filesystem, and process adapters plus their composition. Route and
middleware modules translate into feature application operations; they do not own feature rules.

`ankh studio workspace install` is not part of the target. Generated apps are standalone and own
their installation. Remove the obsolete command, handler, capability, tests, and documentation
rather than relocating them.

## Current directory disposition

- Root `binding*` modules move into `features/bindings/`.
- Root `canvas*` and insert/placement behavior move into `features/canvas/`.
- Root `projectDeploy*`, host deploy code, deploy routes, and deploy UI converge under
  `features/deploy/`, with host routes remaining in `host/routes/deploy/`.
- Root auth settings/health/OAuth behavior and host auth implementations converge under
  `features/auth/`, with host routes remaining in `host/routes/auth/`.
- Root external API contracts/model code, host API services, routes, and UI converge under
  `features/external-apis/`, with host routes remaining in `host/routes/external-apis/`.
- Root media authoring code, host media implementations, and media UI converge under
  `features/media/`.
- Root module admin code and host module integration converge under `features/modules/`.
- Root project/workspace models, project screens, hooks, project store/generation operations, and
  matching adapters converge under `features/projects/`, `features/templates/`, or
  `features/workspace/` according to actual ownership.
- Root secret API/usage/response behavior and host secret implementations converge under
  `features/secrets/`, with host routes remaining in `host/routes/secrets/`.
- Route and admin-route policy moves under `features/routes/`; the corresponding host adapters stay
  in `host/routes/`.
- Selection, measurement, stationary selection, and canvas interaction behavior must be separated
  between `features/selection/` and `features/canvas/` by actual invariant ownership.
- The current generic `core/` directory disappears; each file moves to its owning feature role or
  package edge.
- The current generic `runtime/` directory is reviewed symbol by symbol. Shared runtime behavior
  moves to `@ankhorage/runtime`; Studio-specific integration becomes a feature-local adapter.
- Feature-specific UI becomes generated-app code under `apps/`; it is never rehomed in a generic
  Studio UI directory.
- Host smoke and acceptance infrastructure moves outside production source to `test/`.

## External package integrations

An Ankhorage or third-party package is connected in the owning feature, not in a global
`platform/` directory. For example:

```text
src/features/templates/
  ports/
    templateCatalogPort.ts
  adapters/
    createAnkhorageTemplatesAdapter.ts
```

The port states the capability that Templates requires. The adapter imports
`@ankhorage/templates`, translates its API, and implements that port. The composition root chooses
the adapter. Do not duplicate an adapter in `host/`, `cli/`, or another feature.

## Utility gates

The existing own-property helpers explicitly marked for Utility extraction should move through
`@ankhorage/utility` before Studio consumes them. Repeated generic unknown-value narrowing should
be evaluated under `@ankhorage/utility/object` or `@ankhorage/utility/value`; semantic payload
parsers remain domain-owned.

## Suggested migration order

Use lower-entanglement domains to prove the structure before moving the largest state models:

1. external APIs;
2. modules;
3. media;
4. secrets;
5. projects and templates;
6. deploy;
7. auth;
8. canvas and selection;
9. routes;
10. manifest.

Reassess cross-package ownership during every unit. Moving a misplaced behavior deeper into Studio
is not a successful migration when another Ankhorage package owns it.
