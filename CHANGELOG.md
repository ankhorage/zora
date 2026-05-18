# Changelog

## 2.4.7

### Patch Changes

- f27ce51: Add a controlled Pagination component for paged app data screens.

## 2.4.6

### Patch Changes

- 884095d: Add DatePicker and TimePicker components backed by existing ZORA ActionSheet primitives.

## 2.4.5

### Patch Changes

- 9db4949: Add DataTable for typed app-facing tabular data with row actions, sorting state, loading, empty, and responsive layouts.

## 2.4.4

### Patch Changes

- 50c9679: Expose Surface-backed Menu, DropdownMenu, ActionSheet, and ActionSheetItem components.

## 2.4.3

### Patch Changes

- 2c47d0b: Align Notice metadata with its public color prop.

## 2.4.2

### Patch Changes

- a1934d8: Add Skeleton loading primitives for placeholder card, list, and text states.

## 2.4.1

### Patch Changes

- 2fdb077: Expose a ZORA Toast API backed by the existing Surface Toast implementation.

## 2.4.0

### Minor Changes

- 3c5b384: Remove raw `style` and `bodyStyle` escape hatches from `AppShell`. AppShell remains a structural app frame; layout customization should happen through composed ZORA primitives instead of arbitrary root/body style overrides.

## 2.3.0

### Minor Changes

- 8810525: Add `ButtonGroup` for grouped action layouts such as dialog footers, form actions, card footers, and responsive mobile action stacks.

## 2.2.0

### Minor Changes

- f4d075b: Remove `AuthLayout` from the public API. Compose focused auth or onboarding screens directly with existing layout primitives such as `Center`, `Card`, and `Stack`.

## 2.1.0

### Minor Changes

- cc3d18a: Add component event metadata types and initial event descriptors for form submit, button press, and collection item press events.

## 2.0.0

### Major Changes

- b832d62: Replace ZORA `tone` APIs with Surface-derived `color` and `emphasis` models across components, patterns, and recipes.

  Breaking changes:
  - Removed `ZoraTone` from the public API.
  - Added Surface-derived public color model exports:
    - `ZoraPaletteColor`, `ZoraStatusColor`, `ZoraColor`, `ZoraEmphasis`
    - `ZORA_PALETTE_COLORS`, `ZORA_STATUS_COLORS`, `ZORA_COLORS`, `ZORA_EMPHASES`
  - Updated semantic props from `tone` to `color` for components and patterns that select semantic color roles.
  - Updated text-like APIs to use `emphasis` for content contrast.

  Migration:
  - Replace semantic `tone` props with `color`.
  - Replace text/heading contrast values (`default`, `muted`, `subtle`, `inverse`) to `emphasis`.
  - Keep `tone` only where it represents card-style visual treatment (`ZoraCardTone`).

### Patch Changes

- 02629b6: Update SURFACE

## 1.5.1

### Patch Changes

- 07e9d96: Improve realistic example app chrome by adding compact AppBars with dark-mode toggles, applying semantic Screen backgrounds, and fixing native ZoraTabBar icon/label rendering.

## 1.5.0

### Minor Changes

- f3c2822: Replace the web-oriented `Page` / `PageHeader` / `PageSection` layout model with the native-app-oriented `Screen` / `ScreenSection` model.

  `Screen` is the default scroll owner for normal app screens, while `AppBar` owns the active screen title and screen-level actions. `ScreenSection` replaces page sections as the content grouping primitive inside app screens.

## 1.4.12

### Patch Changes

- 6220959: Add realistic category-based example apps and a scaffold script for creating real Expo Router + React Native Web + ZORA apps.

  The new examples live under `examples/<app-category>/<example-id>/` and use real Expo Router route files, real tab navigation through `ZoraTabBar`, and ZORA-only UI without `StyleSheet`, direct Surface imports, or local styling workaround layers.

  Included examples:
  - `social_community/community-feed`
  - `social_community/photo-social`
  - `social_community/private-messaging`
  - `social_community/visual-discovery`
  - `shopping_commerce/marketplace`
  - `shopping_commerce/storefront`
  - `food_drink/restaurant`

  The examples also document current ZORA product gaps, including future needs for product cards, product grids, menu item cards, reservation summaries, visual wall/grid patterns, and richer chat/status patterns.

