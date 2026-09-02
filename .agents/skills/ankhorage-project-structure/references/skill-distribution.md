# Repository Skill Distribution

Use this reference when adding Ankhorage-owned skills to repositories or changing Devtools
synchronization.

## Canonical destination

Repository-local skills live at:

```text
.agents/
  skills/
    <skill-name>/
      SKILL.md
      agents/             # optional
      references/         # optional
      scripts/            # optional
      assets/             # optional
```

The directory name must equal the skill's frontmatter `name`. Synchronize the complete skill
directory, not only `SKILL.md`. Do not use `.agent/`, `.codex/skills/`, or a package source
directory as the shared repository location.

## Devtools ownership

`@ankhorage/devtools` is the distribution authority for canonical Ankhorage-owned repository
skills. It packages immutable skill sources with the released Devtools version; synchronization
must not fetch mutable files from GitHub at runtime.

The aggregate commands include the skills scope:

```text
ankh devtools sync [target]
ankh devtools status [target]
```

Also expose focused commands for diagnosis and intentional updates:

```text
ankh devtools skills sync [target]
ankh devtools skills status [target]
```

Their provider capabilities are `devtools.skills.sync` and `devtools.skills.status`.

## Skill selection

Do not copy every available skill into every repository.

- Devtools defines a small baseline of organization-wide Ankhorage skills.
- Profile-specific Ankhorage skills are selected from repository traits or explicit package
  metadata when automatic detection would be ambiguous.
- External, personal, experimental, and task-specific skills are not part of Devtools sync.
- A repository may own additional skill directories beside the Devtools-managed set.

The `zora-designer` profile skill is selected for the ZORA, Templates, and Studio owners and for
generated-app authoring repositories that consume ZORA with the Ankhorage Runtime, Templates, or
Studio application model. Plain libraries and unrelated tooling packages retain only baseline
skills.

Prefer the same repository-trait detection used by other Devtools profiles. Add explicit metadata
only for an actual ambiguity; do not require each repository to repeat a default skill list.

## Managed-tree semantics

Treat each selected canonical skill as an exactly managed directory while preserving the rest of
`.agents/skills/`.

- Create or replace every canonical file in a selected managed skill.
- Remove stale files and obsolete skills only when prior Devtools ownership is recorded.
- Never delete an unowned skill directory or an untracked file merely because it is absent from
  the Devtools bundle.
- Record the managed skill names, relative file paths, source Devtools version, and content hashes
  in a Devtools ownership manifest.
- Make `sync` idempotent. Make `status` and `--dry-run` report created, updated, removed, and
  unchanged paths without mutation.

The ordinary single-file managed-file abstraction is insufficient if it cannot report or remove
stale owned files. Use a managed-tree abstraction or extend the ownership manifest rather than
deleting `.agents/skills/` wholesale.

## Suggested Devtools source layout

Keep the package-level CLI edge separate from synchronization policy and packaged skill assets:

```text
src/
  cli/
    commands.ts
    runRepositoryCommand.ts
  tools/
    skills/
      index.ts
      managed.ts
      selection.ts
      assets/
        <skill-name>/
          SKILL.md
          ...
```

The exact filenames may follow the existing Devtools conventions. The important boundaries are:

- `src/cli/` declares and dispatches `skills sync` and `skills status`;
- skill selection and managed-tree policy stay outside the CLI;
- packaged skill directories are release artifacts, not runtime network dependencies.

## Validation

Doctor should validate that:

- every selected managed skill exists at `.agents/skills/<skill-name>/`;
- directory and frontmatter names agree;
- managed files match the released Devtools bundle;
- the ownership manifest contains no unsafe paths;
- repository-owned skills remain permitted and are not falsely reported as drift.

Devtools remains responsible for applying and reporting synchronization. Doctor reports contract
violations; it does not rewrite skill trees.
