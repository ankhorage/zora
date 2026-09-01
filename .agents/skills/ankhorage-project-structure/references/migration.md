# Structural Migration

Use this reference when the user requests repository cleanup, file movement, boundary correction,
or adoption of the project structure.

## Establish the target first

Before moving code:

1. inventory direct `src/` files, current domains, entrypoints, tests, and generated sources;
2. inventory package exports and consumers of public subpaths;
3. classify the repository profile;
4. identify code that belongs in another package;
5. define the intended final directory tree and dependency direction;
6. identify Utility additions and release gates;
7. identify obsolete behavior that should be deleted rather than relocated.

Do not begin with a mechanical folder move while ownership remains unresolved.

## Migration units

Migrate cohesive domains or vertical capabilities, not arbitrary batches of similarly named files.
For each unit:

1. extract any required cross-repository utility first;
2. release the owning package before updating consumers;
3. move domain/application code and tests together;
4. move concrete edge behavior to its package-level adapter area;
5. preserve intentional public package subpaths by remapping exports to nested output;
6. remove obsolete barrels, aliases, and duplicate paths;
7. validate the focused unit before the full repository gates.

Avoid a single repository-wide move when smaller coherent migrations give clearer review and
rollback boundaries. Avoid tiny PRs that leave two competing architectures active for long periods.

## Root source policy

At the target state, direct `src/` files are limited to intentional entrypoints such as `index.ts`,
`root.ts`, required environment declarations, or other explicitly documented build entrypoints.
Public export status alone does not justify root placement.

## Acceptance and enforcement

After the structure is proven in a representative repository:

- distribute the canonical structure skills through `ankh devtools sync` into
  `.agents/skills/<skill-name>/` as described in
  [skill-distribution.md](skill-distribution.md);
- add Devtools import-boundary rules where static enforcement is reliable;
- add Doctor profile checks for allowed root files and required package entrypoints;
- use Knip to verify public exports and dead compatibility barrels;
- keep repository `AGENTS.md` focused on repository-specific ownership rather than duplicating this
  skill.

Enforcement belongs to Devtools and Doctor, not prose-only repository exceptions.

## No behavior drift

A structural migration preserves current valid behavior unless deletion is an explicit part of the
approved target architecture. Do not add compatibility implementations solely because files move.
Use characterization or focused public-surface tests when a move crosses a meaningful boundary.
