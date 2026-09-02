# Design, Composition, and Template Workflow

Use this workflow for `interactive`, `screen`, `screens`, and `template`. Audit uses the same
compiled target baseline when a redesign is requested; it never fills unknown observed values with
presets and pretends they were measured.

## 1. Establish mode, intent, and evidence

Record the audience, primary task, requested screen or ordered series, platform, input modes,
viewport constraints, target theme modes, available source artifacts, and requested deliverable.
Inspect the current manifest, theme, installed packages, ZORA metadata, fonts, and existing
`zora-designer.md` before prompting.

For an input image or series, decompose each screen into semantic regions. Give each region a stable
evidence ID, purpose, content/data responsibility, state and interaction needs, accessibility needs,
and its relationship to other regions. Preserve image order and original dimensions. Do not map by
appearance alone.

## 2. Build the design in dependency order

Interactive questions and compiler calls follow this exact order. Skip a question only when the
answer is already supplied or reliably discovered.

1. **Category and intent.** Read `APP_CATEGORIES` and `CATEGORY_PRESETS` from Templates. Show the
   preset's ordered primary-color and font-family recommendations and explain that they are starting
   points, not user stereotypes. Defer font activation until its availability and owning loader are
   verified.
2. **Primary color.** Offer the preset's first recommended primary color and any verified project
   brand color. Let the user accept or supply a color. The owner normalizes and validates it.
3. **Harmony.** Only after primary is resolved, show `recommendedHarmonies` and the installed owner
   harmony catalog. Preserve the selected canonical identifier.
4. **Per-mode tone combination.** Show the preset recommendation first, then read all valid choices
   from `TONE_PAIR_CATALOG`. Resolve light and dark independently with `resolveTonePair`; do not copy
   a list into prose or code.
5. **Generated colors.** Call `resolveCategoryDesignPreset` or `compileCategoryDesign`. Inspect
   generated owner roles and diagnostics; never hand-calculate secondary, accent, severity,
   background, neutral, or on-colors.
6. **Computed Surface output.** Inspect `computedTheme.light.surfaceTheme` and
   `computedTheme.dark.surfaceTheme`, including `ThemeTokens.colors`, `ThemeSemantics`, provenance,
   selections, and diagnostics. Record `GeneratedColorRole` and `SemanticColorToken` names exactly.
7. **Composition.** Resolve density, shape, layout, navigation, content hierarchy, states, and exact
   ZORA elements from metadata. Typography recommendations remain advisory until the chosen font is
   verified and the owning app/module can load it; never install or bundle a font implicitly.
8. **Confirmation and output.** Show high-impact choices, their origins, diagnostics, gaps, and the
   requested artifact. Persist runtime state only through the canonical manifest/contracts.

Use separate light/dark tone pairs and owner compilation even when the two modes share a primary
seed. Never generate dark mode by inversion.

## 3. Inspect installed owner APIs

Run from the target repository:

```text
bun .agents/skills/zora-designer/scripts/owner-api.mjs inspect
```

The output reports installed versions, category presets, tone pairs, component metadata, recipe
metadata, and required exports. An error names the missing package/export, minimum owner release,
and update action. There is no fallback calculation.

For deterministic composition, provide JSON to:

```text
bun .agents/skills/zora-designer/scripts/owner-api.mjs compose design-input.json
```

The input contains `category`, optional `theme` overrides, `navigator`, `screens`, and optional
`regions`. Each region has `id`, `requestedCapability`, `screenId`, `parentNodeId`, an optional exact
`component`, explicit `props`, and `evidenceId`. The helper:

- compiles the category through Templates and the released ZORA compiler;
- validates exact component names and props against `ZORA_COMPONENT_META`;
- emits metadata-derived `MissingElement` nodes for unresolved regions;
- composes the canonical manifest in draft mode while a gap exists;
- reports `applicationGate: blocked` and owner actions for every gap;
- preserves Templates and ZORA diagnostics.

The agent remains responsible for semantic matching. A requested component name is an explicit
decision to validate, not a fuzzy-search request.

## 4. Design one screen or a series

For each screen define purpose, information hierarchy, primary action, navigation relationship,
data needs, and relevant default/loading/empty/partial/error/offline/success/disabled/hover/pressed/
selected/focus states. Define narrow and wide behavior where applicable.

For a series also define the shared shell, canonical route topology, state continuity, back/cancel
behavior, shared recipes and terminology, and one common theme. A concept image series must remain
ordered and visually coherent. Label every generated image as a concept; replace it with an actual
runtime capture only after running the manifest.

## 5. Audit a URL, image, or series

For a URL, capture the relevant modes, viewports, and states using a browser/runtime tool. For one
image or a series, retain original dimensions and input order. Every evidence item records location,
observation, evidence level, confidence factor, reproduction, and limitations.

Read [audit.md](audit.md), create a criterion input JSON, and run:

```text
bun .agents/skills/zora-designer/scripts/audit.mjs audit-input.json zora-designer.md
```

Invisible behavior remains `not-assessable` unless source, accessibility-tree, browser, or runtime
evidence supports it. A recommended redesign baseline may use the category workflow but must be
clearly separated from observed implementation.

## 6. Author a canonical template

Use `composeCategoryAppManifest`, `validateTemplateManifest`, and
`assertTemplateManifestReady`. Draft output may contain `MissingElement`; release output may not.

When the target repository is `@ankhorage/templates`, scaffold reviewed composition output with:

```text
bun .agents/skills/zora-designer/scripts/scaffold-template.mjs scaffold-input.json
```

The scaffold input provides the ready manifest, category, template ID, label, description, and
target root. The helper verifies the Templates repository and owner validation, creates a normal
variant `manifest.ts`, `template.ts`, and `index.ts`, and updates the category registry import and
definition deterministically. It refuses existing targets, unsafe identifiers, blocked manifests,
and non-Templates repositories. Review and validate the generated production diff; do not hand-hide
a systemic skill or owner defect.

## 7. Delivery gates

Before application or release:

- every visible/interactive region has an exact metadata-supported element;
- every gap has evidence and a linked ZORA owner issue;
- both modes compile without owner errors;
- the manifest is owner-validated and release-ready;
- required concept-image, runtime-capture, or supplied-image capabilities were actually available;
- target and observed state are clearly separated;
- `zora-designer.md` is deterministic and contains no runtime authority or copied owner catalogs.
