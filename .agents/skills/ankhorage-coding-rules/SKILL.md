---
name: ankhorage-coding-rules
description: >
  Implement, refactor, test, review, or hand off code changes in Ankhorage repositories. Use for
  task branches and pull requests, canonical lint compliance, behavior-focused testing, Paradox
  function documentation, validation, and release-quality delivery. Use ankhorage-project-structure
  as well when the task changes package ownership, public entrypoints, or source architecture.
---

# Ankhorage Coding Rules

Deliver focused changes that satisfy the repository's current canonical policy and are ready for
review. Read the repository `AGENTS.md`, package scripts, public exports, representative tests, and
documentation ownership before editing.

Repository instructions may add stricter requirements. They must not be bypassed with local
exceptions or replaced by generic preferences from this skill.

## Git and delivery

- For a new task, fetch the latest `origin/main` and create a fresh task branch from it. Never
  implement directly on `main`.
- Continue existing pull-request work on its existing branch. Do not create a nested task branch.
- Preserve unrelated or dirty user work. Use an isolated worktree when changing branches would
  disturb it.
- Keep the diff within the requested issue. Do not mix opportunistic cleanup into the change.
- Deliver coding work through a pull request. If remote writes are unavailable or unauthorized,
  prepare the branch and report the pending push or PR explicitly.
- Describe the change, architectural effect, validation, public API and changeset impact,
  documentation impact, and linked issue in the PR body.

## Canonical lint compliance

- New and materially changed code must satisfy the canonical ESLint configuration.
- Never add, widen, or depend on `eslint.local.config.mjs` exceptions. Existing exceptions are
  removable migration debt, not policy for new work.
- Do not weaken rules or add suppression comments, unsafe casts, or similar bypasses merely to make
  validation pass.
- Resolve size, complexity, and related findings around cohesive responsibilities and clear data
  flow. Do not split a function or file mechanically just to cross a threshold.
- Prefer reusable pure transformations, immutable values, and explicit inputs and outputs. Keep
  unavoidable mutation and external side effects at clear boundaries.
- Keep one canonical implementation. Do not add compatibility aliases, dual paths, historical-state
  fallbacks, or sibling-source imports.

## Testing

- Test observable behavior at the owning boundary. Keep tests deterministic and independent of
  execution order, ambient state, and live network services.
- When testing dependency declarations, assert the required semver range shape or a shared policy
  value instead of a Renovate-managed literal version. Assert an exact version only when the pin is
  itself the contract under test.
- Follow the range-shape patterns in the
  [Devtools repository sync test](https://github.com/ankhorage/devtools/blob/main/src/cli/runRepositoryCommand.test.ts)
  and [ZORA PR #313](https://github.com/ankhorage/zora/pull/313).
- Run focused unit or integration tests before full E2E and smoke suites.
- Do not rerun an unchanged E2E or smoke failure without a new hypothesis. After two unsuccessful
  full reruns without a substantive code or configuration change, stop cycling, inspect logs and
  artifacts, and report the blocker.

## Paradox documentation

- Give every named production function under `src` a concise Paradox `/*** ... */` description,
  including internal helpers. Inline callbacks are exempt.
- Add `@param`, `@returns`, `@example`, or `@readme` to public APIs only when the tag adds useful
  information.
- Update documentation sources and regenerate tracked Paradox output. Never hand-edit generated
  README or Paradox artifacts.

## Public API and release quality

- Export public symbols intentionally from canonical entrypoints and exercise those exports in
  tests. Do not introduce consumer deep imports.
- Add the repository-required changeset for published behavior, package shape, dependency, or
  public API changes.
- Justify new dependencies and keep generated artifacts, lockfiles, and package metadata aligned
  with the repository's owning workflows.
- Review the final diff, then run the applicable build, lint, test, typecheck, Knip, format, docs,
  changeset-status, and packaging checks.
- Report the exact commands run and any omissions or failures. Do not imply a fully green handoff
  when a required check did not run or pass.
