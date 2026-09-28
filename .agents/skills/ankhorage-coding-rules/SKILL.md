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
- Use functional programming by default: declare bindings with `const`, not `let`; write pure
  functions with explicit inputs and outputs; and use immutable data and updates. Keep side effects
  explicit and at system boundaries. Mutation or reassignment is allowed only for a clearly
  justified boundary or demonstrated performance-critical path, and must remain locally contained.
- Keep one canonical implementation. Do not add compatibility aliases, dual paths, historical-state
  fallbacks, or sibling-source imports.

## Comments and Paradox documentation

- Give every named production function under `src` a concise Paradox `/*** ... */` comment,
  including exported functions and internal named helpers. Inline callbacks are exempt.
- Use ordinary inline comments when they explain non-obvious intent, invariants, constraints, or the
  reason behind a decision. Do not narrate self-explanatory code or duplicate what names and types
  already express.
- Paradox documentation metadata belongs only inside `/*** ... */` comments. The canonical tag
  vocabulary is owned by `@ankhorage/policy`: `@readme`, `@usage`, `@config`, `@title`,
  `@see`, and `@security`. Unsupported tag-shaped lines are invalid; `@example` does not exist.
  Do not use JSDoc-only tags such as `@param` or `@returns` as Paradox metadata.
- Paradox comments contain documentation prose and metadata only. Fenced or indented code blocks are
  invalid; source examples come from real code. Inline code spans remain valid prose.
- Add a supported Paradox tag only when it changes or usefully enriches generated documentation;
  plain function descriptions do not need tags.
- README usage documentation must come from a real repository-root `examples/<example>/...` source
  file. A package that opts into `@usage` must have exactly one example combining `@usage`,
  `@readme`, and `@title`; additional `@usage` examples remain full-doc-only. Do not create
  dedicated `readme-usage`, `usage-readme`, `readmeUsage`, or equivalent source modules whose
  only purpose is feeding README usage text.
- Configuration documentation is optional until a package opts in. Once it does, the canonical schema
  is `src/types/config.ts` with exactly one root type/interface carrying `@config`, `@readme`,
  and `@title`.
- Update documentation sources in the pull request, including repository-owned manual documentation
  outside the configured generated output. Never hand-edit generated README or Paradox artifacts.
- Generated documentation is release-owned. Ordinary feature pull requests must not regenerate or
  commit `README.md` or the configured Paradox output. The managed release workflow runs
  `bun run docs` after the package version bump and commits the result in the release commit.
- Run `bun run docs` locally only when the task explicitly changes or validates Paradox generation;
  do not commit that generated diff from an ordinary feature pull request.

## Testing

- Test observable behavior at the owning boundary. Keep tests deterministic and independent of
  execution order, ambient state, and live network services.
- Do not hardcode package versions in tests. When testing dependency declarations, assert the
  required semver range shape or a shared policy value instead of a Renovate-managed literal
  version. Assert an exact version only when the pin is itself the contract under test.
- Follow the range-shape patterns in the
  [Devtools repository sync test](https://github.com/ankhorage/devtools/blob/main/src/cli/runRepositoryCommand.test.ts)
  and [ZORA PR #313](https://github.com/ankhorage/zora/pull/313).
- Run focused unit or integration tests before full E2E and smoke suites.
- Do not rerun an unchanged E2E or smoke failure without a new hypothesis. After two unsuccessful
  full reruns without a substantive code or configuration change, stop cycling, inspect logs and
  artifacts, and report the blocker.

## Public API and release quality

- Export public symbols intentionally from canonical entrypoints and exercise those exports in
  tests. Do not introduce consumer deep imports.
- Add the repository-required changeset for published behavior, package shape, dependency, or
  public API changes.
- Justify new dependencies and keep generated artifacts, lockfiles, and package metadata aligned
  with the repository's owning workflows.
- Review the final diff, then run the applicable build, lint, test, typecheck, Knip, format,
  changeset-status, and packaging checks. Run documentation generation only when explicitly needed
  to validate documentation tooling behavior.
- Report the exact commands run and any omissions or failures. Do not imply a fully green handoff
  when a required check did not run or pass.
