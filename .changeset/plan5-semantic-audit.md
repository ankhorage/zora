---
'@ankhorage/zora': patch
---

Plan 5 — Semantic theme usage audit

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