## 1.4.11

### Patch Changes

- 6996354: Update packages

## 1.4.10

### Patch Changes

- 59de5b0: Add a reusable MessageBubble pattern with metadata, exports, and showcase coverage.

## 1.4.9

### Patch Changes

- 7089849: Add a reusable ChatListItem pattern with showcase coverage.

## 1.4.8

### Patch Changes

- 66a035d: Add a reusable PostCard pattern with showcase coverage.

## 1.4.7

### Patch Changes

- 9c99aaa: Fix Hero desktop layout

## 1.4.6

### Patch Changes

- Fix mobile layout

## 1.4.5

### Patch Changes

- 76dd6d1: Fix mobile layout

## 1.4.4

### Patch Changes

- 0b43efc: Fix mobile layout

## 1.4.3

### Patch Changes

- 7be4b90: Fix mobile layout, as content was not visible

## 1.4.2

### Patch Changes

- db19750: Hotfix examples/ app: AppBar import

## 1.4.1

### Patch Changes

- 38648df: Add a first-class Hero pattern with structured content, actions, optional media, responsive layout behavior, metadata, and showcase coverage.

## 1.4.0

### Minor Changes

- 1241325: Add `ZORA_COMPONENT_META`, a ZORA-owned component metadata registry for authoring tools.

## 1.3.0

### Minor Changes

- 93791a4: Add `SelectionProvider`, `useSelection`, and `SelectableItem` primitives for contextual selection workflows.

## 1.2.0

### Minor Changes

- de30081: Add a product-facing `AppBar` component backed by the Surface `AppBar` primitive.

  The new component supports title/subtitle content, leading and trailing actions,
  an overflow trigger entrypoint, and generic prop-driven selection mode while
  keeping the existing `Toolbar` API unchanged.

## 1.1.0

### Minor Changes

- 7cec2db: Add provider-neutral image and media upload UI components.

## 1.0.10

### Patch Changes

- aa0daf3: Add Surface-backed navigation chrome building blocks and Expo Router renderer adapters (`NavigationItem`, `NavigationList`, `ZoraTabBar`, `ZoraDrawerContent`).

## 1.0.9

### Patch Changes

- 659ff96: update SURFACE

## 1.0.8

### Patch Changes

- 772236f: Update packages

## 1.0.7

### Patch Changes

- 8795a20: Add common product-facing primitives: `MediaCard`, `MetricCard`, `Progress` (linear v1), `Rating` (readonly v1), and the `Timeline` pattern (vertical-only v1).

## 1.0.6

### Patch Changes

- 9d9f997: Add common UI primitives: `Avatar`, `AvatarGroup`, `Chip`, `ChipGroup`, `SearchBar`, and `FilterBar`. Add list building blocks: `List`, `ListRow`, and `ListSection`. Also add `InputTrailingAction` / `trailingAction` support to `Input`.

## 1.0.5

### Patch Changes

- 9d9f997: Add common UI primitives: `Avatar`, `AvatarGroup`, `Chip`, `ChipGroup`, `SearchBar`, and `FilterBar`. Also add `InputTrailingAction` / `trailingAction` support to `Input`.

## 1.0.4

### Patch Changes

- ba7efff: update packages

## 1.0.3

### Patch Changes

- b2f47e3: update packages

## 1.0.2

### Patch Changes

