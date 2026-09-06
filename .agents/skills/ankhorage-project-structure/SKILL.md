---
name: ankhorage-project-structure
description: >
  Design, review, or migrate the source structure of Ankhorage repositories and generated
  applications. Use for directory ownership, package boundaries, package CLI layout, repository
  skill distribution, public entrypoints, or cross-repository cleanup.
---

# Ankhorage Project Structure

Apply the general ownership rules first. Only Studio currently has a mandated source taxonomy.

Before deciding structure:

1. Read the repository `AGENTS.md`, `package.json`, exports, source tree, and representative tests.
2. Load `ankhorage-coding-rules` as the complementary implementation and testing authority.
3. Identify the repository's owning capability.
4. Identify current public subpaths and cross-package release boundaries.

Repository-specific rules may refine this skill, but must not silently reverse package ownership
or dependency direction.

## Primary boundary

An Ankhorage repository/package is the primary bounded capability and independently released
unit. Do not force a Studio directory tree onto libraries, providers, tooling, or generated
applications.

- Independently bindable capabilities belong in standalone packages.
- Substantial responsibilities inside a package use cohesive directories owned by the package.
- Cross-package access uses published APIs and declared dependencies, never sibling source.
- A package owns its application behavior; adapters belonging to another package are not copied
  or proxied locally.

When a package declares an Ankh provider or changes `src/cli/`, always read
[cli.md](references/cli.md).

When classifying a local or cross-repository utility, also read
[utilities.md](references/utilities.md).

When the task is a structural cleanup or migration, also read
[migration.md](references/migration.md). For `ankhorage/studio`, always also read
[studio.md](references/studio.md).

When adding, distributing, or synchronizing repository-local agent skills, read
[skill-distribution.md](references/skill-distribution.md).

## Universal invariants

- Keep only intentional package entrypoints and required declaration shims directly under `src/`.
- Keep one abstraction level and responsibility among siblings.
- Prefer domain ownership over technical dumping grounds such as `common`, `core`, `helpers`,
  `misc`, or `shared`. `utils/` is the canonical local directory for genuine package-level
  utilities.
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

## Studio enforcement

Only `ankhorage/studio` has a mandatory source taxonomy and hexagonal feature architecture. Its
complete allowlist, exceptions, port/adapter rules, and generated-app policy are in
[studio.md](references/studio.md). Other repositories remain structurally unconstrained beyond the
universal invariants until their owning repository is deliberately brought into scope.
