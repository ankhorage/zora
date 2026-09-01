---
name: ankhorage-project-structure
description: >
  Design, review, or migrate the source structure of Ankhorage repositories and generated
  applications. Use for directory ownership, package boundaries, architectural profiles,
  ports and adapters, package CLI layout, repository skill distribution, public entrypoints,
  or cross-repository cleanup.
---

# Ankhorage Project Structure

Apply a repository profile instead of forcing one folder tree onto every package.

Before deciding structure:

1. Read the repository `AGENTS.md`, `package.json`, exports, source tree, and representative tests.
2. Load `ankhorage-coding-rules` and `ankhorage-package-structure` when available.
3. Identify the repository's owning capability and its profile below.
4. Identify current public subpaths and cross-package release boundaries.

Repository-specific rules may refine this skill, but must not silently reverse package ownership
or dependency direction.

## Primary boundary

An Ankhorage repository/package is the primary bounded capability and independently released
unit. Do not create a generic `src/features/` layer that imitates package boundaries.

- Independently bindable capabilities belong in standalone packages.
- Substantial responsibilities inside a package use cohesive domain directories directly under
  `src/`.
- Cross-package access uses published APIs and declared dependencies, never sibling source.
- A package owns its application behavior; adapters belonging to another package are not copied
  or proxied locally.

## Select a profile

Read [repository-profiles.md](references/repository-profiles.md), select one primary profile, and
apply only the references routed by that profile.

| Profile                            | Typical repositories                                          | Required references                                                                                        |
| ---------------------------------- | ------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------- |
| Application, engine, or hybrid     | Studio, Runtime, Orchestrator, Deploy, Infra                  | [hexagonal-architecture.md](references/hexagonal-architecture.md)                                          |
| React Native / Expo application    | generated apps, Studio app host                               | [hexagonal-architecture.md](references/hexagonal-architecture.md), [expo-apps.md](references/expo-apps.md) |
| Component or design-system library | ZORA, Surface                                                 | [ui-libraries.md](references/ui-libraries.md)                                                              |
| Contracts or value library         | Contracts and other portable models                           | [repository-profiles.md](references/repository-profiles.md)                                                |
| Utility library                    | Utility                                                       | [utilities.md](references/utilities.md)                                                                    |
| Platform/provider adapter          | Expo Runtime, Supabase packages, orchestrator modules         | [repository-profiles.md](references/repository-profiles.md)                                                |
| Tooling or CLI package             | Ankh, Doctor, Devtools and any package exposing Ankh commands | [cli.md](references/cli.md)                                                                                |

When a package declares an Ankh provider or changes `src/cli/`, always read
[cli.md](references/cli.md), regardless of its primary profile.

When the task is a structural cleanup or migration, also read
[migration.md](references/migration.md). For Studio specifically, read
[studio.md](references/studio.md).

When adding, distributing, or synchronizing repository-local agent skills, read
[skill-distribution.md](references/skill-distribution.md).

## Universal invariants

- Keep only intentional package entrypoints and required declaration shims directly under `src/`.
- Keep one abstraction level and responsibility among siblings.
- Prefer domain ownership over technical dumping grounds such as `common`, `core`, `helpers`,
  `misc`, or `shared`.
- `app/`, `cli/`, `host/`, and `platform/` are package-level edges or composition areas, not
  alternate owners of domain behavior.
- Ports are owned by the application/domain code that requires the capability.
- Adapters depend inward; domain/application code does not import concrete adapters.
- Add a port only for a real external or replaceable boundary. Do not wrap every function in
  architecture ceremony.
- Colocate focused unit tests. Put cross-domain acceptance, E2E, smoke infrastructure, and large
  fixtures outside production source.
- Public package subpaths may point to nested source. Do not keep files at `src/` merely because
  they are exported.
- Preserve one canonical implementation. Do not add legacy paths, compatibility barrels, or
  duplicate APIs to make a migration appear smaller.

## Ownership decision

For every file or new symbol, decide in order:

1. Which Ankhorage package owns the capability?
2. Which internal domain owns it?
3. Is it core policy, application orchestration, a required port, an edge adapter, composition,
   or a public entrypoint?
4. Is it reusable enough to belong in `@ankhorage/utility` instead?

If any answer is unclear, resolve ownership before moving or creating code.
