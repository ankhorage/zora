---
name: zora-designer
description: >
  Configure an owner-backed application design, generate or recognize screens, audit supplied
  evidence, and author portable Ankhorage templates. Use for category-driven design decisions,
  ZORA screen generation or reconstruction, visual audits, or template creation.
---

# ZORA Designer

Design, recognize, audit, and author through the target repository's released owner APIs. The
complete `AppManifest` is runtime authority; `zora-designer.md` and generated screen images are
design evidence.

## Route the request

- `interactive`: run the progressive configuration conversation in
  [workflow.md](references/workflow.md). Do not create code or images before confirmation.
- `screen`: resolve the configuration, then read [screens.md](references/screens.md) and design one
  screen.
- `screens`: resolve the configuration, then read [screens.md](references/screens.md) and design an
  ordered series with shared navigation, state, geometry, and tokens.
- `recognize`: when the user supplies an existing UI screenshot/screen design and asks to
  reconstruct it, determine ZORA components, or convert it to a manifest screen, read
  [screen-analysis.md](references/screen-analysis.md) and run programmatic recognition before
  free-form visual interpretation.
- `audit`: read [audit.md](references/audit.md) and evaluate supplied image or runtime evidence.
- `template`: resolve the configuration and screen model, then author one portable template through
  the workflow below.

Natural language is enough. Treat short replies as answers to the current question, not permission
to infer later decisions. A reply such as “go on” advances to the next unresolved decision. Only an
explicit request such as “accept all recommended values” resolves the remaining recommendations at
once.

## Start with the owners

From the target repository, run:

```text
bun .agents/skills/zora-designer/scripts/owner-api.ts inspect
```

Use its installed owner output for categories, recommendations, harmonies, tone pairs, navigation
types, ZORA elements, events, recipes, and version provenance. Never copy owner catalogs, component
schemas, token inventories, color algorithms, action types, or manifest implementations into this
skill.

The inspection composes metadata-only descriptors from every installed `@ankhorage/zora-*` plugin;
use those plugin elements exactly like ZORA core elements and keep their package provenance.

For supplied-screen reconstruction, continue through `recognize` and treat the local analyzer's
`ScreenSpec`, visual graph, confidence, alternatives, and unresolved diagnostics as the structural
evidence baseline. Do not ask an image model to redo deterministic geometry/component matching.

Compile chosen values with the same helper before composing screens. Inspect both computed modes,
including their resolved Surface themes and all owner diagnostics. Never hand-calculate a value the
owner exposes.

## Preserve the complete UX

For every screen region, prefer the exact semantic ZORA element supported by current metadata.
Visual resemblance alone is insufficient. If programmatic recognition leaves multiple plausible
candidates, resolve them from semantic responsibility and stated product intent while preserving the
ranked alternatives as evidence.

If no exact element exists, preserve the requested UX with an explicit owner-supported unresolved
placeholder when available, and record the capability gap. For ordinary design composition where no
unresolved manifest element is applicable, use an obvious supported placeholder such as a
secondary-surface `Box` and record the capability gap. Do not invent props, application components,
or successful behavior.

Bind every interaction expressible by installed Contracts and ZORA event metadata. Leave an
unsupported interaction visibly present and explicitly unbound without blocking unrelated design
work. Release validation still decides whether the complete manifest is shippable.

## Template output

For every creation mode, read [runtime-assets.md](references/runtime-assets.md). Inventory icons
and images during configuration, produce separate reusable files with the screens, and carry the
same checked asset bundle into template generation. Direct template requests prepare that bundle
before scaffolding as well.

A Templates repository template is exactly one portable unit:

```text
src/templates/categories/{appCategory}/{slug}/
  createAppManifest.ts
  assets/
    screens/
    images/
      svg/
```

`createAppManifest.ts` default-exports a function returning the complete `AppManifest`.
`assets/screens/` contains design evidence only. Runtime media uses real application image regions
under `assets/images/`, with vector icons under `assets/images/svg/`. Rebuild text, controls,
surfaces and layout with ZORA; use `Icon source` and `Image` for the corresponding asset references.

Scaffold only a reviewed, release-valid manifest:

```text
bun .agents/skills/zora-designer/scripts/scaffold-template.ts scaffold-input.json
```

The helper requires `assetBundlePath`, checks files and manifest references before output, copies
runtime assets and screen evidence, and regenerates discovery from the filesystem. Do not add
category registries, seed definitions, fallback templates, compatibility paths, or per-template
barrels.

## Validate before handoff

- confirm the interactive decision sequence completed or the user explicitly accepted remaining
  recommendations;
- for supplied image reconstruction, run `recognize` before semantic refinement and retain its
  confidence/alternative/gap evidence;
- compile light and dark independently through installed owner APIs;
- validate selected ZORA nodes, props, events, actions, and complete manifest contracts;
- run the screen composition gate from [screens.md](references/screens.md) before returning screen
  output;
- keep unsupported interactions and capability gaps explicit;
- keep concept screens separate from runtime assets;
- validate the separate asset bundle before screen delivery and its manifest usages before template
  scaffolding; report visual review and runtime verification separately;
- for deterministic artifact shape, read [artifact.md](references/artifact.md).
