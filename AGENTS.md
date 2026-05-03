# Ankhorage Agent Guide for `@ankhorage/zora`

This repository is a strict TypeScript Bun package for a standalone React Native and React Native Web UI kit built on `@ankhorage/surface`.

ZORA must remain usable outside Ankhorage-generated apps. It provides reusable UI components, patterns, layouts, and theme helpers while staying independent from app templates, Studio authoring logic, runtime interpretation, CLI generation, orchestrator workflows, and business-domain semantics.

All coding agents must follow the rules below.

## Non-negotiables

- Do not introduce `any`, `as any`, `unknown as any`, or broad casts to silence errors.
- Do not add `@ts-ignore` / `@ts-expect-error` unless explicitly requested.
- Do not add `eslint-disable` or weaken lint rules/config to “make it pass”.
- Do not weaken tsconfig strictness or change module resolution settings.
- Do not perform large refactors unless explicitly requested.
- Do not add business logic, runtime schema logic, generated app logic, CLI logic, Studio-only behavior, orchestrator logic, or deployment orchestration.
- Do not import from consumer packages such as Studio, runtime, CLI, templates, generated apps, or orchestrator modules.
- Do not introduce domain-specific concepts such as manifest nodes, actions, modules, authoring layers, screen generation, or app categories.
- Do not add browser-only APIs without a React Native compatible abstraction.
- Do not add heavy UI frameworks or styling systems.
- If you cannot proceed without violating rules: STOP and propose 2–3 options with tradeoffs.

## Required verification

Before concluding any code task, run from repo root:

- `bun run build`
- `bun run lint:fix`
- `bun run test`
- `bun run knip`

For release or packaging-related work, also run:

- `npm pack --dry-run`

If any command fails: STOP and report the failure plus the minimal fix.

## Package responsibility

This package owns reusable UI for React Native and React Native Web:

- low-level ZORA components, for example `Button`, `IconButton`, `Card`, `Input`, `Select`, `Tabs`, `Textarea`, `Toolbar`, and `Text`
- semantic patterns, for example `Panel`, `Notice`, `EmptyState`, `FormField`, `SectionHeader`, `SettingsRow`, `ResponsivePanel`, `TreeView`, `TileGrid`, and `CollectionEditor`
- page/layout primitives, for example `Page`, `PageHeader`, `PageSection`, `AppShell`, `AuthLayout`, `SidebarLayout`, `TopbarLayout`, and `SettingsLayout`
- theme helpers, for example `ZoraProvider`, `createZoraTheme`, and `useZoraTheme`
- generic cross-platform component APIs with predictable props
- accessibility behavior for interactive UI
- README/examples for generic UI usage

This package does not own:

- app manifest interpretation
- runtime node rendering
- Studio authoring behavior
- generated routes or generated layouts
- template category decisions
- app-specific screen content
- auth provider integrations
- Supabase or other provider logic
- CLI file generation
- orchestrator/module install logic
- deployment logic
- persistence, database, network, or domain workflows

## Dependency boundaries

Allowed dependency direction:

- ZORA may import from `@ankhorage/surface` as its render foundation.
- ZORA may use `react` and `react-native`.
- ZORA may use already-approved lightweight peer dependencies such as `@react-native-picker/picker`, `@expo/vector-icons`, and `expo-font` where the existing package contract requires them.

Forbidden dependencies:

- `@ankhorage/cli`
- `@ankhorage/runtime`
- `@ankhorage/studio`
- `@ankhorage/templates`
- `@ankhorage/orchestrator`
- generated app code
- Expo Router
- Next.js app code
- backend/provider SDKs
- app manifests or runtime schema packages, unless explicitly approved for a clearly UI-neutral type-only boundary

If a feature appears to require one of these dependencies, STOP and propose a boundary-safe alternative.

## Layering rules

Architecture:

```txt
@ankhorage/surface → render foundation primitives
@ankhorage/zora    → reusable UI system
Consumers          → Studio, apps, templates, runtime adapters
```

Folder responsibilities:

```txt
src/components/*   → generic low-level UI components
src/patterns/*     → semantic reusable UI blocks
src/layout/*       → page-level composition and shells
src/theme/*        → ZORA theme defaults and provider helpers
src/internal/*     → shared recipes/resolvers only
```

Rules:

- Components may depend on Surface and internal helpers.
- Components must not depend on Patterns or Layouts.
- Patterns may depend on Components and Surface.
- Layouts may depend on Components, Patterns, and Surface.
- Theme modules must not depend on Components, Patterns, or Layouts.
- Internal helpers must stay generic and reusable.
- Do not put component-specific one-off logic into `src/internal/recipes.ts` unless reused across multiple elements.

## File and export conventions

Each public element must follow this shape:

```txt
src/{components|patterns|layout}/element-name/
  ElementName.tsx
  types.ts
  index.ts
```

Every public element must be exported from `src/index.ts`:

```ts
export type { ElementNameProps } from './...';
export { ElementName } from './...';
```

Type exports must stay explicit. Do not rely on broad wildcard exports for components, patterns, or layouts unless the repo already uses that convention for a specific module.

Build outputs must go to `dist/`. Never write build artifacts into `src/`.

## Component API expectations

Public APIs should be:

