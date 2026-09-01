# AGENTS.md

<!-- This file is managed by @ankhorage/devtools. -->

## Repository

Package: `@ankhorage/zora`

Opinionated React Native and React Native Web UI kit built on @ankhorage/surface.

## Current architecture only

Only the current Ankhorage architecture is valid. Do not add or retain deprecated APIs,
compatibility aliases, shims, dual old/new paths, historical-state fallbacks, or migrations whose
sole purpose is supporting obsolete states. Remove superseded implementations instead.

When a canonical change affects another repository, update that repository to the latest released
public API instead of preserving compatibility locally. Cross-package usage must go through
published public APIs and declared dependencies, never sibling source files.

Current-runtime error handling and canonical database or infrastructure migrations remain valid
when they support states that the current architecture can intentionally produce.

## Project structure

For directory ownership, package boundaries, architectural profiles, ports and adapters, public
entrypoints, or cross-repository structural work, load and follow
`.agents/skills/ankhorage-project-structure/SKILL.md`.