- d4df5a0: Plan 5 — Semantic theme usage audit

  Audited all ZORA components, layouts, and patterns for consistent use of the
  post-Plan-3/Plan-4 theme model.
  - Confirmed: no stale references to `colorTone`, `ZoraColorTone`, `ZORA_COLOR_TONES`,
    `ZoraColorHarmony`, `ZORA_COLOR_HARMONIES`, `ZoraHexColor`, `AnkhTheme`, direct
    `culori` imports, `ThemeComposerRecommendation`, or local color-math APIs remain in
    src, examples, or README.
  - Fixed: layouts, patterns, and components that used `Box`, `Stack`, `Center`, and
    `Container` imported directly from `@ankhorage/surface` have been updated to import
    from the ZORA foundation layer (`../../foundation`) in line with the Surface import
    policy. Foundation wrappers, theme infrastructure, and Surface-wrapping leaf
    components remain unchanged.
  - Added regression-guard tests in `src/audit.test.ts` covering all required search
    patterns so that stale APIs and bypass imports are caught automatically in CI.
  - All components, layouts, and patterns verified against the current Surface/ZORA
    semantic token model; no hard-coded color literals found in runtime component code.

## 1.0.1

### Patch Changes

- 938bcfe: ThemeComposer now edits the full ZoraTheme source model.
  - ThemeComposer adds name editing with empty-name validation.
  - ThemeComposer adds app category editing via a Select using APP_CATEGORIES from @ankhorage/contracts.
  - ThemeComposer supports optional `appCategories` prop for narrowing the category options list.
  - ThemeComposer validates primary color input with parseHexColorOrThrow from @ankhorage/color-theory while keeping public `primaryColor` as `string`.
  - ThemeComposer preview shows name, appCategory, primaryColor, and harmony metadata.
  - README and examples app updated to reflect the new API.

## 1.0.0

### Major Changes

- 4d50ada: **Breaking: ZORA core theme model and color stack cleanup**

  ## Removed APIs
  - `ZoraTheme.colorTone` — removed; `colorTone` is no longer part of the theme seed
  - `ZoraColorTone` type — removed
  - `ZORA_COLOR_TONES` constant — removed
  - `ZoraHexColor` type — removed; ZORA themes now accept normal string hex values
  - `ZoraComputedTheme.mode` — replaced by `light` and `dark` mode objects
  - `ThemeComposerRecommendation` — removed
  - `ThemeComposerAppMood` — removed
  - `ThemeComposerAppCategory` — removed (was an opaque `string` alias)
  - `ThemeComposerProps.appMood` — removed
  - `ThemeComposerProps.recommendations` — removed
  - Internal color stack (`src/internal/color/`) — removed; ZORA no longer owns color math

  ## Added / Changed APIs
  - `ZoraTheme.name` — now **required** (was optional); ZORA themes must provide a real display name
  - `ZoraTheme.appCategory` — new required field; use `AppCategory` from `@ankhorage/contracts`
  - `ZoraTheme.primaryColor` — remains a public `string`; ZORA validates it internally with `@ankhorage/color-theory`
  - `ZoraComputedTheme` — now has `light: ZoraComputedThemeMode` and `dark: ZoraComputedThemeMode` instead of a single `mode`
  - `ZoraComputedThemeMode` — new type: `{ mode, surfaceTheme, generated, swatches, semanticColors? }`
  - Primary color is now preserved identically for both light and dark `ThemeConfig` modes (no dark-mode mutation)
  - `SurfaceTheme` (from `@ankhorage/surface`) replaces `AnkhTheme` as the resolved runtime theme type

  ## New dependencies
  - `@ankhorage/color-theory@^0.0.2` — canonical color types and generation utilities
  - `@ankhorage/contracts@^1.1.0` — theme config and app category types

  ## Removed dependencies
  - `culori` — no longer a direct ZORA dependency; color math is delegated to `@ankhorage/color-theory`
  - `@types/culori` — removed

  ## Migration

  ```ts
  // Before
  const theme: ZoraTheme = {
    id: 'my-theme',
    name: 'My Theme',
    primaryColor: '#0f766e',
    harmony: 'analogous',
    colorTone: 'jewel',
  };

  // After
  const theme: ZoraTheme = {
    id: 'my-theme',
    name: 'My Theme',
    appCategory: 'developer_tools',
    primaryColor: '#0f766e',
    harmony: 'analogous',
  };
  ```

  The `name` field is now required. `primaryColor` stays app-facing and ergonomic as
  a string, while ZORA validates it when converting the source theme to a runtime
  `ThemeConfig`.

