---
'@ankhorage/zora': major
---

**Breaking: ZORA core theme model and color stack cleanup**

## Removed APIs

- `ZoraTheme.colorTone` — removed; `colorTone` is no longer part of the theme seed
- `ZoraColorTone` type — removed
- `ZORA_COLOR_TONES` constant — removed
- `ZoraHexColor` type — removed; use `HexColor` from `@ankhorage/color-theory`
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
- `ZoraTheme.primaryColor` — type changed to branded `HexColor` from `@ankhorage/color-theory`; use `parseHexColorOrThrow()` to create values
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
import { parseHexColorOrThrow } from '@ankhorage/color-theory';

const theme: ZoraTheme = {
  id: 'my-theme',
  name: 'My Theme',
  appCategory: 'developer_tools',
  primaryColor: parseHexColorOrThrow('#0f766e'),
  harmony: 'analogous',
};
```

The `name` field is now required. `primaryColor` is a branded `HexColor`; use
`parseHexColorOrThrow()` to produce a validated branded value from a string.
