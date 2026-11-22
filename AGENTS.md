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

## Task authority and scope

The user's explicit requirements and acceptance criteria define the
authorized scope. Scope is frozen unless the user explicitly changes it.

- Implement exactly the requested outcome. Never invent requirements.
- No unsolicited features, refactoring, redesign, migrations,
  abstractions, compatibility layers, or architectural improvements.
- Change only files necessary for the task, including relevant tests,
  documentation sources, and release metadata.
- Existing defects, architecture debt, and reviewer suggestions do not
  authorize additional work.
- Repository rules and skills define HOW authorized work is implemented,
  never WHAT additional work may be performed.
- Never weaken mandatory quality, security, or validation requirements.

If correct implementation requires work outside scope, STOP.
Explain the blocker and wait for explicit user instructions.
Never independently expand scope or improvise workarounds.

STOP always means graceful stop: cease implementation, preserve and
remotely hand off task work, document blockers, and safely clean up
according to the delivery rules below.

Do not stop for unrelated cosmetic issues or optional improvements.

## Architecture and dependencies

Only the current Ankhorage architecture is valid.

- No deprecated APIs, compatibility shims, historical fallbacks,
  or dual implementation paths.
- Remove superseded implementations only within authorized work.
- Temporary migration paths require explicit authorization.
- Repositories must remain standalone, independently installable,
  buildable, testable, and usable with declared dependencies.
- No unpublished sibling sources, workspace/file/link dependencies,
  hidden organization-local state, or implicit deployment assumptions.
- Cross-package imports must use published public APIs.
- Published packages must remain consumer-agnostic.
- Provider-specific behavior belongs behind explicit boundaries.

If implementation requires changes in another repository, STOP.
Identify the repository, required change, and blocker.
Wait for explicit instructions.

Report unrelated architecture violations in a PR Conversation comment
with location, evidence, and impact. Never fix them independently.
Link directly to the comment in the final chat response.

## Dependencies

- Use `bun install` for development and restoring existing dependencies.
- Use `bun update` for authorized existing dependency updates.
- Never add new dependencies without explicit user approval.
- Never downgrade dependencies.
- Do not perform dependency migrations or unrelated refactoring.
- Evaluate reputable existing packages before reimplementing their
  functionality; propose new dependencies for approval.
- Keep `package.json` and `bun.lock` synchronized and commit their changes.
- Use `--frozen-lockfile` for reproducible CI and release builds.

## Managed and generated files

Never directly edit generated or centrally managed files, including
`AGENTS.md`, `CLAUDE.md`, `GEMINI.md`, managed workflows, managed skills,
and generated documentation.

Read-only inspection is permitted.

Changes require explicit user authorization and must be implemented
through the canonical owner or generator.

If a protected file needs changes, STOP and report its owner.
Never modify generated output as a workaround.

## Database and infrastructure

Database schema changes, data migrations, destructive operations,
and infrastructure mutations require explicit task authorization.

Otherwise STOP and report the proposed changes, impact, risks,
and rollback requirements.

Never independently modify database structures or existing data.

## Security

All security findings (P0–P3) are hard blockers.

On detection:

- STOP implementation immediately and perform graceful handoff.
- Report all findings as a prioritized P0–P3 list with evidence.
- Do not fix, bypass, merge, or deploy.
- Wait for explicit user instructions.

This includes pre-existing security vulnerabilities.

## Repository instructions and skills

Before editing, read `AGENTS.md` and inspect `.agents/skills/`.

Load:

- `.agents/skills/ankhorage-coding-rules/SKILL.md`
- `.agents/skills/ankhorage-project-structure/SKILL.md`
- Additional repository-local skills when applicable or required.

Follow applicable skills without expanding task scope.
STOP only when implementation would violate a mandatory requirement.

Never substitute generic or remembered instructions for repository-local
skills.

Skill scripts must use TypeScript (`.ts`) and run with Bun.
JavaScript skill scripts (`.js`, `.mjs`, `.cjs`) are prohibited.

