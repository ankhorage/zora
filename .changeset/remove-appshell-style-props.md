---
'@ankhorage/zora': minor
---

Remove raw `style` and `bodyStyle` escape hatches from `AppShell`. AppShell remains a structural app frame; layout customization should happen through composed ZORA primitives instead of arbitrary root/body style overrides.
