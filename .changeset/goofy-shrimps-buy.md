---
'@ankhorage/zora': major
---

Replace ZORA `tone` APIs with Surface-derived `color` and `emphasis` models across components, patterns, and recipes.

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