## 0.16.2

### Patch Changes

- f47005a: Refresh Expo showcase coverage and add a policy test for app-facing ZORA imports.
- 5765554: Add the standard package tooling baseline script and workflow files.

## 0.16.1

### Patch Changes

- 0d09c8f: Update SURFACE

## 0.16.0

### Minor Changes

- 5f95af4: Add optional ThemeComposer recommendation props and explicit recommendation application UI.

## 0.15.4

### Patch Changes

- 32e7814: chore(release): trigger

## 0.15.3

### Patch Changes

- 4751b68: feat(theme): add internal semantic color token selection from role scales

## 0.15.2

### Patch Changes

- e91aaf1: update @ankhorage/contracts

## 0.15.1

### Patch Changes

- 98b94df: update @ankhorage/surface

## 0.15.0

### Minor Changes

- 43ebda3: Add ThemeComposer showcase page for visual recipe testing

## 0.14.0

### Minor Changes

- 86c4fdd: Add `ThemeComposer` pattern for live theme seed editing. Exposes a controlled component that lets users edit `primaryColor`, `harmony`, `colorTone`, and `mode`, emitting an updated `ZoraTheme` through `onChange`. Includes a built-in preview area showing Button, Badge, and Card controls reflecting the active theme.

## 0.13.2

### Patch Changes

- 7ad5fab: replace stale tone with colorTone in theme seed examples

## 0.13.1

### Patch Changes

- 99c74b1: Update @ankhorage/zora in example app

## 0.13.0

### Minor Changes

- b72b3e1: Renames the public ZORA theme seed field from `tone` to `colorTone` and adds internal color tone recipes for future theme generation work.

## 0.12.3

### Patch Changes

- 2f08e20: Adds internal role color scale generation for future ZORA theme generation work.

## 0.12.2

### Patch Changes

- da31347: Adds internal hue-role assignment for future ZORA theme generation work.

## 0.12.1

### Patch Changes

- 35c4046: Adds internal harmony hue-slot computation for future ZORA theme generation work.

## 0.12.0

### Minor Changes

- 7279fe4: Derives light and dark primary colors from a single ZORA theme seed using an internal OKLCH color boundary.

## 0.11.0

### Minor Changes

- a600848: Expands scoped theme support across public ZORA components, layouts, patterns, and foundation primitives through shared `themeId` and `mode` base props.

## 0.10.0

### Minor Changes

- 8ad107f: Adds nested ZORA theme scopes with shared `themeId` and `mode` base props so components can override theme context for themselves and their subtrees.

## 0.9.0

### Minor Changes

- 3745d82: Introduces the ZORA theme seed model with `ZoraTheme`, `ZoraComputedTheme`, and
  `zoraDefaultTheme`, replacing public override/config terminology with app-facing
  theme terminology.

## 0.8.1

### Patch Changes

- f7e5fdc: Stop resolving localization internally in Text and Heading. Localization keys now remain passive fallback content so runtime integrations can resolve localized display props before rendering.

## 0.8.0

### Minor Changes

- 5ff5e06: Re-export selected Surface foundation primitives such as `Box`, `Stack`,
  `Grid`, and `Container` through the ZORA public API.

## 0.7.0

### Minor Changes

- b365cde: Add a structured `Heading` component with responsive visual sizing, semantic heading levels, and theme-aware tones.

## 0.6.3

### Patch Changes

- update @ankhorage/surface

## 0.6.2

### Patch Changes

