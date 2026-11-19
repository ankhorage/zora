# AGENTS.md

<!-- This file is managed by @ankhorage/devtools. -->

## Repository

Package: `@ankhorage/zora`

Title: ZORA

Provides opinionated React Native and React Native Web UI components, theme primitives, registries, and reader surfaces built on @ankhorage/surface.

Purpose: Give independently released applications a reusable, cross-platform presentation layer with explicit public entrypoints for components, themes, registries, readers, and authoring controls.

Audience:

- React Native and React Native Web application authors who need reusable Ankhorage UI components.
- Maintainers integrating published ZORA components, themes, registries, readers, or authoring controls into independent applications.

## Scope and boundaries

Responsibilities:

- Publish React Native and React Native Web UI components and their public props through explicit package entrypoints.
- Provide theme primitives, component registries, reader surfaces, and selected feature-specific UI entrypoints.
- Compose UI behavior on the published @ankhorage/surface foundation and declared React Native peer dependencies.

Boundaries:

- Does not own application-specific business workflows, persistence, deployment, authentication providers, or infrastructure operations.
- Does not execute capabilities or replace the runtime that interprets application descriptors.
- Does not require consumers to use an Ankhorage application, repository, or unpublished sibling source.

Architecture role: Reusable cross-platform UI and design-system library with feature-owned components and explicit public package subpaths.

Architectural invariants:

- Consumers use published package entrypoints and declared dependencies rather than sibling source imports.
- React, React Native, and platform-specific integration remain declared peer or package dependencies at the UI boundary.
- Application workflows and provider-specific side effects remain outside the component library.

## Current architecture only

Only the current Ankhorage architecture is valid. Do not add or retain deprecated APIs,
compatibility aliases, shims, dual old/new paths, historical-state fallbacks, or migrations whose
sole purpose is supporting obsolete states. Remove superseded implementations instead.

When a canonical change affects another repository, update that repository to the latest released
public API instead of preserving compatibility locally. Cross-package usage must go through
published public APIs and declared dependencies, never sibling source files.

Current-runtime error handling and canonical database or infrastructure migrations remain valid
when they support states that the current architecture can intentionally produce.

## Standalone contract

Every repository managed by `@ankhorage/devtools` is standalone. It must be independently
installable, buildable, testable, and usable from its own checkout using only declared dependencies
and explicit configuration. It must not require sibling repositories, sibling source imports,
`workspace:`, `file:`, or `link:` dependencies to unpublished packages, hidden
organization-local state, or assumptions about a specific consuming application, infrastructure,
hosting provider, web server, container runtime, or deployment topology.

Published packages are additionally consumer-agnostic and reusable outside Ankhorage.
Environment- or provider-specific behavior belongs behind explicit configuration and adapters,
never in the package core.

If an existing repository violates this contract, treat that as architecture debt to remove, not
as an exception to preserve.

## Required repository instructions

Before changing any file, read this `AGENTS.md` completely and inspect `.agents/skills/`.
Treat skill selection as a mandatory precondition to editing, then follow every selected skill
through validation and delivery.

- Load `.agents/skills/ankhorage-coding-rules/SKILL.md` for implementation, refactoring, testing,
  review, or pull-request delivery work.
- Load `.agents/skills/ankhorage-project-structure/SKILL.md` when the task changes or reviews
  directory ownership, package boundaries, public entrypoints, cross-repository ownership, type or
  utility placement, or source architecture.
- Load every additional repository-local skill whose description or requirements match the task,
  including skills required by any selected skill. These rules define mandatory minimums, not an
  allow-list; do not skip a useful relevant skill merely because it is not named here.

Do not load unrelated skills merely because they are installed. If the task scope expands, inspect
`.agents/skills/` again and load the newly relevant skills before continuing. Do not substitute
remembered, globally installed, or generic guidance for the repository-local versions.

## Documentation

`README.md` and the configured Paradox output are generated release artifacts. Never edit them
manually, and do not regenerate or commit them in ordinary feature pull requests. Update the owning
Paradox `/*** ... */` comments in `src` and leading `@usage` comments in real
`examples/<example>/...` source files, plus any repository-owned manual documentation outside the
generated output. The managed release workflow runs `bun run docs` after the package version bump
and commits the regenerated artifacts in the release commit.

## GitHub task lifecycle and workspace cleanup

- **Start.** Treat each issue implementation, PR implementation, review, and change request (CR)
  as an independent task. Fetch the current remote default branch and read the applicable issue,
  PR, HEAD, review feedback, and CI state. Use a fresh, uniquely named task checkout or worktree.
  Concurrent tasks must have distinct writable checkout, temporary, build, and cache paths.
- **CRs.** Fetch and check out the current remote PR branch in the new workspace. Preserve PR
  history and scope. Push corrections to the existing PR branch.
- **Delivery.** Run applicable checks. Commit and push all intended changes, then verify that
  GitHub has the intended commit on the correct remote branch. Report the exact HEAD, checks, CI,
  findings, and blockers. Report acceptance that was not run as unverified. Read-only reviews hand
  off their findings without creating a commit. Merge requires explicit authorization.
- **Cleanup.** After handoff, resolve every candidate path and remove only task-owned directories
  whose resolved paths are strictly under the resolved system path for `/tmp` (`/private/tmp` on
  macOS). Refuse candidates that resolve outside that boundary, including through a symlink. Use
  Git-aware removal for worktrees. Preserve workspaces outside the boundary, shared directories,
  other tasks' directories, uncommitted changes, and unpushed commits. If blocked, persist
  recoverable work first and document what must be retained. Report whether cleanup succeeded, was
  skipped, or was blocked.

## Pull requests

Before creating a pull request, run all of these commands in this order and resolve every failure:

```sh
bun run build
bun run check-types
bun run lint
bun run knip:check
bun run changeset
bun run format
```

For repositories that use Changesets, run `bun run changeset` only for release-impacting work.
No Changeset means no release is requested. Never add an empty Changeset to satisfy CI; remove it
for a no-release pull request, or add explicit release intent before validation.

## Skill scripts

Scripts inside an Agent Skill must always be TypeScript files with the `.ts` extension.
JavaScript skill scripts using `.js`, `.mjs`, or `.cjs` are not allowed. Run TypeScript
skill scripts with Bun.
