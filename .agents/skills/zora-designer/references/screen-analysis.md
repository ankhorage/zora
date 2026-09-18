# Supplied Screen Recognition

Read this reference when the user supplies an existing UI screenshot or screen design and asks to
reconstruct it, determine its ZORA components, convert it to a manifest screen, or use it as the
starting point for a redesigned screen.

This path analyzes supplied evidence. It does not replace `screen` or `screens` generation.

## Run deterministic recognition first

Before free-form visual interpretation, inspect the released owners and run the local analyzer from
the target repository:

```text
bun .agents/skills/zora-designer/scripts/owner-api.ts inspect
bun .agents/skills/zora-designer/scripts/analyze-screen.ts screen-analysis-input.json
```

The analyzer uses the current composed ZORA metadata, including every installed
`@ankhorage/zora-*` plugin, and delegates image processing to released
`@ankhorage/utility/image`:

```text
supplied image
  -> Sharp normalization
  -> OpenCV geometry and visual graph
  -> optional local Tesseract OCR
  -> owner-metadata component matching
  -> global tree validation
  -> Contracts ScreenSpec
```

No remote model or API is required for this pass.

## Input

Write one temporary JSON input file in the target repository. Image paths are resolved from the
target repository root.

```json
{
  "image": "design/screens/home.png",
  "screen": {
    "id": "home",
    "name": "Home",
    "title": "Home"
  },
  "minConfidence": 0.42
}
```

OCR is supplementary. Enable it only when local trained data is available and text evidence helps
distinguish visually similar components:

```json
{
  "image": "design/screens/home.png",
  "screen": { "id": "home", "name": "Home" },
  "ocr": {
    "langPath": "./tessdata",
    "language": "eng"
  }
}
```

Geometry-only analysis remains valid if OCR setup or recognition fails; the output records an OCR
diagnostic instead of replacing the visual graph.

## Local engine boundary

`@ankhorage/utility` owns the image implementation. The target authoring repository supplies the
optional native/WASM engines required by the recognition path. If they are absent, install them as
development tooling:

```text
bun add -D sharp @techstark/opencv-js
```

Do not add a copied matcher, OpenCV wrapper, fallback parser, remote vision service, or alternate
component catalogue to the skill.

## Treat the result as evidence

The analyzer returns:

- canonical Contracts `ScreenSpec`;
- visual graph evidence;
- aggregate confidence;
- ranked component candidates by region;
- unresolved diagnostics;
- the exact composed component names and owner/plugin version provenance used for the pass.

Use the generated `ScreenSpec` as the structural baseline. Do not discard a high-confidence exact
metadata match merely because another component looks visually similar.

When confidence is low, preserve the analyzer's alternatives and resolve the ambiguity using the
screen's semantic responsibility and the user's stated product intent. If metadata declares an
unresolved element, the analyzer uses that explicit owner-owned gap instead of inventing a ZORA
component or prop.

## Refine only what pixels cannot prove

After recognition, reason about the parts a static image cannot establish reliably:

- purpose and primary task;
- actions and event bindings;
- navigation and back/cancel behavior;
- state transitions and validation;
- data sources and bindings;
- accessibility and focus behavior;
- responsive behavior beyond the observed viewport;
- loading, empty, error, offline, pressed, selected, and other unseen states.

Then run the normal `screen` composition rules and owner-backed manifest validation. A screenshot is
visual evidence, not proof of runtime behavior.
