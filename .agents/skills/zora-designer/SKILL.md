---
name: zora-designer
description: >
  Design one application screen or an ordered screen series, audit a URL or supplied image
  evidence, and author an Ankhorage Templates manifest or starter using installed ZORA metadata
  and theme APIs. Use for category-driven design decisions, design audits and scoring, visual
  reconstruction with ZORA elements, or template creation. Do not use for illustration-only work.
---

# ZORA Designer

Design, audit, and author through the target repository's released owner APIs. Keep
`zora-designer.md` as review evidence; the application manifest and owner contracts remain runtime
authority.

## Route the request

- `interactive`: resolve a design configuration without silently creating code or images.
- `screen`: design one screen and, when requested, produce a concept image or implementation.
- `screens`: design a coherent ordered series with shared navigation, state, and tokens.
- `audit`: evaluate a URL, one supplied image, or an ordered image series with explicit evidence.
- `template`: compose a canonical `AppManifest`; in Templates, scaffold the normal starter source
  and registry entry.

Natural language is enough. Ask only when an unresolved choice would materially change the output.
Read [workflow.md](references/workflow.md) for the ordered process and capability gates.

## Start with the owners

From the target repository, run:

```text
bun .agents/skills/zora-designer/scripts/owner-api.mjs inspect
```

The helper loads public exports from installed `@ankhorage/templates`, `@ankhorage/zora/theme`, and
`@ankhorage/zora/metadata`. If it reports a missing or outdated owner, update the released package
through the repository's normal dependency workflow. Never copy a catalog, token inventory, color
algorithm, theme compiler, component schema, or manifest implementation into this skill.

Use owner terminology verbatim: `GeneratedColorRole`, `ThemeTokens.colors`, `ThemeSemantics`, and
`SemanticColorToken`. Do not introduce aliases or naming cleanup here.

## Preserve decisions and evidence

Resolve values in this order: current request, current session, verified project state, confirmed
existing brief target, category preset, then safe global default. Record an origin for each value.
Keep target design separate from observed runtime state and report drift rather than overwriting one
with the other.

For scoring, evidence limits, release gates, and finding rules, read
[audit.md](references/audit.md). For deterministic `zora-designer.md` shape and serialization, read
[artifact.md](references/artifact.md).

## Compose only supported ZORA elements

Inspect `ZORA_COMPONENT_META` and `ZORA_THEME_RECIPE_META`. Map a source region only when the
element's semantic responsibility, structure, states/interactions, accessibility contract, props,
events, and data requirements fit. Visual resemblance alone is insufficient.

If no exact element fits:

1. use the metadata-backed `MissingElement` draft node at that location;
2. record the evidence, warning, requested capability, and application blocker;
3. create or link a ZORA owner issue;
4. stop release application until a released real element replaces it.

Never disguise the gap with a generic container, invented prop, or custom application workaround.

## Capability truthfulness

- Concept image output requires an available image-generation capability.
- URL intake and authoritative runtime screenshots require a browser/runtime capture capability.
- Image audits require the supplied original image or ordered series.

When a required capability or source is unavailable, report that deliverable or evidence scope as
blocked. Do not simulate an image, browser observation, or runtime proof. Clearly distinguish
generated concept images from authoritative runtime captures.

## Validate before handoff

- Compile the category design and both theme modes through installed owner APIs.
- Validate manifest composition and preserve every owner diagnostic.
- Confirm every manifest node and recipe against current ZORA metadata.
- Run deterministic audit arithmetic when an audit is in scope.
- Keep screenshot-only behavior `not-assessable`.
- Require a ready application gate before release; a score never overrides a blocker.
- Update `zora-designer.md` and report target/runtime drift, unsupported capabilities, and owner
  issues.