- 939b53e: Add a structured Text component with semantic variants, tones, and responsive props.

## 0.6.1

### Patch Changes

- 67b131e: Approved with amendments.

## 0.6.0

### Minor Changes

- ab9fc54: Add provider-agnostic form primitives and auth form patterns for sign-in, sign-up, password reset, and OTP flows.

## 0.5.3

### Patch Changes

- bbc43fd: update @ankhorage/surface

## 0.5.2

### Patch Changes

- 1b6e3e1: Update SURFACE

## 0.5.1

### Patch Changes

- 1f6d9a7: Fix infinite render loop in Modal and Drawer

  Stabilizes onDismiss handling to prevent repeated state updates causing
  "Maximum update depth exceeded" errors when opening overlays.

## 0.5.0

### Minor Changes

- e33b114: feat(zora): redesign AppShell as structural root layout with header/footer/overlay slots

## 0.4.1

### Patch Changes

- 37681ac: Update README.md with CheckboxGroup & RadioGroup

## 0.4.0

### Minor Changes

- e6ea86b: Add RadioGroup and CheckboxGroup components built on Surface primitives.

## 0.3.10

### Patch Changes

- ff6250e: Fixed toolbar gets width of its content

## 0.3.9

### Patch Changes

- edb3253: Trigger release with new @ankhorage/surface version

## 0.3.8

### Patch Changes

- 9657e2b: Update @ankhorage/surface version
- Update @ankhorage/surface version to latest

## 0.3.7

### Patch Changes

- e9d563b: Export src/ for better Metro debugging

## 0.3.6

### Patch Changes

- 3d66c66: Zora wraps ResponsiveProvider now

## 0.3.5

### Patch Changes

- 176be84: Export ResponsiveProvider to Public API

## 0.3.4

### Patch Changes

- c7a5254: Export Icon and IconProps to public API

## 0.3.3

### Patch Changes

- f3a3da3: Export IconProps

## 0.3.2

### Patch Changes

- 5348764: Sort imports

## 0.3.1

### Patch Changes

- 798dc20: Add missing useZoraTheme file

## 0.3.0

### Minor Changes

- 961422e: Export Icon component to public API

## 0.2.2

### Patch Changes

- 6e7fd59: update zora version in the example app

## 0.2.1

### Patch Changes

- 057704b: Update example app to use AppShell

## 0.2.0

### Minor Changes

- c6b0a3b: Add AppShell Layout to wrap the whole app (and use e.g. light/dark backgrounds

### Patch Changes

- 61687ba: fix(ci): resolve ESLint type errors in example app

## 0.1.4

### Patch Changes

- c2605b1: feat(example): restructure showcase into components and scenario-based patterns

## 0.1.3

### Patch Changes

- 14ee18b: fix(ui): prevent nested button elements in SettingsRow and Card

## 0.1.2

### Patch Changes

- 7328ea5: Fix release pipeline (OIDC / changesets publish)

## 0.1.1

### Patch Changes

- Updated the example app

## 0.1.0

### Minor Changes

- Add Studio-unblocking reusable UI elements including IconButton, Tabs, Toolbar, Select, disclosure sections, responsive panels, inspector fields, tree views, tile grids, and collection editor shells.

## 0.0.4

### Patch Changes

- Expand the README into a full public API catalogue with collapsible property details, documented inherited prop surfaces, and Expo showcase usage instructions.

## 0.0.3

### Patch Changes

- Refresh the README copy so the published package overview, installation, usage, and positioning match the current messaging.

## 0.0.2

### Patch Changes

- Update the published Surface dependency to `0.1.4` and align the Expo showcase app for the web-ready package stack.

## 0.0.1

### Patch Changes

- Bootstrap the initial ZORA package with theme preset, opinionated Surface wrappers, composition patterns, and app-shell layouts.

All notable changes to this project will be documented in this file.

The format is based on Changesets and the package changelog generated during release.
