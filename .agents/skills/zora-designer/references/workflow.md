# Owner-Backed Interactive and Template Workflow

Use this workflow for `interactive`, `screen`, `screens`, and `template`. Ask only about unresolved
decisions, one decision at a time. Show the owner recommendation first with a short reason. Do not
silently accept later recommendations because an earlier answer was brief.

## 1. Inspect intent and owners

Read repository instructions, an existing manifest or `zora-designer.md`, installed fonts, platform
configuration, and relevant screens. Run:

```text
bun .agents/skills/zora-designer/scripts/owner-api.ts inspect
```

The output is the choice source. Do not use remembered categories, color options, tone pairs,
navigator types, ZORA elements, or events. Resolve explicit user input before project state,
existing brief values, category recommendations, and global defaults. Record the origin of every
resolved decision.

## 2. Ask in dependency order

Advance through this sequence. Skip only a value already supplied or reliably discovered.

1. **Category and intent.** Resolve the canonical app category, product name, audience, and primary
   task. For `screen` and `screens`, audience and primary task are required.
2. **Platform and theme coverage.** Resolve mobile, desktop, or responsive scope; technology;
   input modes; target viewport or content constraints; light, dark, or both; and the default mode
   when relevant.
3. **Primary color.** Show the category recommendations in owner order and any verified project
   brand color. Let the user accept one or supply a CSS color. Preserve the brand seed; the owner
   compiler selects accessible functional steps.
4. **Harmony.** After primary is resolved, show the category recommendation first and only the
   harmony identifiers reported by Color Theory. Explain the visual energy and complexity using the
   owner catalog descriptions.
5. **Tone pairs.** After harmony is resolved, offer the category's separate light and dark
   recommendations, followed by mode-compatible owner entries. Explain that `X-on-Y` means accent
   family on foundation family; structural foregrounds remain independently resolved semantic
   tokens.
6. **Typography and profile.** Resolve a verified body font, optional heading pairing, density,
   shape, motion, and contrast target. Do not install fonts. Offer the category/profile
   recommendation first and allow the user to accept the recommended system settings together.
7. **Screens.** Ask for the ordered screen list and purpose of each screen. Then establish the
   primary action, essential content, required data states, and continuity across the series. Do not
   generate images yet.
8. **Navigator.** After the screen topology exists, offer only Contracts navigator types and map
   every route, initial route, hidden/detail route, back/cancel path, and primary-navigation label.
9. **Compile and confirm.** Compile both theme modes through the owner helper. Summarize high-impact
   decisions, origins, diagnostics, unsupported capabilities, screen order, and route topology. Ask
   for confirmation before creating screen images, code, or a template.

If the user changes an earlier decision, invalidate and revisit only dependent later decisions.
Changing primary invalidates harmony-derived compilation and tone output but does not erase the
screen brief. Changing the screen list invalidates navigator confirmation.

## 3. Compile owner output

Provide the resolved `category`, theme overrides, navigator, screens, and region decisions to:

```text
bun .agents/skills/zora-designer/scripts/owner-api.ts compose design-input.json
```

Use owner-returned theme configuration, generated roles, computed Surface themes, diagnostics,
component metadata, and manifest composition. Light and dark are independent compilations; never
derive dark mode by inversion. A failed owner diagnostic remains visible. Do not replace it with
local math or an undocumented token.

For every region, validate its exact component name, props, allowed-parent relationship, and event
metadata. Use supported navigation and actions when available. Represent missing capability without
removing the intended flow or inventing a contract.

## 4. Produce the requested deliverable

- `interactive`: write or return the confirmed `zora-designer.md`; do not produce screen images or
  implementation unless requested.
- `screen` or `screens`: read [screens.md](screens.md), create the screen specification, then produce
  only the requested image, code, or manifest deliverable.
- `template`: author a complete `AppManifest`, validate it in release mode, generate or extract every
  required runtime image, and run the Templates scaffolder.

For design-first templates, store reference images under `assets/screens/` and crop only real image
content into `assets/images/`. For direct authoring, generate application images directly under
`assets/images/`. Runtime media never references a complete screen image.

## 5. Delivery checks

- every decision is explicit, discovered, or carries a recorded default origin;
- both theme modes compile without hidden local fallback calculations;
- the screen model and navigator agree;
- every selected ZORA node and prop is metadata-supported;
- supported events/actions are bound and unsupported behavior is recorded;
- screen generation passes the composition gate;
- release templates contain one default-exported `createAppManifest()` and bundled media paths;
- the complete manifest validates against the installed owner contract.
