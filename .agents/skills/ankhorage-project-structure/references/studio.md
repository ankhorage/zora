# Studio Structure Example

Read this only for `ankhorage/studio`. It is a structural target and ownership checklist, not a
license to move every file in one change.

Studio is an application/hybrid package. The Studio package is the bounded capability; its internal
responsibilities are domains, not independently bound `features`.

## Target source tree

```text
src/
  index.ts
  root.ts

  app/                         # React/RN application edge and composition
  cli/                         # one Studio Ankh provider
  host/                        # Bun/Fastify/filesystem edges and host composition
  platform/                    # Studio-local native/web implementations only

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

  utils/

test/
  acceptance/
  e2e/
  fixtures/
  smoke/
```

Substantial domains may contain `contracts`, `domain`, `application`, `ports`, and domain-local
`utils` when those roles genuinely exist. Do not pre-create all role directories.

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

`ankh studio workspace install` is not part of the target. Generated apps are standalone and own
their installation. Remove the obsolete command, handler, capability, tests, and documentation
rather than relocating them.

## Current directory disposition

- Root `binding*` modules move into `bindings/`.
- Root `canvas*` and insert/placement behavior move into `canvas/`.
- Root `projectDeploy*`, host deploy code, deploy routes, and deploy UI converge under the `deploy`
  domain and package-level edges.
- Root auth settings/health/OAuth behavior and host auth implementations converge under `auth` and
  package-level edges.
- Root external API contracts/model code, host API services, routes, and UI converge under
  `external-apis` and package-level edges.
- Root media authoring code, host media implementations, and media UI converge under `media` and
  package-level edges.
- Root module admin code and host module integration converge under `modules` and package-level
  edges.
- Root project/workspace models, current app project screens, hooks, project store/generation
  operations, and matching adapters converge under `projects`, `templates`, or `workspace` according
  to actual ownership.
- Root secret API/usage/response behavior, host secret implementations, routes, and UI converge
  under `secrets` and package-level edges.
- Route and admin-route behavior moves under `routes`.
- Selection, measurement, stationary selection, and canvas interaction behavior must be separated
  between `selection` and `canvas` by actual invariant ownership.
- The current generic `core/` directory disappears; each file moves to its owning domain or package
  edge.
- The current generic `runtime/` directory is reviewed symbol by symbol. Shared runtime behavior
  moves to `@ankhorage/runtime`; Studio-specific application integration moves to `app/` or its
  owning domain.
- Feature-specific UI moves beside its owning domain. Only package-wide UI composition remains in
  `app/`.
- Host smoke and acceptance infrastructure moves outside production source to `test/`.

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
