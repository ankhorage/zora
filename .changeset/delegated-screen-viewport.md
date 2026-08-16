---
"@ankhorage/zora": patch
---

Define Screen scroll ownership explicitly: normal screens own scrolling, while `scroll={false}` preserves a bounded viewport for child-owned scroll and gesture surfaces. Require `@ankhorage/surface` 2.2.1 or newer so Stack preserves direct-child flex and min-size semantics throughout that viewport chain.