- additive unless a breaking change is explicitly requested
- typed without escape hatches
- cross-platform by default
- predictable on React Native and React Native Web
- accessible for interactive elements
- generic enough for apps, Studio, and templates without mentioning those consumers

Prefer controlled APIs when state is involved:

```ts
value + onChange;
```

Avoid hidden behavior:

- no implicit global state
- no silent side effects
- no consumer-specific branching
- no runtime/schema assumptions

Prefer composition over huge prop surfaces, but use structured props where they protect consistency.

## Styling and theme rules

- Use the active ZORA/Surface theme instead of hardcoded one-off colors.
- Prefer semantic tones over arbitrary colors.
- Prefer existing spacing, radius, typography, and color semantics.
- Do not expose arbitrary `style` props on new high-level ZORA components unless explicitly approved.
- Do not expose arbitrary raw string color APIs on new components unless explicitly approved.
- If a component needs visual variation, model it as structured props such as `tone`, `variant`, `size`, `emphasis`, or `align`.
- Mobile and web must both be considered for layout and interaction behavior.
- Responsive behavior should use the existing responsive provider/runtime instead of manual platform-specific hacks.

## Text component initiative rules

When working on the ZORA `Text` component:

- Add `Text` under `src/components/text/`.
- Export `Text` and `TextProps` from `src/index.ts`.
- Do not simply re-export Surface `Text` as the public API.
- ZORA may use Surface `Text` internally as the render foundation.
- Provide a ZORA-owned structured API for normal copy.
- Support useful variants such as body, lead, small, caption, label, eyebrow, and mono/code if approved by the plan.
- Support semantic tones such as default, muted, subtle, inverse, danger, success, warning, and primary if supported by the design.
- Support structured alignment, weight, italic, and truncation/line count.
- Support responsive props through existing responsive infrastructure where needed.
- Do not add arbitrary `style` or raw unrestricted color props in the first version.
- Migrate ZORA internals to consume ZORA `Text` where this does not create circular imports or layer violations.
- Keep `Heading` as the title primitive; do not merge heading behavior into normal `Text` unless explicitly approved.

## Accessibility rules

- Interactive components must support accessible labels.
- Icon-only actions must require `label` or `accessibilityLabel`.
- Form-related components must preserve label, helper, error, and required-state semantics.
- Text truncation must not remove required accessible labels from interactive components.
- Do not sacrifice accessibility to simplify styling.

## Testing rules

- Tests must be deterministic and runnable offline.
- Do not perform real network calls.
- Prefer resolver/unit tests for shared style and behavior logic.
- Test public helper behavior when it affects component output.
- Test edge cases for controlled inputs, validation helpers, and shared recipes where applicable.
- Do not add screenshot or browser-only test requirements unless explicitly requested.

## README and examples

README changes should:

- describe ZORA as a standalone React Native / React Native Web UI kit
- avoid Ankhorage ecosystem positioning unless needed for package scope or dependency explanation
- avoid Studio/runtime/template-specific language
- show generic consumer usage
- keep examples runnable and concise
- update the component export list when a new public component is added

Example app changes should:

- stay inside `examples/expo-showcase/`
- demonstrate generic UI usage
- avoid app-specific or generated-app assumptions
- work on mobile and web

## Changesets

If a completed task changes the published package API, behavior, or README in a release-relevant way, create or update a `.changeset/*.md` file before committing that work.

Repo-doc/tooling-only changes do not need a changeset unless they affect package release behavior.

Use patch changesets for additive components and documentation updates unless the task explicitly requires a minor or major release.

## Mandatory workflow

1. Plan first: list the exact files you will touch and why.
2. Keep changes micro-scoped: small PR-sized steps, one concern at a time.
3. Do not edit files during planning.
4. Apply changes only after the plan has been approved.
5. After edits: show `git diff --stat` and briefly explain changes.
6. Rollback rule: if a step goes sideways, revert to the last checkpoint instead of trial-and-error edits.
7. If a completed task changes the published package, create or update a `.changeset/*.md` file before committing that work.
8. After verification, commit the completed unit of work unless the user explicitly says not to.

## Current initiative

We are adding missing generic UI building blocks so consumers can rely on ZORA instead of importing Surface directly for common UI needs.

The immediate initiative is a structured ZORA `Text` component.

High-level goals:

- standalone public `Text` export from `@ankhorage/zora`
- structured normal-copy API
- theme-aware typography and semantic tones
- mobile and web support
- responsive behavior through the existing provider/runtime
- no arbitrary style or raw color API in the first version
- internal ZORA adoption where layering allows it
- README and showcase coverage
- changeset for the published API addition

## Tool-specific notes

### Codex

- Do not edit files during planning.
- Output a plan first.
- Wait for approval before applying changes.
- Add or update the relevant `.changeset/*.md` file before committing package changes.
- Commit completed, verified work unless the user explicitly asks you not to.

### Gemini CLI / gemini-kit

- Always run a plan step before execution.
- Execute work in micro-plans.
- Checkpoint with git before risky execution steps.
- Add or update the relevant `.changeset/*.md` file before committing package changes.
- Commit completed, verified work unless the user explicitly asks you not to.

## Final principle

ZORA is the reusable UI system. Consumers should use ZORA; ZORA must not adapt itself to any single consumer.
