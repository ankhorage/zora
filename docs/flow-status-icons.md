# Flow node status icons

`src/features/flow-status/assets/` contains the visual source set for the two node-status symbols evidenced by the approved Process Engine reference canvas. The assets are presentation-only: they do not define Flow runtime state, persisted fields, or a public ZORA component API.

| Code        | Label              | Source           | Color role  | Shape                                |
| ----------- | ------------------ | ---------------- | ----------- | ------------------------------------ |
| `completed` | Completed          | Reference canvas | `success`   | Filled circle with a white checkmark |
| `waiting`   | Waiting for review | Reference canvas | `attention` | Amber outlined clock                 |

Use an asset only when a caller explicitly supplies that presentation state. An omitted state is unknown or not displayed; it must not resolve to `completed`.

## Rendering and accessibility

Each self-contained SVG has a `24 × 24` viewBox, title, description, and a distinct shape so it remains meaningful without color. Render the glyph at 16–18px for a node badge or up to 24px where space permits. The SVGs use `currentColor` with their reference color as a default; a future FlowNode composition must provide a ZORA/Surface semantic color through the existing `Icon` media path rather than add a new SVG renderer.

The host component remains responsible for its accessibility contract. It should expose the supplied status in its accessible node label, or hide a decorative duplicate from assistive technology. The visual SVG title and description do not replace that runtime label.

## State boundary and proposals

The source canvas establishes only `completed` and `waiting` as node-status presentations. It shows **Draft** as a process-wide chip, not a node execution status. Consequently this source set deliberately excludes `draft`, `running`, `queued`, `failed`, `paused`, `skipped`, and `cancelled`: ZORA has no approved public Flow lifecycle contract that maps them to node states.

If a Flow owner later approves a lifecycle mapping, that work must first establish the owner-side public contract. A follow-up may then add a presentation mapping and any separately reviewed proposal glyphs. It must not infer execution truth from presentation or from the absence of a status.

## Provenance

The accompanying [manifest](../src/features/flow-status/assets/manifest.json) records the approved source image identity, asset provenance, semantic color roles, and the intentional exclusion of proposals. The [preview](../src/features/flow-status/assets/preview.svg) is a side-by-side contact sheet for review; it is design evidence, not a runtime capture.
