# Screen and Screen-Series Design

Read this reference for `screen` and `screens` after the interactive configuration is confirmed.
Generated images are concept evidence; the manifest and ZORA metadata remain implementation
authority.

## Preconditions

Do not generate or implement a screen until these are resolved:

- audience and primary task;
- platform, input modes, theme coverage, and an explicit target viewport or responsive range;
- primary color, harmony, per-mode tone pairs, typography/profile, and compiled owner themes;
- ordered screen list with one purpose and primary action per screen;
- navigator type, route topology, and back/cancel behavior.

If the user supplies only `mobile`, recommend a neutral 390 by 844 logical-point portrait concept
viewport. Ask about iOS- or Android-specific chrome only when it changes the requested result.

## Compose the series before rendering

For every screen record:

1. purpose, primary task, primary action, and success outcome;
2. content hierarchy and exact visible copy;
3. default plus relevant loading, empty, partial, error, offline, disabled, pressed, selected, and
   focus states;
4. route relationship and continuity of selected item, filters, progress, drafts, or other state;
5. exact metadata-backed ZORA elements, supported events/actions, data needs, and capability gaps;
6. safe areas, keyboard/overlay behavior, scroll ownership, and narrow/wide behavior;
7. real image content that must become an application asset rather than screenshot UI.

Create one shared shell specification for a series: viewport, safe areas, gutters, header geometry,
navigation geometry, surface treatment, type roles, icon family, content density, and state styling.
Reuse it unchanged unless a screen has a documented immersive or modal exception.

## Mobile geometry and typography gate

Use compiled Surface/ZORA tokens when they define these values. Where the owner leaves a design-
brief decision open, use these starting constraints and record them rather than asking an image
model to improvise:

- 16–24 logical-point horizontal gutters and preserved top/bottom safe areas;
- at least 44 by 44 pt touch bounds, or the stricter target-platform convention;
- screen title uses the semantic `h1` role, normally near 32/40 on mobile, one line when practical
  and never more than two; reserve `display` for splash, onboarding, or genuine marketing moments;
- section titles use `h2`/`h3`; body content normally starts near 16/24; metadata never becomes tiny
  merely to fit more content;
- prose measures approximately 45–75 characters per line, with reading surfaces optimized near the
  comfortable middle of that range;
- bottom navigation uses one stable height, label baseline, icon family, selected treatment, and
  safe-area inset across the series;
- a screen must expose its purpose, primary content, and primary action without competing giant
  headings or decorative elements.

Inspect the skill-owned design rules before rendering:

```text
bun .agents/skills/zora-designer/scripts/audit.ts catalog
```

Apply every relevant `generation` rule from that catalog. The rubric belongs to this skill; owner
catalogs and design-system algorithms do not.

## Concept-image specification

Generate one image per distinct screen or state. Every prompt must include:

- exact logical viewport and portrait/landscape orientation;
- shared shell and active navigator item;
- resolved owner palette and type-role sizes, not only mood adjectives;
- exact screen title, copy that must be legible, hierarchy, components, and primary action;
- content quantity that fits the viewport at the declared type scale;
- invariants shared with the other screens;
- prohibitions against device frames, presentation boards, watermarks, illegible labels, invented
  tabs, and oversized marketing typography on ordinary application screens.

For a series, keep the resolved configuration and shell verbatim across prompts. Do not generate a
single contact sheet as a substitute for individual screens unless the user explicitly requests one.

## Review and iterate

Inspect each output at its original dimensions. Reject and regenerate a screen when its title,
navigation, copy, safe areas, hierarchy, component semantics, or geometry diverges from the brief.
Use one targeted correction per iteration. Review the full ordered series together for shared shell,
type scale, navigation, color allocation, state continuity, and visual rhythm.

A visual review can validate visible composition only. It cannot prove runtime actions,
accessibility semantics, focus order, text scaling, or responsive behavior; record those as
not-assessable until implementation evidence exists.
