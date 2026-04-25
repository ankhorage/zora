# ZORA (React Native + React Native Web UI Kit on @ankhorage/surface)

You are an assistant working on a **strict, cross-platform UI library**. Your job is to make **minimal, correct, reusable, and type-safe** changes.

ZORA is a **generic UI kit**, not an app, not a runtime, and not an authoring tool.

## Hard Non-Negotiables

### 1. No type escape hatches

* NEVER introduce `any`, `as any`, `unknown as any`, or unsafe casts.
* NEVER add `@ts-ignore` / `@ts-expect-error` unless explicitly requested.
* If types are difficult, STOP and propose 2–3 correct options with tradeoffs.

### 2. No lint rule sabotage

* NEVER add `eslint-disable` or weaken lint rules.
* NEVER change lint config to “make it pass”.

### 3. No weakening of strictness

* NEVER loosen TypeScript strict settings.
* NEVER modify tsconfig to reduce safety.

### 4. No scope creep

* Only touch files required for the current task.
* If more changes are needed, STOP and propose a follow-up.

### 5. No trial-and-error coding

* Do NOT randomly change code until it works.
* If something breaks, revert and propose a correct fix.

## ZORA Core Principles

### 1. ZORA is a UI kit

ZORA provides:

* UI components, for example Button, Card, Input
* UI patterns, for example Panel, EmptyState, FormField
* Layouts, for example Page, SidebarLayout

ZORA must NOT:

* contain business logic
* know about runtime schemas, nodes, or actions
* depend on consumer apps/packages

### 2. Strict layering

Architecture:

```txt
@ankhorage/surface → primitives
ZORA               → UI system
Consumers          → Studio, apps, templates
```

Rules:

* ZORA MAY import from `@ankhorage/surface`.
* ZORA MUST NOT import from consumers of ZORA.
* ZORA MUST remain reusable in any React Native / React Native Web project.

### 3. Components vs patterns vs layouts

Components:

* Low-level UI building blocks
* Example: Button, Input, Card

Patterns:

* Semantic UI blocks
* Example: Panel, EmptyState, FormField

Layouts:

* Page-level composition
* Example: Page, SidebarLayout

Rule:

* If it has user-facing meaning, it is probably a Pattern.
* If it is mostly visual structure, it is probably a Component.

### 4. No domain semantics

ZORA MUST NOT include domain-specific concepts such as:

* Action
* Node
* Schema
* Module
* Layer
* Runtime
* Authoring

Allowed:

* Generic UI concepts such as Select, Tabs, Toolbar, TreeView.

## File and Export Conventions

### 1. Folder structure

Each element MUST follow:

```txt
src/{components|patterns|layout}/element-name/
  ElementName.tsx
  types.ts
  index.ts
```

### 2. Root exports

Every public element must be exported from `src/index.ts`:

```ts
export type { ElementNameProps } from './...';
export { ElementName } from './...';
```

### 3. No cross-folder leakage

* Components must not depend on Patterns.
* Patterns may depend on Components.
* Layouts may depend on Patterns and Components.

### 4. Recipes usage

`src/internal/recipes.ts` is ONLY for:

* shared visual mappings
* size / tone / spacing resolution
* reusable style logic

Do NOT add component-specific logic unless reused across multiple elements.

## Dependency Rules

### 1. Keep dependencies minimal

Allowed by default:

* `react`
* `react-native`
* `@ankhorage/surface`

Optional only when required:

* `@react-native-picker/picker` for Select

### 2. Peer dependencies

If a component requires a package such as Picker:

* add it as a `peerDependency`
* add it as a `devDependency` for local testing

### 3. No heavy UI libraries

Do NOT introduce:

* external UI frameworks
* styling libraries
* large dependencies

ZORA must stay lightweight.

## Component Design Rules

### 1. Controlled first

Prefer controlled APIs:

```ts
value + onChange
```

Avoid uncontrolled state unless clearly needed.

### 2. Accessibility required

* Every interactive element must support accessibility labels.
* Icon-only buttons MUST require `label` or `accessibilityLabel`.

### 3. Composition over configuration

Prefer composable APIs:

```tsx
<Panel>
  <PanelHeader />
  <PanelBody />
</Panel>
```

Avoid large prop-driven APIs unless they are clearly justified.

### 4. No hidden behavior

* No implicit state mutations.
* No side effects.
* No global state.

## Build and Verification Rules

### 1. Required commands

Before finishing ANY task, run:

```bash
bun run build
bun run lint:fix
bun run test
bun run knip
```

If anything fails:

* STOP
* explain the failure
* propose the minimal fix

### 2. Output rules

* All builds must go to `dist/`.
* No build artifacts in `src/`.

### 3. Changesets

If public API changes:

* create or update a `.changeset/*.md`
* prefer `bun run changeset`

## gemini-kit Workflow Rules

### 1. Plan first

* ALWAYS run `/plan` before coding.
* `/cook` only with an approved plan file.

### 2. Plan requirements

A plan MUST include:

* exact file paths
* exact components to add or change
* public prop/type definitions
* acceptance criteria:

  * `bun run build`
  * `bun run lint:fix`
  * `bun run test`
  * `bun run knip`

Forbidden changes MUST be listed:

* no `any`
* no lint disables
* no tsconfig weakening
* no domain logic
* no consumer-package imports

### 3. Checkpoint before execution

* Create a git checkpoint before `/cook`.
* If rules are violated, STOP and revert.

## Work Style

### 1. Minimal patches

* Make small, focused changes only.
* Do not perform large refactors unless explicitly requested.

### 2. Explicit diffs

After changes:

* show `git diff --stat`
* explain each change briefly

### 3. Stable public API

* Avoid breaking changes unless explicitly requested.
* Prefer additive changes.

## STOP Conditions

STOP if:

* You need `any` or unsafe casts.
* You are unsure about public API design.
* A change introduces domain-specific semantics.
* A dependency decision is unclear.
* Multiple valid architectural options exist.

## Current Initiative: Studio-Unblocking Components

We are adding missing generic UI building blocks:

* IconButton
* Tabs / TabBar
* Toolbar
* DisclosureSection
* Select
* InspectorField
* SwitchField
* ResponsivePanel
* TreeView
* TileGrid / PaletteItem
* CollectionEditor

Rules:

* Build GENERIC versions only.
* No Studio-specific behavior.
* Prefer composition with existing ZORA components.
* Keep APIs minimal and predictable.
* Keep drag-and-drop behavior out of ZORA for now.

## Final Principle

ZORA is the **single source of UI truth**.

Consumers should use ZORA. ZORA must not adapt to consumers.