## Documentation

`README.md` and configured Paradox output are release-generated artifacts.
Never edit or commit them in ordinary feature PRs.

Update only relevant Paradox `/*** ... */` comments, real
`examples/<example>/...` usage sources, and necessary manual documentation.

The release workflow regenerates documentation after the version bump.
Do not generate unrelated documentation or examples.

## Testing, validation and review

- Create new unit tests only.
- Never introduce new E2E, smoke, integration, browser, simulator,
  performance, or other non-unit tests without explicit authorization.
- Existing tests of all types may be executed, corrected, and extended
  with directly relevant assertions within the authorized task.
- Never weaken assertions to conceal regressions.
- Run applicable mandatory CI checks without weakening or bypassing them.
- Do not invent additional test matrices or acceptance criteria.
- Recommend additional non-unit tests in the final handoff if useful.
  Their non-creation is not a blocker.

Run existing mandatory build, typecheck, lint, Knip, formatting,
and other quality checks.

- Fix task-introduced failures within scope.
- Report unrelated or pre-existing failures without fixing them.
- Do not repeatedly rerun unchanged failures without new evidence.
- Never disable, bypass, or falsify mandatory checks.

Review against original requirements and mandatory contracts.

Blocking findings require evidence of incorrect requested behavior,
introduced regressions, or mandatory contract violations.
Security findings always follow the Security hard-blocker policy.

Optional improvements and unrelated findings are non-blocking.
Document them in PR Conversation comments.

Reviewers cannot expand scope or introduce acceptance criteria.
Report failed and unverified checks accurately.

## GitHub task lifecycle and delivery

Treat each issue, PR, review, and change request as an independent task.

- Fetch current origin/main, issue, PR, HEAD, review, and CI state.
- Use a fresh isolated checkout or worktree for every task.
- Isolate concurrent workspaces, builds, temporary files, and caches.
- Continue change requests on the existing PR branch.
- Preserve unrelated user work and existing PR history.
- Use Conventional Commits and PR titles.
- Assign all issues and PRs to `artiphishle`.
- Never assign or request PR reviews from any user or team.
- Leave the requested reviewers list empty; report review readiness in the handoff.
- Link issues to PRs and close issues only when completed.
- Never merge without explicit authorization.

Review the final diff and remove unauthorized changes.

For every task with changes, including blocked tasks:

1. Commit all recoverable task changes.
2. Push to the intended remote branch.
3. Verify the exact remote HEAD SHA.
4. Document blockers and findings in the PR.
5. Keep incomplete or blocked PRs in Draft.
6. Safely clean up task-owned temporary workspaces.

A recovery commit does not imply successful completion.

If remote persistence is technically impossible, preserve local work
and report the failed handoff, unpushed commits, and recovery location.
Never discard unpushed work to satisfy cleanup requirements.

Cleanup may remove only task-owned paths strictly beneath the resolved
system `/tmp` path (`/private/tmp` on macOS), using Git-aware removal.

Never remove unrelated work, shared paths, or unpersisted data.
Report cleanup success, failure, or omission.

Read-only reviews report findings without creating commits.

## Pull requests and release preparation

Run applicable mandatory validation:

- `bun run build`
- `bun run check-types`
- `bun run lint`
- `bun run knip:check`
- Relevant unit tests and existing mandatory tests

Create the required Changeset for release-impacting work.
No release impact means no Changeset. Never create empty Changesets.

After Changeset creation, run `bun run format` as the final regular
file-writing validation operation.

Then run applicable read-only checks:

- `bun run format:check`
- `bun run changeset:status`

Include the Changeset file in formatting.
Repeat necessary final checks after subsequent file modifications.

Formatting must not introduce unrelated changes into the final diff.

A Draft PR may document blocked or partially verified work.
Never claim failing or unverified mandatory checks have passed.

Complete the delivery and cleanup process defined above.
