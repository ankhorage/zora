---
"@ankhorage/zora": patch
---

Stop resolving localization internally in Text and Heading. Localization keys now remain passive fallback content so runtime integrations can resolve localized display props before rendering.
